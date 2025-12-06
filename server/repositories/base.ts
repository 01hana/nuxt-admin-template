import { db } from '../utils/db';
import { appError } from '../utils/appError';

interface TableParams {
  sortField: string;
  sortOrder: string;
  keyword: string;
  filters: Record<string, any>;
  length: number;
  offset: number;
}

export class BaseRepository {
  table: string;
  sortableFields: string[];
  searchableFields: string[];
  selectableFields: string[];

  constructor(
    table: string,
    sortableFields: string[],
    searchableFields: string[],
    selectableFields: string[],
  ) {
    this.table = table;
    this.sortableFields = sortableFields;
    this.searchableFields = searchableFields;
    this.selectableFields = selectableFields;
  }

  protected useUUID: boolean = true;

  protected get selectId() {
    return this.useUUID ? 'BIN_TO_UUID(id, 1) as id' : 'id';
  }

  protected get whereId() {
    return this.useUUID ? 'id = UUID_TO_BIN(?, 1)' : 'id = ?';
  }

  /**
   * 共用 WHERE 子句產生器
   */
  private buildBaseQuery(keyword: string, filters: Record<string, any>, params: any[]): string {
    let sql = `FROM \`${this.table}\` WHERE deleted_at IS NULL`;

    //  關鍵字搜尋
    if (keyword && this.searchableFields.length) {
      const conditions = this.searchableFields.map(f => `\`${f}\` LIKE ?`).join(' OR ');

      sql += ` AND (${conditions})`;

      this.searchableFields.forEach(() => params.push(`%${keyword}%`));
    }

    // 篩選：自動跳過不存在欄位
    const validColumns = new Set([
      ...this.selectableFields,
      ...this.searchableFields,
      ...this.sortableFields,
    ]);

    for (const [field, value] of Object.entries(filters)) {
      if (!validColumns.has(field)) continue; // 如果該欄位不屬於這個表 → 跳過

      const arr = Array.isArray(value) ? value : [value];
      if (!arr.length) continue;

      const placeholders = arr.map(() => '?').join(', ');
      sql += ` AND \`${field}\` IN (${placeholders})`;
      params.push(...arr);
    }

    return sql;
  }

  /**
   * 查詢資料 + 總數
   */
  async findAll(options: TableParams) {
    const { sortField, sortOrder, keyword, filters = {}, length, offset } = options;

    const params: any[] = [];

    const selectClause = [this.selectId, ...this.selectableFields].join(', ');
    const baseSql = this.buildBaseQuery(keyword, filters, params);

    //  排序安全檢查
    const safeSortField = this.sortableFields.includes(sortField)
      ? sortField
      : this.sortableFields[0];
    const safeSortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // 主查詢
    const sql = `
      SELECT ${selectClause}
      ${baseSql}
      ORDER BY ${safeSortField} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;
    params.push(length, offset);

    const [rows]: any = await db.query(sql, params);

    // 查總數（使用相同 baseSql，但不含 LIMIT/OFFSET）
    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total ${baseSql}`,
      params.slice(0, -2), // 拿掉 LIMIT / OFFSET 參數
    );

    return {
      data: rows,
      total: countRows[0].total,
    };
  }

  /**
   * 查單筆
   */
  async findById(id: string | number) {
    const selectClause = [this.selectId, ...this.selectableFields].join(', ');

    const [rows]: any = await db.query(
      `SELECT ${selectClause} FROM \`${this.table}\` WHERE ${this.whereId}`,
      [id],
    );

    if (!rows.length) return null;

    const [row] = rows;

    if ('status' in row) {
      row.status = row.status === 1 || row.status === '1' ? true : false;
    }

    return row;
  }

  /**
   *  新增
   */
  async insert(data: Record<string, any>) {
    const keys = Object.keys(data);
    if (!keys.length) return;

    const columns = keys.join(', ');

    const placeholders = keys
      .map(k => {
        if (k === 'id' && this.useUUID) return 'UUID_TO_BIN(?, 1)';
        return '?';
      })
      .join(', ');

    const values = Object.values(data);

    const sql = `
      INSERT INTO \`${this.table}\` (${columns}, created_at, updated_at)
      VALUES (${placeholders}, NOW(), NOW())
    `;

    await db.query(sql, values);
  }

  /**
   *  更新
   */
  async update(id: string | number, data: Record<string, any>) {
    const entries = Object.entries(data).filter(([_, v]) => v !== undefined);

    if (!entries.length) return;

    const setClause = entries.map(([k]) => `\`${k}\` = ?`).join(', ');
    const values = entries.map(([_, v]) => v);

    const sql = `
      UPDATE \`${this.table}\`
      SET ${setClause}, updated_at = NOW()
      WHERE ${this.whereId}
    `;

    await db.query(sql, [...values, id]);
  }

  /**
   *  軟刪除
   */
  async softDelete(ids: string[] | number[]) {
    if (!Array.isArray(ids) || !ids.length) return;

    let placeholders;

    if (this.useUUID) {
      placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');
    } else {
      placeholders = ids.map(() => '?').join(',');
    }

    const sql = `
      UPDATE \`${this.table}\`
      SET deleted_at = NOW()
      WHERE id IN (${placeholders})
    `;

    await db.query(sql, ids);
  }

  /**
   *  硬刪除
   */
  async hardDelete(ids: string[] | number[]) {
    if (!Array.isArray(ids) || !ids.length) return;

    let placeholders;

    if (this.useUUID) {
      placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');
    } else {
      placeholders = ids.map(() => '?').join(',');
    }

    const sql = `
      DELETE FROM \`${this.table}\`
      WHERE id IN (${placeholders})
    `;

    await db.query(sql, ids);
  }

  /**
   *  檢查重複
   */
  async checkUnique(
    data: any,
    keys: string[],
    translate: Record<string, string>,
    excludeId?: string | number,
  ) {
    if (!keys.length) return;

    const conditions: string[] = [];
    const params: any[] = [];

    for (const key of keys) {
      if (data[key] !== undefined && data[key] !== null) {
        conditions.push(`${key} = ?`);

        params.push(data[key]);
      }
    }

    if (!conditions.length) return;

    let sql = `
      SELECT ${this.selectId}, ${keys.join(',')}
      FROM ${this.table}
      WHERE (${conditions.join(' OR ')})
    `;

    // UPDATE 模式：排除自己
    if (excludeId !== undefined && excludeId !== null) {
      if (this.useUUID) {
        sql += ` AND id <> UUID_TO_BIN(?, 1)`;
      } else {
        sql += ` AND id <> ?`;
      }

      params.push(excludeId);
    }

    const [rows]: any = await db.query(sql, params);

    if (!rows.length) return;

    const [row] = rows;

    // 找出是哪個欄位重複
    for (const key of keys) {
      if (row[key] === data[key]) {
        const label = translate[key] ?? key;

        console.log('unique go here');

        throw appError(400, `${label} 已被使用`);
      }
    }
  }
}

import { db } from '../utils/db';

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

    const selectClause = ['BIN_TO_UUID(id, 1) as id', ...this.selectableFields].join(', ');
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
  async findById(id: string) {
    const selectClause = ['BIN_TO_UUID(id, 1) as id', ...this.selectableFields].join(', ');

    const [rows]: any = await db.query(
      `SELECT ${selectClause} FROM \`${this.table}\` WHERE id = UUID_TO_BIN(?, 1)`,
      [id],
    );

    return rows.length ? rows[0] : null;
  }

  /**
   *  新增
   */
  async insert(data: Record<string, any>) {
    const keys = Object.keys(data);
    if (!keys.length) return;

    const columns = keys.join(', ');
    const placeholders = keys.map(k => (k === 'id' ? 'UUID_TO_BIN(?, 1)' : '?')).join(', ');
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
  async update(id: string, data: Record<string, any>) {
    const entries = Object.entries(data).filter(([_, v]) => v !== undefined);

    if (!entries.length) return;

    const setClause = entries.map(([k]) => `\`${k}\` = ?`).join(', ');
    const values = entries.map(([_, v]) => v);

    const sql = `
      UPDATE \`${this.table}\`
      SET ${setClause}, updated_at = NOW()
      WHERE id = UUID_TO_BIN(?, 1)
    `;

    await db.query(sql, [...values, id]);
  }

  /**
   *  軟刪除
   */
  async softDelete(ids: string[]) {
    if (!Array.isArray(ids) || !ids.length) return;

    const placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');
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
  async hardDelete(ids: string[]) {
    if (!Array.isArray(ids) || !ids.length) return;

    const placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');
    const sql = `
      DELETE FROM \`${this.table}\`
      WHERE id IN (${placeholders})
    `;

    await db.query(sql, ids);
  }
}

// export class BaseRepository {
//   table: string;
//   sortableFields: string[];
//   searchableFields: string[];
//   selectableFields: string[];

//   constructor(
//     table: string,
//     sortableFields: string[],
//     searchableFields: string[],
//     selectableFields: string[],
//   ) {
//     this.table = table;
//     this.sortableFields = sortableFields;
//     this.searchableFields = searchableFields;
//     this.selectableFields = selectableFields;
//   }

//   async findAll(options: TableParams) {
//     const { sortField, sortOrder, keyword, filters, length, offset } = options;
//     const params: any[] = [];

//     const selectClause = ['BIN_TO_UUID(id, 1) as id', ...this.selectableFields].join(', ');

//     let sql = `SELECT ${selectClause} FROM \`${this.table}\` WHERE deleted_at IS NULL`;

//     // 搜尋
//     if (keyword && this.searchableFields.length) {
//       const conditions = this.searchableFields.map(field => `${field} LIKE ?`).join(' OR ');

//       sql += ` AND (${conditions})`;

//       this.searchableFields.forEach(() => {
//         params.push(`%${keyword}%`);
//       });
//     }

//     // 篩選
//     for (const [field, value] of Object.entries(filters)) {
//       sql += ` AND ${field} = ?`;
//       params.push(value);
//     }

//     // 排序
//     const safeSortField = this.sortableFields.includes(sortField)
//       ? sortField
//       : this.sortableFields[0];
//     const safeSortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
//     sql += ` ORDER BY ${safeSortField} ${safeSortOrder}`;

//     // 分頁
//     sql += ` LIMIT ? OFFSET ?`;
//     params.push(length, offset);

//     const [rows]: any = await db.query(sql, params);

//     return rows;
//   }

//   async countAll(options: { keyword: string; filters: { field: string; value: any } }) {
//     const { keyword, filters } = options;
//     const params: any[] = [];

//     let sql = `SELECT COUNT(*) as total FROM \`${this.table}\` WHERE deleted_at IS NULL`;

//     // 搜尋
//     if (keyword && this.searchableFields.length) {
//       const conditions = this.searchableFields.map(field => `${field} LIKE ?`).join(' OR ');

//       sql += ` AND (${conditions})`;

//       this.searchableFields.forEach(() => {
//         params.push(`%${keyword}%`);
//       });
//     }

//     // 篩選
//     for (const [field, value] of Object.entries(filters)) {
//       sql += ` AND ${field} = ?`;
//       params.push(value);
//     }

//     const [rows]: any = await db.query(sql, params);

//     return rows[0].total;
//   }

//   async findById(id: string) {
//     const selectClause = ['BIN_TO_UUID(id, 1) as id', ...this.selectableFields].join(', ');

//     const [rows]: any = await db.query(
//       `SELECT ${selectClause} FROM \`${this.table}\` WHERE id = UUID_TO_BIN(?, 1)`,
//       [id],
//     );

//     return rows.length ? rows[0] : null;
//   }

//   async insert(data: Record<string, any>) {
//     const keys = Object.keys(data);

//     if (!keys.length) return;

//     const columns = keys.join(', ');
//     const placeholders = keys.map(key => (key === 'id' ? 'UUID_TO_BIN(?, 1)' : '?')).join(', ');
//     const values = Object.values(data);

//     const sql = `INSERT INTO \`${this.table}\` (${columns}, created_at, updated_at)
//                VALUES (${placeholders}, NOW(), NOW())`;

//     await db.query(sql, values);
//   }

//   async update(id: string, data: Record<string, any>) {
//     // 過濾掉 value 為 undefined 的欄位
//     const entries = Object.entries(data).filter(([_, value]) => value !== undefined);

//     if (entries.length === 0) return; // 沒有要更新的欄位就直接跳過

//     const keys = entries.map(([key]) => key);
//     const values = entries.map(([_, value]) => value);

//     const setClause = keys.map(key => `${key} = ?`).join(', ');

//     const sql = `UPDATE \`${this.table}\` SET ${setClause}, updated_at = NOW() WHERE id = UUID_TO_BIN(?, 1)`;

//     await db.query(sql, [...values, id]);
//   }

//   async softDelete(ids: string[]) {
//     if (!Array.isArray(ids) || ids.length === 0) return;

//     const placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');

//     const sql = `UPDATE \`${this.table}\` SET deleted_at = NOW() WHERE id IN (${placeholders})`;

//     await db.query(sql, ids);
//   }

//   async hardDelete(ids: string[]) {
//     if (!Array.isArray(ids) || ids.length === 0) return;

//     const placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');

//     const sql = `DELETE FROM \`${this.table}\` WHERE id IN (${placeholders})`;

//     await db.query(sql, ids);
//   }
// }

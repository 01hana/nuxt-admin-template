import { db } from '../utils/db';

interface tableParams {
  sortField: string;
  sortOrder: string;
  keyword: string;
  filters: { field: string; value: any }[];
  length: number;
  offset: number;
}

export class BaseRepository {
  table: string;
  searchableFields: string[];
  sortableFields: string[];
  selectableFields: string[];

  constructor(
    table: string,
    searchableFields: string[],
    sortableFields: string[],
    selectableFields: string[],
  ) {
    this.table = table;
    this.searchableFields = searchableFields;
    this.sortableFields = sortableFields;
    this.selectableFields = selectableFields;
  }

  async findAll(options: tableParams) {
    const { sortField, sortOrder, keyword, filters, length, offset } = options;
    const params: any[] = [];

    const selectClause = ['BIN_TO_UUID(id, 1) as id', ...this.selectableFields].join(', ');

    let sql = `SELECT ${selectClause} FROM \`${this.table}\` WHERE deleted_at IS NULL`;

    // 搜尋
    if (keyword && this.searchableFields.length) {
      const conditions = this.searchableFields.map(f => `${f} LIKE ?`).join(' OR ');
      sql += ` AND (${conditions})`;
      this.searchableFields.forEach(() => {
        params.push(`%${keyword}%`);
      });
    }

    // 篩選
    for (const filter of filters) {
      sql += ` AND ${filter.field} = ?`;
      params.push(filter.value);
    }

    // 排序
    const safeSortField = this.sortableFields.includes(sortField)
      ? sortField
      : this.sortableFields[0];
    const safeSortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${safeSortField} ${safeSortOrder}`;

    // 分頁
    sql += ` LIMIT ? OFFSET ?`;
    params.push(length, offset);

    const [rows]: any = await db.query(sql, params);
    return rows;
  }

  async countAll(options: { keyword: string; filters: { field: string; value: any }[] }) {
    const { keyword, filters } = options;
    const params: any[] = [];

    let sql = `SELECT COUNT(*) as total FROM \`${this.table}\` WHERE deleted_at IS NULL`;

    if (keyword && this.searchableFields.length) {
      const conditions = this.searchableFields.map(f => `${f} LIKE ?`).join(' OR ');
      sql += ` AND (${conditions})`;
      this.searchableFields.forEach(() => {
        params.push(`%${keyword}%`);
      });
    }

    for (const filter of filters) {
      sql += ` AND ${filter.field} = ?`;
      params.push(filter.value);
    }

    const [rows]: any = await db.query(sql, params);
    return rows[0].total;
  }

  async findById(id: string) {
    const selectClause = ['BIN_TO_UUID(id, 1) as id', ...this.selectableFields].join(', ');

    const [rows]: any = await db.query(
      `SELECT ${selectClause} FROM \`${this.table}\` WHERE id = UUID_TO_BIN(?, 1)`,
      [id],
    );

    return rows.length ? rows[0] : null;
  }

  async insert(data: Record<string, any>) {
    const keys = Object.keys(data);

    if (!keys.length) return;

    const columns = keys.join(', ');
    const placeholders = keys.map(key => (key === 'id' ? 'UUID_TO_BIN(?, 1)' : '?')).join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO \`${this.table}\` (${columns}, created_at, updated_at)
               VALUES (${placeholders}, NOW(), NOW())`;

    await db.query(sql, values);
  }

  async update(id: string, data: Record<string, any>) {
    const keys = Object.keys(data);

    if (keys.length === 0) return;

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = Object.values(data);

    const sql = `UPDATE \`${this.table}\` SET ${setClause}, updated_at = NOW() WHERE id = UUID_TO_BIN(?, 1)`;

    await db.query(sql, [...values, id]);
  }

  async softDelete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');

    const sql = `UPDATE \`${this.table}\` SET deleted_at = NOW() WHERE id IN (${placeholders})`;

    await db.query(sql, ids);
  }
}

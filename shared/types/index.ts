export interface Group {
  id: string;
  name: string;
  description: string;
  sort: number;
  updated_at: Date;
}

export interface Permission {
  id: number;
  subject: string;
  action: string;
}

export interface PaginationOptions {
  page?: number;
  length?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  keyword?: string;
  searchFields?: string[]; // 哪些欄位要 LIKE 搜尋
  filters?: { field: string; value: any }[];
}

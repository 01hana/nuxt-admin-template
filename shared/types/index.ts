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

export interface User {
  id: string;
  name: string;
  email: string;
  groups: Record<string, string>[];
  status: Boolean | number;
  updated_at: Date;
}

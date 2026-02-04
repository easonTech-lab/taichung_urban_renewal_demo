export interface Permission {
  category: string;
  functions: string[];
}

export interface HandlerAccount {
  name: string;
  email: string;
  department: string;
  group: string;
  permissions: Permission[];
  status: boolean;
}

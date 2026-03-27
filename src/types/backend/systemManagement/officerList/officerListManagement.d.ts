export interface OfficerData {
  id: string;
  index: number;
  name: string;
  gender: string;
  title: string;
  education: string[];
  email?: string;
  phone?: string;
  address?: string;
}

export interface OfficerItem {
  selectedOfficer: string;
}

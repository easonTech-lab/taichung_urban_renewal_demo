export interface ReviewUploadItem {
  label: string;
  status: "uploaded" | "pending";
}

export interface ReviewFileItem {
  id: number;
  name: string;
  uploadDeadline: string;
  staffVisible: boolean;
  applicantVisible: boolean;
  publishDate: string;
  receiveDate?: string;
  uploadItems: ReviewUploadItem[];
  isExpanded: boolean;
}

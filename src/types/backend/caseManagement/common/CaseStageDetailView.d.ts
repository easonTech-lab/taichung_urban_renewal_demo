export interface ReviewUploadItem {
  label: string;
  status: "uploaded" | "pending";
}

export interface ReviewFileItem {
  id: number;
  name: string;
  category: "報告書/審查簡報" | "修正意見/會議記錄";
  uploadDeadline: string;
  staffVisible: boolean;
  applicantVisible: boolean;
  publishDate: string;
  receiveDate?: string;
  receiveNumber?: string;
  uploadItems: ReviewUploadItem[];
  isExpanded: boolean;
}

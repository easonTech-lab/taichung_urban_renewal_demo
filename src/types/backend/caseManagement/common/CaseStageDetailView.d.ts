export interface ReviewUploadItem {
  label: string;
  status: "uploaded" | "pending";
}

export type ReviewFileCategory = "報告書/審查簡報" | "修正意見/會議記錄";

export interface ReviewFileItem {
  id: number;
  name: string;
  category: ReviewFileCategory;
  uploadDeadline: string;
  staffVisible: boolean;
  applicantVisible: boolean;
  publishDate: string;
  documentNo?: string;
  receiveDate?: string;
  receiveNumber?: string;
  uploadItems: ReviewUploadItem[];
  attachments?: Array<{
    name: string;
  }>;
  isExpanded: boolean;
}

export interface AddReviewItemForm {
  name: string;
  category: ReviewFileCategory;
  uploadSelections: string[];
  deadline: Date | null;
  staffVisible: boolean;
  applicantVisible: boolean;
  documentNo: string;
  publishDate: Date | null;
  receiveDate: Date | null;
  receiveNumber: string;
  attachments: File[];
}

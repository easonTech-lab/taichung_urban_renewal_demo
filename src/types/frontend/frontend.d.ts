export interface FAQQuestion {
  id: string;
  title: string;
  content: string;
}

export interface FAQCategory {
  title: string;
  questions: FAQQuestion[];
}

export interface DownloadItem {
  fileName: string;
  category: string;
  publishDate: string;
  fileUrl?: string;
}

export interface DownloadListItem extends DownloadItem {
  id: number;
}

export interface DownloadFileItem {
  name: string;
  type: "DOCX" | "PDF" | "ODT" | "XLS";
  size: string;
  fileUrl?: string;
}

export interface DownloadDetailItem extends DownloadListItem {
  title: string;
  updatedDate: string;
  department: string;
  views: number;
  description: string;
  files: DownloadFileItem[];
}

export interface MeetingItem {
  id: number;
  agenda: string;
  stage: string;
  date: string;
  fileUrl: string;
  category: "all" | "urban-renewal" | "dangerous";
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  publishDate: string;
}

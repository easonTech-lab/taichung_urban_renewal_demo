export interface DownloadItem {
  id: string;
  fileName: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
  text?: string;
}

export interface DownloadFormData {
  title: string;
  category: string;
  text: string;
  files: File[];
}

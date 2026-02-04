export interface DownloadItem {
  fileName: string;
  category: string;
  publishDate: string;
  status: boolean;
  tabStatus: "all" | "published" | "draft" | "unpublished";
}

export interface DownloadFormData {
  title: string;
  category: string;
  text: string;
  files: File[];
}

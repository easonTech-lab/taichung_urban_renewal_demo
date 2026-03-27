import type { DownloadItem } from "@/types/backend/homepageMaintenance/downloadsManagement.d";

export const downloadsMockData: DownloadItem[] = [
  { id: "download-1", fileName: "都市更新申請書範本（含事業計畫書、概要書）", category: "都市更新類", publishDate: "114/11/09", status: true, tabStatus: "published", text: "" },
  { id: "download-2", fileName: "結構安全性初評申請表", category: "危老類", publishDate: "114/10/30", status: false, tabStatus: "unpublished", text: "" },
  { id: "download-3", fileName: "老街區認定與補助條件說明文件", category: "老舊街區", publishDate: "114/10/30", status: false, tabStatus: "unpublished", text: "" },
  { id: "download-4", fileName: "整建維護補助申請表", category: "整建維護", publishDate: "114/10/12", status: false, tabStatus: "unpublished", text: "" },
  { id: "download-5", fileName: "同意書格式範例（住戶簽署用）", category: "都市更新類", publishDate: "114/10/12", status: false, tabStatus: "unpublished", text: "" },
  { id: "download-6", fileName: "全體同意書格式（危老專用）", category: "危老類", publishDate: "114/10/12", status: false, tabStatus: "unpublished", text: "" },
];

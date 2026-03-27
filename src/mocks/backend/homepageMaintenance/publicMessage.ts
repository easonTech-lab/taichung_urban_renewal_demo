import type { PublicMessageItem } from "@/types/backend/homepageMaintenance/publicMessageManagement.d";

export const publicMessageMockData: PublicMessageItem[] = [
  { id: "public-message-1", title: "臺中市都市更新相關推動成果公告", category: "", publishDate: "", status: false, tabStatus: "draft", isExpanded: true, content: "" },
  { id: "public-message-2", title: "本處辦理「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選，入選結果公告。", category: "最新消息", publishDate: "114/11/09", status: true, tabStatus: "published", content: "" },
  { id: "public-message-3", title: "本處辦理「114年度老屋新用計畫2.0」南區老屋第2次進駐者徵選，入選結果公告。", category: "最新消息", publishDate: "114/10/30", status: false, tabStatus: "unpublished", content: "" },
  { id: "public-message-4", title: "西屯區都更幹事會第二次召開", category: "最新消息", publishDate: "114/10/30", status: false, tabStatus: "unpublished", content: "" },
  { id: "public-message-5", title: "協合里都更審查會議時間公告", category: "會議公告", publishDate: "114/10/12", status: false, tabStatus: "unpublished", content: "" },
  { id: "public-message-6", title: "大雅區都更幹事會第一次召開", category: "會議公告", publishDate: "114/10/12", status: false, tabStatus: "unpublished", content: "" },
  { id: "public-message-7", title: "民眾表達推動任務研議", category: "新聞快訊", publishDate: "114/10/12", status: false, tabStatus: "unpublished", content: "" },
];

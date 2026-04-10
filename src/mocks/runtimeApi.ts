import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { caseStatisticsMockData } from "@/mocks/backend/homepageMaintenance/caseStatistics";
import { downloadsMockData } from "@/mocks/backend/homepageMaintenance/downloads";
import { faqMockData } from "@/mocks/backend/homepageMaintenance/faq";
import { publicMessageMockData } from "@/mocks/backend/homepageMaintenance/publicMessage";
import { officerMockData } from "@/mocks/backend/systemManagement/officerList";

const growthStatusColorMap: Record<string, string> = {
  成長: "#52c41a",
  持平: "#1890ff",
  降低: "#f5222d",
};

const newsCategoryKeyMap: Record<string, string> = {
  最新消息: "LATEST_NEWS",
  會議公告: "MEETING_NOTICE",
  新聞快訊: "ACTIVITY",
};

const downloadCategoryKeyMap: Record<string, string> = {
  都市更新類: "URBAN_RENEWAL",
  危老類: "UNSAFE_OLD_BUILDING",
  老舊街區: "OLD_STREET",
  整建維護: "MAINTENANCE",
};

const faqCategoryKeyMap: Record<string, string> = {
  "我適合哪種重建方式？": "RECONSTRUCTION_METHOD",
  "要怎麼申請？需要準備什麼？": "APPLICATION_PROCESS",
  "有什麼補助或政府協助？": "SUBSIDY_ASSISTANCE",
};

const systemUsers = [
  {
    id: 101,
    username: "chang_sen",
    role: "ADMIN",
    realName: "張森",
    email: "abc123@taichung.gov.tw",
    status: 1,
    isInitialPassword: 0,
    createTime: "2026-03-24 15:00:00",
  },
  {
    id: 102,
    username: "chen_jerry",
    role: "USER",
    realName: "陳傑瑞",
    email: "tt05@taichung.gov.tw",
    status: 1,
    isInitialPassword: 1,
    createTime: "2026-03-25 09:30:12",
  },
];

const urbanCases = [
  {
    id: "CASE2026001",
    caseName: "擬訂臺中市豐原區三村段三村小段21地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    stage: "案件申請",
    status: "進行中",
    updatedAt: "2026-03-24T10:00:00",
  },
  {
    id: "CASE2026002",
    caseName: "西屯區都市更新示範案",
    stage: "公辦公聽會",
    status: "進行中",
    updatedAt: "2026-03-20T10:00:00",
  },
];

const dangerousCases = [
  {
    id: "DANG2026001",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    stage: "專案小組",
    status: "進行中",
    updatedAt: "2026-03-18T10:00:00",
  },
  {
    id: "DANG2026002",
    caseName: "擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案",
    stage: "專案小組",
    status: "已中斷",
    updatedAt: "2026-03-16T10:00:00",
  },
];

const createResultWithMessage = <T>(message: string, data: T) => ({
  code: 200,
  message,
  data,
});

const createResultWithMsg = <T>(msg: string, data: T) => ({
  code: 200,
  msg,
  data,
});

const paginate = <T>(items: T[], page: number, size: number) => {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    size,
    number: page,
  };
};

const createDownloadItems = () =>
  downloadsMockData.map((item) => ({
    id: item.id,
    fileName: item.fileName,
    fileSize: "1.2 MB",
    filePath: `/files/${item.id}.pdf`,
    status: item.status ? "PUBLISHED" : "OFFLINE",
    statusDisplayName: item.status ? "已發佈" : "未發佈",
    createTime: item.publishDate,
    category: downloadCategoryKeyMap[item.category] ?? "URBAN_RENEWAL",
    categoryLabel: item.category,
  }));

const createStatisticsItems = () =>
  caseStatisticsMockData.map((item) => ({
    id: item.id,
    year: Number(item.year),
    type: item.caseCategory === "都更案件" ? "URBAN_RENEWAL" : "DANGEROUS_OLD",
    caseCount: item.annualCount,
    accumulatedCount: item.cumulativeCount,
    growthStatus: {
      description: item.growthRate,
      color: growthStatusColorMap[item.growthRate],
    },
  }));

const createFaqAdminItems = () =>
  faqMockData.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer ?? "",
    categoryName: item.category,
    category: faqCategoryKeyMap[item.category] ?? "RECONSTRUCTION_METHOD",
    status: item.tabStatus === "draft" ? "DRAFT" : item.status ? "PUBLISHED" : "OFFLINE",
    statusLabel: item.tabStatus === "draft" ? "暫存中" : item.status ? "已上架" : "已下架",
    isTop: item.index === 1 ? 1 : 0,
    sortOrder: item.index,
  }));

const createNewsAdminItems = () =>
  publicMessageMockData.map((item, index) => ({
    id: item.id,
    title: item.title,
    summary: item.content || item.title,
    content: item.content || `<p>${item.title}</p>`,
    newsCategory: newsCategoryKeyMap[item.category] ?? "LATEST_NEWS",
    categoryLabel: item.category,
    publishDate: item.publishDate,
    newsStatus: item.tabStatus === "draft" ? "DRAFT" : item.status ? "PUBLISHED" : "ARCHIVED",
    statusLabel: item.tabStatus === "draft" ? "暫存中" : item.status ? "已上架" : "已下架",
    isTop: index === 0 ? 1 : 0,
    internalRemark: "",
  }));

const buildUrl = (config: InternalAxiosRequestConfig) => {
  const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(config.url ?? "", base);
  const params = config.params as Record<string, string | number | boolean | undefined> | undefined;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url;
};

const buildResponse = <T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: status === 200 ? "OK" : String(status),
  headers: {},
  config,
});

export const mockAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const url = buildUrl(config);
  const { pathname, searchParams } = url;
  const method = (config.method ?? "get").toLowerCase();

  if (method === "get" && pathname === "/api/urban-cases") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    return buildResponse(config, paginate(urbanCases, page, size));
  }

  if (method === "get" && pathname === "/api/dangerous-cases") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    return buildResponse(config, paginate(dangerousCases, page, size));
  }

  if (method === "get" && pathname === "/api/statistics/admin/list") {
    return buildResponse(config, createResultWithMessage("操作成功", createStatisticsItems()));
  }

  if (method === "post" && pathname === "/api/statistics/admin/add") {
    return buildResponse(config, createResultWithMessage("新增成功", {}));
  }

  if (method === "put" && pathname === "/api/statistics/admin/update") {
    return buildResponse(config, createResultWithMessage("更新成功", {}));
  }

  if (method === "get" && pathname === "/api/download/list") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    return buildResponse(config, createResultWithMsg("操作成功", paginate(createDownloadItems(), page, size)));
  }

  if (method === "post" && pathname === "/api/admin/download/upload") {
    return buildResponse(config, createResultWithMessage("操作成功", config.data ?? {}));
  }

  if (method === "get" && pathname === "/api/faq/page") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    return buildResponse(config, createResultWithMessage("success", paginate(createFaqAdminItems(), page, size)));
  }

  if (method === "post" && pathname === "/api/faq/admin/create") {
    return buildResponse(config, createResultWithMessage("新增成功", config.data ?? {}));
  }

  if (method === "get" && pathname === "/api/news/list") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const items = createNewsAdminItems().map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      categoryLabel: item.categoryLabel,
      publishDate: item.publishDate,
      newsStatus: item.newsStatus,
      statusLabel: item.statusLabel,
    }));
    return buildResponse(config, createResultWithMsg("操作成功", paginate(items, page, size)));
  }

  if (method === "get" && pathname.startsWith("/api/news/")) {
    const id = pathname.replace("/api/news/", "");
    const item = createNewsAdminItems().find((entry) => String(entry.id) === id) ?? null;
    return buildResponse(config, createResultWithMsg("操作成功", item));
  }

  if (method === "post" && pathname === "/api/news/admin/create") {
    return buildResponse(config, createResultWithMsg("新聞建立成功", null));
  }

  if (method === "get" && pathname === "/api/system/user/list") {
    return buildResponse(config, createResultWithMsg("操作成功", systemUsers));
  }

  if (method === "get" && pathname === "/api/officers") {
    return buildResponse(config, createResultWithMessage("取得幹事名單成功", officerMockData));
  }

  if (method === "get" && pathname.startsWith("/api/officers/")) {
    const id = pathname.replace("/api/officers/", "");
    const item = officerMockData.find((entry) => String(entry.id) === id) ?? null;
    return buildResponse(config, createResultWithMessage("取得幹事資料成功", item));
  }

  if ((method === "post" || method === "put") && pathname.startsWith("/api/officers")) {
    return buildResponse(config, createResultWithMessage("幹事資料儲存成功", config.data ?? {}));
  }

  return buildResponse(
    config,
    {
      code: 404,
      message: `Mock API route not found: ${method.toUpperCase()} ${pathname}`,
      data: null,
    },
    404
  );
};

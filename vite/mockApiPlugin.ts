import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { caseStatisticsMockData } from "../src/mocks/backend/homepageMaintenance/caseStatistics";
import { downloadsMockData } from "../src/mocks/backend/homepageMaintenance/downloads";
import { faqMockData } from "../src/mocks/backend/homepageMaintenance/faq";
import { publicMessageMockData } from "../src/mocks/backend/homepageMaintenance/publicMessage";
import { officerMockData } from "../src/mocks/backend/systemManagement/officerList";

type JsonHeaders = Record<string, string>;

type MockJsonResponse = {
  statusCode: number;
  body: unknown;
  headers?: JsonHeaders;
};

const API_PREFIX = "/api";
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
const FILE_HEADERS = {
  "Content-Type": "application/octet-stream",
  "Content-Disposition": 'attachment; filename="mock-download.txt"',
};

const faqCategoryKeyMap: Record<string, string> = {
  "我適合哪種重建方式？": "RECONSTRUCTION_METHOD",
  "要怎麼申請？需要準備什麼？": "APPLICATION_PROCESS",
  "有什麼補助或政府協助？": "SUBSIDY_ASSISTANCE",
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

const growthStatusColorMap: Record<string, string> = {
  成長: "#52c41a",
  持平: "#1890ff",
  降低: "#f5222d",
};

const systemUsers = [
  {
    id: 101,
    username: "chang_sen",
    password: "Password123",
    role: "ADMIN",
    realName: "張森",
    email: "abc123@taichung.gov.tw",
    phone: "0912345678",
    status: 1,
    isInitialPassword: 0,
    createTime: "2026-03-24 15:00:00",
  },
  {
    id: 102,
    username: "chen_jerry",
    password: "Password123",
    role: "USER",
    realName: "陳傑瑞",
    email: "tt05@taichung.gov.tw",
    phone: "0922333444",
    status: 1,
    isInitialPassword: 1,
    createTime: "2026-03-25 09:30:12",
  },
  {
    id: 103,
    username: "lin_meihua",
    password: "Password123",
    role: "USER",
    realName: "林美華",
    email: "123@taichung.gov.tw",
    phone: "0933000111",
    status: 1,
    isInitialPassword: 1,
    createTime: "2026-03-25 09:30:12",
  },
];

const currentUserProfile = {
  id: 101,
  username: "chang_sen",
  realName: "張森",
  email: "abc123@taichung.gov.tw",
  phone: "0912345678",
  status: 1,
  isInitialPassword: 0,
  createTime: "2026-03-24 15:00:00",
};

const urbanCases = [
  {
    id: 1,
    caseNumber: "B202308220001",
    caseName: "擬訂臺中市豐原區三村段三村小段21地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    applicant: "陳傑瑞",
    stage: "都更大會",
    status: "IN_PROGRESS",
    statusLabel: "進行中",
    applyDate: "2026-03-24",
  },
  {
    id: 2,
    caseNumber: "111-1-1",
    caseName: "西屯區危老重建示範案",
    applicant: "張森",
    stage: "公開展覽",
    status: "PENDING",
    statusLabel: "待審核",
    applyDate: "2026-03-20",
  },
];

const reviewerAssignments: Record<string, Array<{ reviewerId: number; reviewerName: string; department: string }>> = {
  "1": [
    { reviewerId: 1, reviewerName: "張源明", department: "內政部地政司" },
    { reviewerId: 2, reviewerName: "林珮君", department: "專家委員" },
  ],
  "2": [{ reviewerId: 3, reviewerName: "郭依佳", department: "專家委員" }],
};

const reviewHistoryByFileId: Record<string, unknown[]> = {
  "1": [
    {
      id: 1,
      reviewerName: "張源明",
      reviewResult: "PASS",
      reviewComment: "資料完整，建議通過。",
      reviewTime: "2026-03-24 14:20:00",
    },
  ],
};

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

const sendJson = (res: ServerResponse, statusCode: number, body: unknown, headers: JsonHeaders = JSON_HEADERS) => {
  res.statusCode = statusCode;
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(body));
};

const sendRaw = (res: ServerResponse, statusCode: number, body: string, headers: JsonHeaders) => {
  res.statusCode = statusCode;
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.end(body);
};

const cloneData = <T>(data: T): T => JSON.parse(JSON.stringify(data)) as T;

const getRequestBody = async (req: IncomingMessage) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return null;
  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : null;
};

const matchIdPath = (pathname: string, prefix: string) => {
  if (!pathname.startsWith(prefix)) return null;
  const id = pathname.slice(prefix.length);
  return id ? decodeURIComponent(id) : null;
};

const paginate = <T>(items: T[], page: number, size: number) => {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    totalElements: items.length,
    last: start + size >= items.length,
    size,
    number: page,
  };
};

const createFaqAdminItems = () =>
  faqMockData.map((item) => ({
    id: item.id,
    index: item.index,
    question: item.question,
    answer: item.answer ?? "",
    category: item.category,
    categoryName: item.category,
    categoryKey: faqCategoryKeyMap[item.category] ?? "RECONSTRUCTION_METHOD",
    publishDate: item.publishDate,
    status: item.tabStatus === "draft" ? "DRAFT" : item.status ? "PUBLISHED" : "OFFLINE",
    statusLabel: item.tabStatus === "draft" ? "暫存中" : item.status ? "已上架" : "已下架",
    isTop: item.index === 1 ? 1 : 0,
    sortOrder: item.index,
    tabStatus: item.tabStatus,
  }));

const createFaqFrontendGroups = () =>
  Object.values(
    createFaqAdminItems()
      .filter((item) => item.status === "PUBLISHED")
      .reduce<Record<string, { category: string; questions: unknown[] }>>((groups, item) => {
        const category = item.categoryName;
        if (!groups[category]) {
          groups[category] = { category, questions: [] };
        }
        groups[category].questions.push({
          id: item.id,
          question: item.question,
          answer: item.answer,
          isTop: item.isTop,
          categoryName: item.categoryName,
          statusLabel: item.statusLabel,
        });
        return groups;
      }, {})
  );

const createNewsAdminItems = () =>
  publicMessageMockData.map((item, index) => ({
    id: item.id,
    title: item.title,
    summary: item.content || item.title,
    content: item.content || `<p>${item.title}</p>`,
    category: item.category,
    categoryLabel: item.category,
    newsCategory: newsCategoryKeyMap[item.category] ?? "LATEST_NEWS",
    publishDate: item.publishDate,
    newsStatus: item.tabStatus === "draft" ? "DRAFT" : item.status ? "PUBLISHED" : "ARCHIVED",
    statusLabel: item.tabStatus === "draft" ? "暫存中" : item.status ? "已上架" : "已下架",
    isTop: index === 0 ? 1 : 0,
    internalRemark: "",
    tabStatus: item.tabStatus,
    status: item.status,
  }));

const createDownloadItems = () =>
  downloadsMockData.map((item) => ({
    id: item.id,
    fileName: item.fileName,
    title: item.fileName,
    category: downloadCategoryKeyMap[item.category] ?? "URBAN_RENEWAL",
    categoryLabel: item.category,
    fileSize: "1.2 MB",
    filePath: `/files/${item.id}.pdf`,
    status: item.status ? "PUBLISHED" : "OFFLINE",
    statusDisplayName: item.status ? "已發佈" : "未發佈",
    publishDate: item.publishDate,
    createTime: item.publishDate,
    tabStatus: item.tabStatus,
    text: item.text ?? "",
  }));

const createStatisticsItems = () =>
  caseStatisticsMockData.map((item) => ({
    id: item.id,
    index: item.index,
    year: Number(item.year),
    type: item.caseCategory === "都更案件" ? "URBAN_RENEWAL" : "DANGEROUS_OLD",
    typeLabel: item.caseCategory,
    caseCategory: item.caseCategory,
    caseCount: item.annualCount,
    annualCount: item.annualCount,
    accumulatedCount: item.cumulativeCount,
    cumulativeCount: item.cumulativeCount,
    growthStatus: {
      description: item.growthRate,
      color: growthStatusColorMap[item.growthRate],
    },
    growthRate: item.growthRate,
  }));

const createSystemUserItems = () =>
  systemUsers.map((item) => ({
    id: item.id,
    username: item.username,
    role: item.role,
    realName: item.realName,
    email: item.email,
    phone: item.phone,
    status: item.status,
    isInitialPassword: item.isInitialPassword,
    createTime: item.createTime,
  }));

const handleAuthRoutes = async (req: IncomingMessage, pathname: string): Promise<MockJsonResponse | null> => {
  if (req.method === "POST" && pathname === "/api/auth/login") {
    const payload = await getRequestBody(req);
    const user = systemUsers.find((item) => item.username === payload?.username) ?? systemUsers[0];
    return {
      statusCode: 200,
      body: {
        code: 200,
        token: "mock-access-token",
        role: user.role,
        userInfo: {
          id: user.id,
          username: user.username,
          realName: user.realName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          isInitialPassword: user.isInitialPassword,
          createTime: user.createTime,
        },
      },
    };
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    return { statusCode: 200, body: createResultWithMessage("操作成功", "登出成功") };
  }

  if (req.method === "GET" && pathname === "/api/auth/roles") {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", {
        ADMIN: "系統管理員",
        USER: "一般用戶",
      }),
    };
  }

  if (req.method === "POST" && pathname === "/api/auth/forgot-password/request") {
    return { statusCode: 200, body: createResultWithMessage("操作成功", "驗證碼已寄出，請至信箱確認") };
  }

  if (req.method === "POST" && pathname === "/api/auth/forgot-password/reset") {
    return {
      statusCode: 200,
      body: {
        code: 200,
        message: "重設成功",
        data: "密碼已更新",
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (req.method === "GET" && pathname === "/api/auth/captcha") {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", {
        uuid: "mock-captcha-uuid",
        img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9sWRP0QAAAAASUVORK5CYII=",
      }),
    };
  }

  return null;
};

const handleFaqRoutes = async (req: IncomingMessage, pathname: string, searchParams: URLSearchParams): Promise<MockJsonResponse | null> => {
  const faqAdminItems = createFaqAdminItems();

  if (req.method === "GET" && pathname === "/api/faq/list") {
    return { statusCode: 200, body: createResultWithMessage("success", cloneData(createFaqFrontendGroups())) };
  }

  if (req.method === "GET" && pathname === "/api/faq/page") {
    const keyword = searchParams.get("keyword")?.trim() ?? "";
    const status = searchParams.get("status")?.trim();
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const filteredItems = faqAdminItems.filter((item) => {
      const matchesKeyword = !keyword || item.question.includes(keyword) || item.categoryName.includes(keyword);
      const matchesStatus = !status || item.status === status;
      return matchesKeyword && matchesStatus;
    });
    return {
      statusCode: 200,
      body: createResultWithMessage("success", cloneData(paginate(filteredItems, page, size))),
    };
  }

  if (req.method === "POST" && pathname === "/api/faq/admin/create") {
    const payload = await getRequestBody(req);
    return {
      statusCode: 200,
      body: createResultWithMessage("新增成功", {
        id: payload?.id ?? "faq-created",
        ...payload,
      }),
    };
  }

  const faqId = matchIdPath(pathname, "/api/faq/admin/");
  if (req.method === "DELETE" && faqId) {
    return { statusCode: 200, body: createResultWithMessage("success", "FAQ 已刪除") };
  }

  return null;
};

const handleNewsRoutes = async (req: IncomingMessage, pathname: string, searchParams: URLSearchParams): Promise<MockJsonResponse | null> => {
  const newsItems = createNewsAdminItems();

  if (req.method === "GET" && pathname === "/api/news/latest") {
    return {
      statusCode: 200,
      body: createResultWithMsg("操作成功", cloneData(newsItems.filter((item) => item.newsStatus === "PUBLISHED").slice(0, 2))),
    };
  }

  if (req.method === "GET" && pathname === "/api/news/list") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const status = searchParams.get("status")?.trim();
    const category = searchParams.get("category")?.trim();
    const filteredItems = newsItems.filter((item) => {
      const matchesStatus = !status || item.newsStatus === status;
      const matchesCategory = !category || item.newsCategory === category;
      return matchesStatus && matchesCategory;
    });
    return {
      statusCode: 200,
      body: createResultWithMsg("操作成功", cloneData(paginate(filteredItems, page, size))),
    };
  }

  const newsId = matchIdPath(pathname, "/api/news/");
  if (req.method === "GET" && newsId && !pathname.includes("/admin/")) {
    return {
      statusCode: 200,
      body: createResultWithMsg("操作成功", cloneData(newsItems.find((item) => String(item.id) === newsId) ?? null)),
    };
  }

  if (req.method === "POST" && pathname === "/api/news/admin/create") {
    return { statusCode: 200, body: createResultWithMsg("新聞建立成功", null) };
  }

  const statusMatch = pathname.match(/^\/api\/news\/admin\/([^/]+)\/status$/);
  if (req.method === "PATCH" && statusMatch) {
    return { statusCode: 200, body: createResultWithMsg("新聞已成功上架", null) };
  }

  return null;
};

const handleDownloadRoutes = async (req: IncomingMessage, pathname: string, searchParams: URLSearchParams): Promise<MockJsonResponse | null> => {
  const downloadItems = createDownloadItems();

  if (req.method === "GET" && pathname === "/api/download/list") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const keyword = searchParams.get("keyword")?.trim() ?? "";
    const category = searchParams.get("category")?.trim();
    const filteredItems = downloadItems.filter((item) => {
      const matchesKeyword = !keyword || item.fileName.includes(keyword) || item.title.includes(keyword);
      const matchesCategory = !category || item.category === category || item.categoryLabel === category;
      return matchesKeyword && matchesCategory;
    });
    return {
      statusCode: 200,
      body: createResultWithMsg("操作成功", cloneData(paginate(filteredItems, page, size))),
    };
  }

  const downloadId = matchIdPath(pathname, "/api/download/");
  if (req.method === "GET" && downloadId) {
    return {
      statusCode: 200,
      headers: FILE_HEADERS,
      body: `Mock download content for ${downloadId}`,
    };
  }

  if (req.method === "GET" && pathname === "/api/admin/download/categories") {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", {
        URBAN_RENEWAL: "都市更新類",
        UNSAFE_OLD_BUILDING: "危老類",
        OLD_STREET: "老舊街區",
        MAINTENANCE: "整建維護",
      }),
    };
  }

  if (req.method === "POST" && pathname === "/api/admin/download/upload") {
    const payload = await getRequestBody(req);
    return { statusCode: 200, body: createResultWithMessage("操作成功", cloneData(payload)) };
  }

  const adminDownloadId = matchIdPath(pathname, "/api/admin/download/");
  if (req.method === "DELETE" && adminDownloadId) {
    return { statusCode: 200, body: createResultWithMessage("操作成功", null) };
  }

  const toggleDownloadId = matchIdPath(pathname, "/api/admin/download/toggle/");
  if (req.method === "PUT" && toggleDownloadId) {
    return { statusCode: 200, body: createResultWithMessage("操作成功", null) };
  }

  return null;
};

const handleStatisticsRoutes = async (req: IncomingMessage, pathname: string): Promise<MockJsonResponse | null> => {
  const statisticsItems = createStatisticsItems();

  if (req.method === "GET" && pathname === "/api/statistics/home") {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", {
        totalCases: statisticsItems.reduce((sum, item) => sum + item.caseCount, 0),
        yearlyTrends: statisticsItems.slice(0, 5).map((item) => ({
          year: item.year,
          caseCount: item.caseCount,
          growthStatus: item.growthStatus,
        })),
        categoryDistribution: [
          {
            type: "URBAN_RENEWAL",
            typeLabel: "都更案件",
            count: statisticsItems.filter((item) => item.type === "URBAN_RENEWAL").reduce((sum, item) => sum + item.caseCount, 0),
          },
          {
            type: "DANGEROUS_OLD",
            typeLabel: "危老案件",
            count: statisticsItems.filter((item) => item.type === "DANGEROUS_OLD").reduce((sum, item) => sum + item.caseCount, 0),
          },
        ],
      }),
    };
  }

  if (req.method === "GET" && pathname === "/api/statistics/admin/list") {
    return { statusCode: 200, body: createResultWithMessage("操作成功", cloneData(statisticsItems)) };
  }

  if (req.method === "POST" && pathname === "/api/statistics/admin/add") {
    return { statusCode: 200, body: createResultWithMessage("新增成功", {}) };
  }

  if (req.method === "PUT" && pathname === "/api/statistics/admin/update") {
    return { statusCode: 200, body: createResultWithMessage("更新成功", {}) };
  }

  const statisticsId = matchIdPath(pathname, "/api/statistics/admin/delete/");
  if (req.method === "DELETE" && statisticsId) {
    return { statusCode: 200, body: createResultWithMessage("年度統計數據已成功移除", null) };
  }

  return null;
};

const handleSystemUserRoutes = async (req: IncomingMessage, pathname: string): Promise<MockJsonResponse | null> => {
  if (req.method === "GET" && pathname === "/api/system/user/list") {
    return { statusCode: 200, body: createResultWithMsg("操作成功", cloneData(createSystemUserItems())) };
  }

  if (req.method === "POST" && pathname === "/api/system/user/add") {
    return { statusCode: 200, body: createResultWithMsg("新增成功", null) };
  }

  const systemUserEditId = matchIdPath(pathname, "/api/system/user/edit/");
  if (req.method === "PUT" && systemUserEditId) {
    return {
      statusCode: 403,
      body: {
        code: 403,
        msg: "安全性政策：禁止透過管理接口修改用戶資料",
        data: null,
      },
    };
  }

  const systemUserId = matchIdPath(pathname, "/api/system/user/");
  if (req.method === "DELETE" && systemUserId) {
    return { statusCode: 200, body: createResultWithMsg("帳號已成功停用", null) };
  }

  return null;
};

const handleUserRoutes = async (req: IncomingMessage, pathname: string): Promise<MockJsonResponse | null> => {
  if (req.method === "GET" && pathname === "/api/user/profile") {
    return { statusCode: 200, body: createResultWithMessage("操作成功", cloneData(currentUserProfile)) };
  }

  if (req.method === "PATCH" && pathname === "/api/user/update-profile") {
    return { statusCode: 200, body: createResultWithMessage("更新成功", null) };
  }

  if (req.method === "PUT" && pathname === "/api/user/change-password") {
    return { statusCode: 200, body: createResultWithMessage("密碼更新成功", null) };
  }

  return null;
};

const handleCaseRoutes = async (req: IncomingMessage, pathname: string, searchParams: URLSearchParams): Promise<MockJsonResponse | null> => {
  if (req.method === "POST" && pathname === "/api/cases") {
    const payload = await getRequestBody(req);
    return {
      statusCode: 200,
      body: createResultWithMessage("案件建立成功", {
        id: 999,
        ...payload,
      }),
    };
  }

  const caseStatusMatch = pathname.match(/^\/api\/cases\/([^/]+)\/status$/);
  if (req.method === "PATCH" && caseStatusMatch) {
    return { statusCode: 200, body: createResultWithMessage("案件狀態更新成功", null) };
  }

  const caseId = matchIdPath(pathname, "/api/cases/");
  if (req.method === "DELETE" && caseId) {
    return { statusCode: 200, body: createResultWithMessage("案件刪除成功", null) };
  }

  if (req.method === "GET" && pathname === "/api/urban-cases") {
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    return { statusCode: 200, body: createResultWithMessage("操作成功", cloneData(paginate(urbanCases, page, size))) };
  }

  const urbanCaseId = matchIdPath(pathname, "/api/urban-cases/");
  if (req.method === "GET" && urbanCaseId && !pathname.endsWith("/import-reviewers")) {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", cloneData(urbanCases.find((item) => String(item.id) === urbanCaseId) ?? null)),
    };
  }

  if (req.method === "DELETE" && urbanCaseId) {
    return { statusCode: 200, body: createResultWithMessage("操作成功", null) };
  }

  const importReviewersMatch = pathname.match(/^\/api\/urban-cases\/([^/]+)\/import-reviewers$/);
  if (req.method === "POST" && importReviewersMatch) {
    return { statusCode: 200, body: createResultWithMessage("導入成功", reviewerAssignments[importReviewersMatch[1]] ?? []) };
  }

  const assignReviewerMatch = pathname.match(/^\/api\/admin\/reviewers\/assign\/([^/]+)$/);
  if (req.method === "PUT" && assignReviewerMatch) {
    return { statusCode: 200, body: createResultWithMessage("儲存成功", null) };
  }

  const removeReviewerMatch = pathname.match(/^\/api\/admin\/reviewers\/case\/([^/]+)\/member\/([^/]+)$/);
  if (req.method === "DELETE" && removeReviewerMatch) {
    return { statusCode: 200, body: createResultWithMessage("移除成功", null) };
  }

  const getReviewerCaseMatch = pathname.match(/^\/api\/admin\/reviewers\/case\/([^/]+)$/);
  if (req.method === "GET" && getReviewerCaseMatch) {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", cloneData(reviewerAssignments[getReviewerCaseMatch[1]] ?? [])),
    };
  }

  const fileReviewMatch = pathname.match(/^\/api\/admin\/reviews\/file\/([^/]+)$/);
  if (req.method === "POST" && fileReviewMatch) {
    return { statusCode: 200, body: createResultWithMessage("審查結果已送出", null) };
  }

  if (req.method === "POST" && pathname === "/api/admin/reviews/batch") {
    return { statusCode: 200, body: createResultWithMessage("批次審查結果已送出", null) };
  }

  const reviewHistoryMatch = pathname.match(/^\/api\/admin\/reviews\/history\/([^/]+)$/);
  if (req.method === "GET" && reviewHistoryMatch) {
    return {
      statusCode: 200,
      body: createResultWithMessage("操作成功", cloneData(reviewHistoryByFileId[reviewHistoryMatch[1]] ?? [])),
    };
  }

  const stageFinalizeMatch = pathname.match(/^\/api\/admin\/reviews\/case\/([^/]+)\/stage-finalize$/);
  if (req.method === "PUT" && stageFinalizeMatch) {
    return { statusCode: 200, body: createResultWithMessage("案件階段結案完成", null) };
  }

  return null;
};

const handleLegacyOfficerRoutes = async (req: IncomingMessage, pathname: string): Promise<MockJsonResponse | null> => {
  if (req.method === "GET" && pathname === "/api/officers") {
    return { statusCode: 200, body: createResultWithMessage("取得幹事名單成功", cloneData(officerMockData)) };
  }

  const officerId = matchIdPath(pathname, "/api/officers/");
  if (req.method === "GET" && officerId) {
    return {
      statusCode: 200,
      body: createResultWithMessage("取得幹事資料成功", cloneData(officerMockData.find((item) => item.id === officerId) ?? null)),
    };
  }

  if ((req.method === "POST" || req.method === "PUT") && pathname.startsWith("/api/officers")) {
    const payload = await getRequestBody(req);
    return { statusCode: 200, body: createResultWithMessage("幹事資料儲存成功", cloneData(payload)) };
  }

  if (req.method === "DELETE" && officerId) {
    return { statusCode: 200, body: createResultWithMessage("幹事資料刪除成功", null) };
  }

  return null;
};

export const mockApiPlugin = (): Plugin => ({
  name: "mock-api-plugin",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url) {
        next();
        return;
      }

      const url = new URL(req.url, "http://localhost");
      const { pathname, searchParams } = url;

      if (!pathname.startsWith(API_PREFIX)) {
        next();
        return;
      }

      const routeHandlers = [
        handleAuthRoutes,
        handleFaqRoutes,
        handleNewsRoutes,
        handleDownloadRoutes,
        handleStatisticsRoutes,
        handleSystemUserRoutes,
        handleUserRoutes,
        handleCaseRoutes,
        handleLegacyOfficerRoutes,
      ];

      for (const routeHandler of routeHandlers) {
        const response = await routeHandler(req, pathname, searchParams);
        if (!response) continue;

        if (response.headers?.["Content-Type"] === FILE_HEADERS["Content-Type"] && typeof response.body === "string") {
          sendRaw(res, response.statusCode, response.body, response.headers);
          return;
        }

        sendJson(res, response.statusCode, response.body, response.headers);
        return;
      }

      sendJson(res, 404, {
        code: 404,
        message: "Mock API route not found",
        data: null,
      });
    });
  },
});

/**
 * Breadcrumb 維護原則：
 * - 靜態、單一路徑的 breadcrumb 留在 router meta。
 * - 有共用規則或條件判斷的 breadcrumb builder 放在這裡。
 * - 需要動態 breadcrumb 的頁面，從這裡匯入 helper，
 *   並將結果傳給 <Breadcrumb :items="..." />。
 */
const isAdminUser = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      return user.role === "admin";
    } catch {
      return false;
    }
  }
  return false;
};

const getFromRoute = (route: any) => route.query?.from as string | undefined;

const isAdminRouteContext = (route: any) => {
  const fromRoute = getFromRoute(route);
  return fromRoute?.includes("-admin") || route.query?.admin === "true" || isAdminUser();
};

const isDangerousRouteContext = (route: any) => {
  const fromRoute = getFromRoute(route);
  return fromRoute?.includes("dangerous") || route.query?.caseType === "dangerous";
};

const getCaseSectionLabel = (isAdmin: boolean) => (isAdmin ? "案件管理" : "我的案件");

const getCaseListMeta = (isDangerous: boolean, isAdmin: boolean) => {
  if (isDangerous) {
    return {
      label: isAdmin ? "危老重建案件管理" : "危老重建案件",
      path: isAdmin ? "/case-management-dangerous-admin" : "/case-management-dangerous",
    };
  }

  return {
    label: isAdmin ? "都市更新案件管理" : "都市更新案件",
    path: isAdmin ? "/case-management-admin" : "/case-management",
  };
};

export const getAccountBreadcrumbItems = () => {
  if (isAdminUser()) {
    return [{ label: "首頁", to: "/" }, { label: "我的帳號" }, { label: "人員帳號管理" }];
  }
  return [{ label: "首頁", to: "/" }, { label: "我的帳號" }, { label: "編輯個人資料" }];
};

export const getCaseDetailBreadcrumbItems = (route: any) => {
  const fromRoute = getFromRoute(route);
  const isFromAdmin = isAdminRouteContext(route);
  const isDangerous = isDangerousRouteContext(route);
  const caseListMeta = getCaseListMeta(isDangerous, isFromAdmin);
  const tabLabelMap: Record<string, string> = {
    info: "案件資訊",
    complaints: "人民陳情",
    progress: "案件進度",
    files: "專案檔案",
  };
  const tabLabel = tabLabelMap[(route.query?.tab as string) || ""] || "案件詳情";

  if (isFromAdmin) {
    return [
      { label: "首頁", to: "/" },
      { label: getCaseSectionLabel(true) },
      { label: caseListMeta.label, to: caseListMeta.path },
      { label: tabLabel },
    ];
  }

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(false) },
    { label: caseListMeta.label, to: caseListMeta.path },
    { label: tabLabel },
  ];
};

export const getCaseStageDetailBreadcrumbItems = (route: any) => {
  const fromRoute = getFromRoute(route);
  const isFromAdmin = isAdminRouteContext(route);
  const isDangerous = isDangerousRouteContext(route);
  const caseListMeta = getCaseListMeta(isDangerous, isFromAdmin);
  const stageName = (route.query?.stage as string | undefined) || "階段詳細資料";
  const progressLink = {
    label: "案件進度",
    to: {
      path: "/case-detail",
      query: {
        from: fromRoute,
        admin: route.query?.admin,
        caseType: route.query?.caseType,
        tab: "progress",
      },
    },
  };

  if (isFromAdmin) {
    return [
      { label: "首頁", to: "/" },
      { label: getCaseSectionLabel(true) },
      { label: caseListMeta.label, to: caseListMeta.path },
      progressLink,
      { label: stageName },
    ];
  }

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(false) },
    { label: caseListMeta.label, to: caseListMeta.path },
    progressLink,
    { label: stageName },
  ];
};

export const getAddCaseStageBreadcrumbItems = (route: any) => {
  const fromRoute = getFromRoute(route);
  const isFromAdmin = isAdminRouteContext(route);
  const isDangerous = isDangerousRouteContext(route);
  const caseListMeta = getCaseListMeta(isDangerous, isFromAdmin);
  const progressLink = {
    label: "案件進度",
    to: {
      path: "/case-detail",
      query: {
        from: fromRoute,
        admin: route.query?.admin,
        caseType: route.query?.caseType,
        tab: "progress",
      },
    },
  };

  if (isFromAdmin) {
    return [
      { label: "首頁", to: "/" },
      { label: getCaseSectionLabel(true) },
      { label: caseListMeta.label, to: caseListMeta.path },
      progressLink,
      { label: "新增案件階段" },
    ];
  }

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(false) },
    { label: caseListMeta.label, to: caseListMeta.path },
    progressLink,
    { label: "新增案件階段" },
  ];
};

export const getDangerousCaseAddBreadcrumbItems = (route: any) => {
  const isFromAdmin = isAdminRouteContext(route);
  const caseListMeta = getCaseListMeta(true, isFromAdmin);

  if (isFromAdmin) {
    return [
      { label: "首頁", to: "/" },
      { label: getCaseSectionLabel(true) },
      { label: caseListMeta.label, to: caseListMeta.path },
      { label: "新增危老重建案件" },
    ];
  }

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(false) },
    { label: caseListMeta.label, to: caseListMeta.path },
    { label: "新增危老重建案件" },
  ];
};

export const getDangerousCaseApplicationBreadcrumbItems = (route: any) => {
  const isFromAdmin = isAdminRouteContext(route);
  const isEditMode = route.query?.from === "/case-detail";
  const parentPath = "/case-management-dangerous/add";
  const caseListMeta = getCaseListMeta(true, isFromAdmin);

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(isFromAdmin) },
    { label: caseListMeta.label, to: caseListMeta.path },
    { label: isEditMode ? "編輯危老重建案件" : "新增危老重建案件", to: parentPath },
    { label: "危老申請書" },
  ];
};

export const getUrbanCaseAddBreadcrumbItems = (route: any) => {
  const isFromAdmin = isAdminRouteContext(route);
  const caseListMeta = getCaseListMeta(false, isFromAdmin);

  if (isFromAdmin) {
    return [
      { label: "首頁", to: "/" },
      { label: getCaseSectionLabel(true) },
      { label: caseListMeta.label, to: caseListMeta.path },
      { label: "新增都更案件" },
    ];
  }

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(false) },
    { label: caseListMeta.label, to: caseListMeta.path },
    { label: "新增都更案件" },
  ];
};

export const getUrbanCaseReviewBreadcrumbItems = (route: any) => {
  const isFromAdmin = isAdminRouteContext(route);
  const isEditMode = route.query?.from === "/case-detail";
  const caseListMeta = getCaseListMeta(false, isFromAdmin);

  if (isEditMode) {
    return [
      { label: "首頁", to: "/" },
      { label: getCaseSectionLabel(isFromAdmin) },
      { label: caseListMeta.label, to: caseListMeta.path },
      { label: "編輯都更案件" },
    ];
  }

  return [
    { label: "首頁", to: "/" },
    { label: getCaseSectionLabel(isFromAdmin) },
    { label: caseListMeta.label, to: caseListMeta.path },
    { label: "新增都更案件", to: "/case-management/add/business-plan" },
    { label: "都市更新審議資料表" },
  ];
};

export const getCaseStatisticsEditBreadcrumbItems = () => {
  return [{ label: "首頁", to: "/" }, { label: "首頁維護" }, { label: "案件統計維護" }];
};

export const getOfficerEditBreadcrumbItems = (pageTitle: string) => {
  return [
    { label: "首頁", to: "/" },
    { label: "系統管理" },
    { label: "幹事名單管理", to: "/officer-list-management" },
    { label: pageTitle },
  ];
};

export const getDownloadsDetailBreadcrumbItems = (title: string) => {
  return [
    { label: "首頁", to: "/" },
    { label: "下載專區", to: "/downloads" },
    { label: title },
  ];
};

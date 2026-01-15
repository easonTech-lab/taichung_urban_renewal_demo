// 統一的路由配置，從 router/index.ts 中讀取路由信息

// 直接導入 routes（使用延遲訪問模式避免初始化順序問題）
// 注意：router/index.ts 不會導入此文件，所以不會有循環依賴
// 但為了避免初始化順序問題，我們使用函數延遲訪問（在需要時才調用）
import * as routerModule from "@/router/index";

// 延遲訪問 routes 的函數（避免在模組初始化時立即訪問）
const getRoutes = (): typeof routerModule.routes => {
  return routerModule.routes;
};

export interface RouteConfig {
  path: string;
  name: string;
  label: string; // 用於導航連結和麵包屑顯示
  breadcrumbLabel?: string; // 麵包屑顯示的文字（如果不同於 label）
  showInNav?: boolean; // 是否在導航欄顯示
  parentRoute?: string; // 父路由（用於構建麵包屑層級）
  category?: "frontend" | "backend"; // 前台或後台
}

// 後台子選單項配置
export interface BackendSubMenuItem {
  label: string;
  value: string;
  route: string;
  breadcrumbLabel: string;
}

// 後台主選單項配置
export interface BackendMenuItem {
  title: string;
  icon: string;
  iconClass: string;
  subItems: BackendSubMenuItem[];
  defaultExpanded?: boolean;
  breadcrumbLabel?: string;
}

// 路由名稱到標籤的映射（從 router/index.ts 的路由中提取）
const routeLabelMap: Record<string, { label: string; breadcrumbLabel?: string; showInNav?: boolean; category?: "frontend" | "backend" }> = {
  home: { label: "首頁", breadcrumbLabel: "首頁", showInNav: false, category: "frontend" },
  login: { label: "登入", breadcrumbLabel: "登入", showInNav: false, category: "frontend" },
  register: { label: "註冊", breadcrumbLabel: "註冊", showInNav: false, category: "frontend" },
  news: { label: "公開消息", breadcrumbLabel: "公開消息", showInNav: true, category: "frontend" },
  downloads: { label: "下載專區", breadcrumbLabel: "下載專區", showInNav: true, category: "frontend" },
  "e-services": { label: "電子服務", breadcrumbLabel: "電子服務", showInNav: false, category: "frontend" },
  faq: { label: "常見問題", breadcrumbLabel: "常見問題", showInNav: true, category: "frontend" },
  meetings: { label: "審查會議", breadcrumbLabel: "審查會議", showInNav: false, category: "frontend" },
  "forgot-password": { label: "忘記密碼", breadcrumbLabel: "忘記密碼", showInNav: false, category: "frontend" },
  "case-management": { label: "都市更新案件", breadcrumbLabel: "都市更新案件", showInNav: false, category: "backend" },
};

// 從 router/index.ts 的路由配置生成 RouteConfig（使用延遲初始化函數）
let frontendRoutesCache: RouteConfig[] | null = null;
export const getFrontendRoutes = (): RouteConfig[] => {
  if (!frontendRoutesCache) {
    const routes = getRoutes();
    frontendRoutesCache = routes
      .filter((route: any) => {
        const routeInfo = routeLabelMap[route.name as string];
        return routeInfo?.category === "frontend";
      })
      .map((route: any) => {
        const routeInfo = routeLabelMap[route.name as string];
        return {
          path: route.path,
          name: route.name as string,
          label: routeInfo?.label || (route.name as string),
          breadcrumbLabel: routeInfo?.breadcrumbLabel || routeInfo?.label || (route.name as string),
          showInNav: routeInfo?.showInNav || false,
          category: "frontend" as const,
        };
      });
  }
  return frontendRoutesCache;
};

// 為了向後兼容，使用 Proxy 讓 frontendRoutes 可以像數組一樣使用（延遲訪問）
export const frontendRoutes = new Proxy([] as RouteConfig[], {
  get(target, prop) {
    const routes = getFrontendRoutes();
    if (typeof prop === "string" && !isNaN(Number(prop))) {
      return routes[Number(prop)];
    }
    return (routes as any)[prop];
  },
  ownKeys() {
    return Object.keys(getFrontendRoutes());
  },
  getOwnPropertyDescriptor(target, prop) {
    const routes = getFrontendRoutes();
    if (prop in routes) {
      return Object.getOwnPropertyDescriptor(routes, prop);
    }
    return undefined;
  },
});

// 後台選單配置
export const backendMenuConfig: BackendMenuItem[] = [
  {
    title: "我的案件",
    icon: "chartPie",
    iconClass: "shrink-0 text-gray-800",
    breadcrumbLabel: "案件管理",
    subItems: [
      {
        label: "都市更新案件",
        value: "都市更新案件",
        route: "/case-management",
        breadcrumbLabel: "都市更新案件",
      },
      {
        label: "危老重建案件",
        value: "危老重建案件",
        route: "/case-management-dangerous",
        breadcrumbLabel: "危老重建案件",
      },
    ],
    defaultExpanded: true,
  },
  {
    title: "我的帳號",
    icon: "userSettings",
    iconClass: "shrink-0 text-gray-500",
    subItems: [
      {
        label: "編輯個人資料",
        value: "編輯個人資料",
        route: "/profile",
        breadcrumbLabel: "編輯個人資料",
      },
    ],
  },
];

// 後台路由配置（從 backendMenuConfig 生成，但只包含在 router/index.ts 中定義的路由）（使用延遲初始化函數）
let backendRoutesCache: RouteConfig[] | null = null;
export const getBackendRoutes = (): RouteConfig[] => {
  if (!backendRoutesCache) {
    const routes = getRoutes();
    backendRoutesCache = backendMenuConfig
      .flatMap((menuItem) => menuItem.subItems)
      .filter((subItem) => {
        // 只包含在 router/index.ts 中定義的路由
        return routes.some((route: any) => route.path === subItem.route);
      })
      .map((subItem) => {
        // 從路由路徑生成路由名稱（例如：/case-management -> case-management）
        const routeName = subItem.route.replace(/^\//, "").replace(/\//g, "-");
        const routeInfo = routeLabelMap[routeName];
        return {
          path: subItem.route,
          name: routeName,
          label: subItem.breadcrumbLabel,
          breadcrumbLabel: subItem.breadcrumbLabel,
          parentRoute: undefined as string | undefined,
          category: "backend" as const,
        };
      });
  }
  return backendRoutesCache;
};

// 為了向後兼容，使用 Proxy 讓 backendRoutes 可以像數組一樣使用（延遲訪問）
export const backendRoutes = new Proxy([] as RouteConfig[], {
  get(target, prop) {
    const routes = getBackendRoutes();
    if (typeof prop === "string" && !isNaN(Number(prop))) {
      return routes[Number(prop)];
    }
    return (routes as any)[prop];
  },
  ownKeys() {
    return Object.keys(getBackendRoutes());
  },
  getOwnPropertyDescriptor(target, prop) {
    const routes = getBackendRoutes();
    if (prop in routes) {
      return Object.getOwnPropertyDescriptor(routes, prop);
    }
    return undefined;
  },
});

// 合併所有路由（使用延遲初始化函數）
export const getAllRoutes = (): RouteConfig[] => {
  return [...getFrontendRoutes(), ...getBackendRoutes()];
};

// 為了向後兼容，使用 Proxy 讓 allRoutes 可以像數組一樣使用（延遲訪問）
export const allRoutes = new Proxy([] as RouteConfig[], {
  get(target, prop) {
    const routes = getAllRoutes();
    if (typeof prop === "string" && !isNaN(Number(prop))) {
      return routes[Number(prop)];
    }
    return (routes as any)[prop];
  },
  ownKeys() {
    return Object.keys(getAllRoutes());
  },
  getOwnPropertyDescriptor(target, prop) {
    const routes = getAllRoutes();
    if (prop in routes) {
      return Object.getOwnPropertyDescriptor(routes, prop);
    }
    return undefined;
  },
});

// 根據路由路徑獲取麵包屑項目
export const getBreadcrumbItems = (routePath: string): Array<{ label: string; to?: string; href?: string }> => {
  const items: Array<{ label: string; to?: string }> = [];

  // 如果是首頁
  if (routePath === "/") {
    return [{ label: "首頁" }];
  }

  // 統一從 allRoutes 中查找路由
  const currentRoute = getAllRoutes().find((route) => route.path === routePath);

  if (!currentRoute) {
    // 如果找不到，返回首頁
    return [{ label: "首頁", to: "/" }];
  }

  // 添加首頁
  items.push({ label: "首頁", to: "/" });

  // 檢查是否是後台路由，如果是則添加父級選單項
  for (const menuItem of backendMenuConfig) {
    const subItem = menuItem.subItems.find((item) => item.route === routePath);
    if (subItem && menuItem.breadcrumbLabel) {
      // 添加父級選單項（不帶連結，因為它只是分類）
      items.push({ label: menuItem.breadcrumbLabel });
      break;
    }
  }

  // 添加當前路由（最後一個不帶連結）
  items.push({ label: currentRoute.breadcrumbLabel || currentRoute.label });

  return items;
};

// 獲取導航欄顯示的路由（僅前台）
export const getNavRoutes = (): RouteConfig[] => {
  return getFrontendRoutes().filter((route) => route.showInNav === true);
};

// 根據 value 獲取路由路徑（後台用）
export const getRouteByValue = (value: string): string | null => {
  for (const menuItem of backendMenuConfig) {
    const subItem = menuItem.subItems.find((item) => item.value === value);
    if (subItem) {
      return subItem.route;
    }
  }
  return null;
};

// 根據路由路徑獲取選單項 value（後台用）
export const getValueByRoute = (routePath: string): string | null => {
  for (const menuItem of backendMenuConfig) {
    const subItem = menuItem.subItems.find((item) => item.route === routePath);
    if (subItem) {
      return subItem.value;
    }
  }
  return null;
};

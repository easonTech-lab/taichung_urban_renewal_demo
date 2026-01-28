import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

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

const getAccountBreadcrumbItems = () => {
  if (isAdminUser()) {
    return [{ label: "首頁", to: "/" }, { label: "我的帳號" }, { label: "人員帳號管理" }];
  }
  return [{ label: "首頁", to: "/" }, { label: "我的帳號" }, { label: "編輯個人資料" }];
};

const getCaseDetailBreadcrumbItems = (route: any) => {
  const fromRoute = route.query?.from as string | undefined;
  const isFromAdmin = fromRoute?.includes("-admin") || route.query?.admin === "true" || isAdminUser();
  if (isFromAdmin) {
    return [
      { label: "首頁", to: "/" },
      { label: "案件管理" },
      { label: "都市更新案件管理", to: "/case-management-admin" },
      { label: "案件詳情" },
    ];
  }
  return [
    { label: "首頁", to: "/" },
    { label: "我的案件" },
    { label: "都市更新案件", to: "/case-management" },
    { label: "案件詳情" },
  ];
};

// 導出路由配置，供組件使用
export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/frontend/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/frontend/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/frontend/RegisterView.vue"),
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/frontend/NewsView.vue"),
    meta: {
      showInNav: true,
      navLabel: "公開消息",
    },
  },
  {
    path: "/downloads",
    name: "downloads",
    component: () => import("@/views/frontend/DownloadsView.vue"),
    meta: {
      showInNav: true,
      navLabel: "下載專區",
    },
  },
  {
    path: "/e-services",
    name: "e-services",
    component: () => import("@/views/frontend/EServicesView.vue"),
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("@/views/frontend/FAQView.vue"),
    meta: {
      showInNav: true,
      navLabel: "常見問題",
    },
  },
  {
    path: "/meetings",
    name: "meetings",
    component: () => import("@/views/frontend/MeetingView.vue"),
    meta: {
      showInNav: true,
      navLabel: "審查會議",
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/frontend/ForgotPasswordView.vue"),
  },
  {
    path: "/case-management",
    name: "case-management",
    component: () => import("@/views/backend/CaseManagementView.vue"),
    meta: {
      breadcrumb: {
        label: "都市更新案件",
        parent: {
          label: "我的案件",
        },
      },
    },
  },
  {
    path: "/case-management-admin",
    name: "case-management-admin",
    component: () => import("@/views/backend/CaseManagementView.vue"), // 使用同一個組件
    meta: {
      breadcrumb: {
        label: "都市更新案件管理",
        parent: {
          label: "案件管理",
        },
      },
    },
  },
  {
    path: "/case-management-dangerous",
    name: "case-management-dangerous",
    component: () => import("@/views/backend/CaseManagementDangerousView.vue"),
    meta: {
      breadcrumb: {
        label: "危老重建案件",
        parent: {
          label: "我的案件",
        },
      },
    },
  },
  {
    path: "/case-management-dangerous-admin",
    name: "case-management-dangerous-admin",
    component: () => import("@/views/backend/CaseManagementDangerousView.vue"), // 使用同一個組件
    meta: {
      breadcrumb: {
        label: "危老重建案件管理",
        parent: {
          label: "案件管理",
        },
      },
    },
  },
  {
    path: "/case-detail",
    name: "case-detail",
    component: () => import("@/views/backend/CaseDetailView.vue"),
    meta: {
      breadcrumb: getCaseDetailBreadcrumbItems,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/backend/ProfileView.vue"),
    meta: {
      breadcrumb: getAccountBreadcrumbItems,
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: () => import("@/views/backend/ChangePasswordView.vue"),
    meta: {
      breadcrumb: getAccountBreadcrumbItems,
    },
  },
  {
    path: "/case-statistics",
    name: "case-statistics",
    component: () => import("@/views/backend/CaseStatisticsView.vue"),
    meta: {
      breadcrumb: {
        label: "案件統計維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/case-statistics/add",
    name: "case-statistics-add",
    component: () => import("@/views/backend/CaseStatisticsAddView.vue"),
    meta: {
      breadcrumb: {
        label: "案件統計維護", // 顯示父路由的標籤，不顯示「新增年度」
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/case-statistics/edit",
    name: "case-statistics-edit",
    component: () => import("@/views/backend/CaseStatisticsEditView.vue"),
    meta: {
      breadcrumb: {
        label: "案件統計維護", // 顯示父路由的標籤，不顯示「編輯案件件數」
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/faq-management",
    name: "faq-management",
    component: () => import("@/views/backend/FAQManagementView.vue"),
    meta: {
      breadcrumb: {
        label: "常見問題維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/faq-management/add",
    name: "faq-management-add",
    component: () => import("@/views/backend/FAQAddView.vue"),
    meta: {
      breadcrumb: {
        label: "常見問題維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/downloads-management",
    name: "downloads-management",
    component: () => import("@/views/backend/DownloadsManagementView.vue"),
    meta: {
      breadcrumb: {
        label: "下載專區維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/downloads-management/add",
    name: "downloads-management-add",
    component: () => import("@/views/backend/DownloadsAddView.vue"),
    meta: {
      breadcrumb: {
        label: "下載專區維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/public-message-management",
    name: "public-message-management",
    component: () => import("@/views/backend/PublicMessageManagementView.vue"),
    meta: {
      breadcrumb: {
        label: "公開消息維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/public-message-management/add",
    name: "public-message-management-add",
    component: () => import("@/views/backend/PublicMessageAddView.vue"),
    meta: {
      breadcrumb: {
        label: "公開消息維護",
        parent: {
          label: "首頁維護",
        },
      },
    },
  },
  {
    path: "/internal-staff-account-management",
    name: "internal-staff-account-management",
    component: () => import("@/views/backend/InternalStaffAccountManagementView.vue"),
    meta: {
      breadcrumb: {
        label: "內部人員帳號管理",
        parent: {
          label: "系統管理",
        },
      },
    },
  },
  {
    path: "/internal-staff-account-management/add",
    name: "internal-staff-account-management-add",
    component: () => import("@/views/backend/InternalStaffAccountAddView.vue"),
    meta: {
      breadcrumb: {
        label: "新增承辦帳號",
        parent: {
          label: "內部人員帳號管理",
          path: "/internal-staff-account-management",
        },
      },
    },
  },
  {
    path: "/officer-list-management",
    name: "officer-list-management",
    component: () => import("@/views/backend/OfficerListManagementView.vue"),
    meta: {
      breadcrumb: {
        label: "幹事名單管理",
        parent: {
          label: "系統管理",
        },
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { ensureAdminSession } from "@/utils/mockAuth";

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
    path: "/news/:id",
    name: "news-detail",
    component: () => import("@/views/frontend/NewsDetailView.vue"),
    meta: {
      breadcrumb: {
        label: "公開消息",
      },
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
    path: "/downloads/:id",
    name: "downloads-detail",
    component: () => import("@/views/frontend/DownloadsDetailView.vue"),
    meta: {
      breadcrumb: {
        label: "下載專區",
      },
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
    component: () => import("@/views/backend/caseManagement/urbanRenewal/CaseManagementView.vue"),
    meta: {
      sidebar: {
        section: "我的案件",
        icon: "case",
        label: "都市更新案件",
        roles: ["user"],
        sectionOrder: 1,
        order: 1,
        defaultExpanded: true,
      },
      breadcrumb: {
        label: "都市更新案件",
        parent: {
          label: "我的案件",
        },
      },
    },
  },
  {
    path: "/case-management/add/business-plan",
    name: "case-management-add-business-plan",
    component: () => import("@/views/backend/caseManagement/urbanRenewal/CaseManagementAddBusinessPlanView.vue"),
  },
  {
    path: "/case-management/add/review-table",
    name: "case-management-add-review-table",
    component: () => import("@/views/backend/caseManagement/urbanRenewal/CaseManagementReviewTableView.vue"),
  },
  {
    path: "/case-management-admin",
    name: "case-management-admin",
    component: () => import("@/views/backend/caseManagement/urbanRenewal/CaseManagementView.vue"), // 使用同一個組件
    meta: {
      sidebar: {
        section: "案件管理",
        icon: "case",
        label: "都市更新案件管理",
        roles: ["admin"],
        sectionOrder: 1,
        order: 1,
        defaultExpanded: true,
      },
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
    component: () => import("@/views/backend/caseManagement/dangerous/CaseManagementDangerousView.vue"),
    meta: {
      sidebar: {
        section: "我的案件",
        icon: "case",
        label: "危老重建案件",
        roles: ["user"],
        sectionOrder: 1,
        order: 2,
      },
      breadcrumb: {
        label: "危老重建案件",
        parent: {
          label: "我的案件",
        },
      },
    },
  },
  {
    path: "/case-management-dangerous/add",
    name: "case-management-dangerous-add",
    component: () => import("@/views/backend/caseManagement/dangerous/CaseManagementDangerousAddView.vue"),
  },
  {
    path: "/case-management-dangerous/add/application",
    name: "case-management-dangerous-add-application",
    component: () => import("@/views/backend/caseManagement/dangerous/CaseManagementDangerousApplicationView.vue"),
  },
  {
    path: "/case-management-dangerous-admin",
    name: "case-management-dangerous-admin",
    component: () => import("@/views/backend/caseManagement/dangerous/CaseManagementDangerousView.vue"), // 使用同一個組件
    meta: {
      sidebar: {
        section: "案件管理",
        icon: "case",
        label: "危老重建案件管理",
        roles: ["admin"],
        sectionOrder: 1,
        order: 2,
      },
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
    component: () => import("@/views/backend/caseManagement/common/CaseDetailView.vue"),
  },
  {
    path: "/case-stage-detail",
    name: "case-stage-detail",
    component: () => import("@/views/backend/caseManagement/common/CaseStageDetailView.vue"),
  },
  {
    path: "/add-case-stage",
    name: "add-case-stage",
    component: () => import("@/views/backend/caseManagement/common/AddCaseStageView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/backend/myAccount/ProfileView.vue"),
    meta: {
      sidebar: [
        {
          section: "我的帳號",
          icon: "userSettings",
          label: "編輯個人資料",
          roles: ["user"],
          sectionOrder: 4,
          order: 1,
        },
        {
          section: "我的帳號",
          icon: "userSettings",
          label: "人員帳號管理",
          roles: ["admin"],
          sectionOrder: 4,
          order: 1,
        },
      ],
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: () => import("@/views/backend/myAccount/ChangePasswordView.vue"),
  },
  {
    path: "/data-analysis",
    name: "data-analysis",
    component: () => import("@/views/backend/systemManagement/dataAnalysis/DataAnalysisView.vue"),
    meta: {
      sidebar: {
        section: "系統管理",
        icon: "briefcase",
        label: "數據分析",
        roles: ["admin"],
        sectionOrder: 3,
        order: 3,
      },
      breadcrumb: {
        label: "數據分析",
        parent: {
          label: "系統管理",
        },
      },
    },
  },
  {
    path: "/case-statistics",
    name: "case-statistics",
    component: () => import("@/views/backend/homepageMaintenance/caseStatistics/CaseStatisticsView.vue"),
    meta: {
      sidebar: {
        section: "首頁維護",
        icon: "page",
        label: "案件統計維護",
        roles: ["admin"],
        sectionOrder: 2,
        order: 1,
        defaultExpanded: true,
      },
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
    component: () => import("@/views/backend/homepageMaintenance/caseStatistics/CaseStatisticsEditView.vue"),
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
    path: "/case-statistics/edit/:id",
    name: "case-statistics-edit",
    component: () => import("@/views/backend/homepageMaintenance/caseStatistics/CaseStatisticsEditView.vue"),
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
    component: () => import("@/views/backend/homepageMaintenance/faq/FAQManagementView.vue"),
    meta: {
      sidebar: {
        section: "首頁維護",
        icon: "page",
        label: "常見問題維護",
        roles: ["admin"],
        sectionOrder: 2,
        order: 2,
      },
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
    component: () => import("@/views/backend/homepageMaintenance/faq/FAQAddView.vue"),
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
    path: "/faq-management/edit/:id",
    name: "faq-management-edit",
    component: () => import("@/views/backend/homepageMaintenance/faq/FAQAddView.vue"),
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
    component: () => import("@/views/backend/homepageMaintenance/downloads/DownloadsManagementView.vue"),
    meta: {
      sidebar: {
        section: "首頁維護",
        icon: "page",
        label: "下載專區維護",
        roles: ["admin"],
        sectionOrder: 2,
        order: 3,
      },
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
    component: () => import("@/views/backend/homepageMaintenance/downloads/DownloadsAddView.vue"),
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
    path: "/downloads-management/edit/:id",
    name: "downloads-management-edit",
    component: () => import("@/views/backend/homepageMaintenance/downloads/DownloadsAddView.vue"),
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
    component: () => import("@/views/backend/homepageMaintenance/publicMessage/PublicMessageManagementView.vue"),
    meta: {
      sidebar: {
        section: "首頁維護",
        icon: "page",
        label: "公開消息維護",
        roles: ["admin"],
        sectionOrder: 2,
        order: 4,
      },
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
    component: () => import("@/views/backend/homepageMaintenance/publicMessage/PublicMessageAddView.vue"),
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
    path: "/public-message-management/edit/:id",
    name: "public-message-management-edit",
    component: () => import("@/views/backend/homepageMaintenance/publicMessage/PublicMessageAddView.vue"),
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
    component: () => import("@/views/backend/systemManagement/internalStaff/InternalStaffAccountManagementView.vue"),
    meta: {
      sidebar: {
        section: "系統管理",
        icon: "briefcase",
        label: "內部人員帳號管理",
        roles: ["admin"],
        sectionOrder: 3,
        order: 1,
      },
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
    component: () => import("@/views/backend/systemManagement/internalStaff/InternalStaffAccountAddView.vue"),
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
    path: "/officer-list-management/add",
    name: "officer-list-management-add",
    component: () => import("@/views/backend/systemManagement/officerList/OfficerEditView.vue"),
    meta: {
      breadcrumb: {
        label: "新增幹事",
        parent: {
          label: "幹事名單管理",
          path: "/officer-list-management",
        },
      },
    },
  },
  {
    path: "/officer-list-management/edit/:id",
    name: "officer-list-management-edit",
    component: () => import("@/views/backend/systemManagement/officerList/OfficerEditView.vue"),
    meta: {
      breadcrumb: {
        label: "編輯幹事",
        parent: {
          label: "幹事名單管理",
          path: "/officer-list-management",
        },
      },
    },
  },
  {
    path: "/officer-list-management",
    name: "officer-list-management",
    component: () => import("@/views/backend/systemManagement/officerList/OfficerListManagementView.vue"),
    meta: {
      sidebar: {
        section: "系統管理",
        icon: "briefcase",
        label: "幹事名單管理",
        roles: ["admin"],
        sectionOrder: 3,
        order: 2,
      },
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  ensureAdminSession();

  if (to.path === "/login") {
    return "/case-management-admin";
  }

  return true;
});

export default router;

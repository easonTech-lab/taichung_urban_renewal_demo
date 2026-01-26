import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "@/views/frontend/HomeView.vue";
import LoginView from "@/views/frontend/LoginView.vue";
import RegisterView from "@/views/frontend/RegisterView.vue";
import NewsView from "@/views/frontend/NewsView.vue";
import DownloadsView from "@/views/frontend/DownloadsView.vue";
import EServicesView from "@/views/frontend/EServicesView.vue";
import FAQView from "@/views/frontend/FAQView.vue";
import MeetingView from "@/views/frontend/MeetingView.vue";
import ForgotPasswordView from "@/views/frontend/ForgotPasswordView.vue";
import CaseManagementView from "@/views/backend/CaseManagementView.vue";
import CaseManagementDangerousView from "@/views/backend/CaseManagementDangerousView.vue";
import CaseDetailView from "@/views/backend/CaseDetailView.vue";
import CaseStatisticsView from "@/views/backend/CaseStatisticsView.vue";
import CaseStatisticsAddView from "@/views/backend/CaseStatisticsAddView.vue";
import CaseStatisticsEditView from "@/views/backend/CaseStatisticsEditView.vue";
import FAQManagementView from "@/views/backend/FAQManagementView.vue";
import FAQAddView from "@/views/backend/FAQAddView.vue";
import DownloadsManagementView from "@/views/backend/DownloadsManagementView.vue";
import DownloadsAddView from "@/views/backend/DownloadsAddView.vue";
import PublicMessageManagementView from "@/views/backend/PublicMessageManagementView.vue";
import PublicMessageAddView from "@/views/backend/PublicMessageAddView.vue";
import InternalStaffAccountManagementView from "@/views/backend/InternalStaffAccountManagementView.vue";
import InternalStaffAccountAddView from "@/views/backend/InternalStaffAccountAddView.vue";
import ProfileView from "@/views/backend/ProfileView.vue";
import ChangePasswordView from "@/views/backend/ChangePasswordView.vue";
import OfficerListManagementView from "@/views/backend/OfficerListManagementView.vue";

// 導出路由配置，供組件使用
export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/news",
    name: "news",
    component: NewsView,
    meta: {
      showInNav: true,
      navLabel: "公開消息",
    },
  },
  {
    path: "/downloads",
    name: "downloads",
    component: DownloadsView,
    meta: {
      showInNav: true,
      navLabel: "下載專區",
    },
  },
  {
    path: "/e-services",
    name: "e-services",
    component: EServicesView,
  },
  {
    path: "/faq",
    name: "faq",
    component: FAQView,
    meta: {
      showInNav: true,
      navLabel: "常見問題",
    },
  },
  {
    path: "/meetings",
    name: "meetings",
    component: MeetingView,
    meta: {
      showInNav: true,
      navLabel: "審查會議",
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPasswordView,
  },
  {
    path: "/case-management",
    name: "case-management",
    component: CaseManagementView,
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
    component: CaseManagementView, // 使用同一個組件
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
    component: CaseManagementDangerousView,
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
    component: CaseManagementDangerousView, // 使用同一個組件
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
    component: CaseDetailView,
    meta: {
      breadcrumb: {
        label: "案件詳情",
        parent: {
          label: "都市更新案件",
          to: "/case-management",
          parent: {
            label: "案件管理",
          },
        },
      },
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: {
      breadcrumb: {
        label: "編輯個人資料",
        parent: {
          label: "我的帳號",
        },
      },
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePasswordView,
    meta: {
      breadcrumb: {
        label: "編輯個人資料",
        parent: {
          label: "我的帳號",
        },
      },
    },
  },
  {
    path: "/case-statistics",
    name: "case-statistics",
    component: CaseStatisticsView,
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
    component: CaseStatisticsAddView,
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
    component: CaseStatisticsEditView,
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
    component: FAQManagementView,
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
    component: FAQAddView,
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
    component: DownloadsManagementView,
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
    component: DownloadsAddView,
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
    component: PublicMessageManagementView,
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
    component: PublicMessageAddView,
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
    component: InternalStaffAccountManagementView,
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
    component: InternalStaffAccountAddView,
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
    component: OfficerListManagementView,
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

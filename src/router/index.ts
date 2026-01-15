import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/frontend/HomeView.vue";
import LoginView from "../views/frontend/LoginView.vue";
import RegisterView from "../views/frontend/RegisterView.vue";
import NewsView from "../views/frontend/NewsView.vue";
import DownloadsView from "../views/frontend/DownloadsView.vue";
import EServicesView from "../views/frontend/EServicesView.vue";
import FAQView from "../views/frontend/FAQView.vue";
import MeetingView from "../views/frontend/MeetingView.vue";
import ForgotPasswordView from "../views/frontend/ForgotPasswordView.vue";
import CaseManagementView from "../views/backend/CaseManagementView.vue";

// 導出路由配置，供 config/routes.ts 使用
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
  },
  {
    path: "/downloads",
    name: "downloads",
    component: DownloadsView,
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
  },
  {
    path: "/meetings",
    name: "meetings",
    component: MeetingView,
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

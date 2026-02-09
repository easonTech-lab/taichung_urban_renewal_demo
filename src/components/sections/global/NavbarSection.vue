<template>
  <nav class="sticky top-0 z-50 border-b border-gray-300 bg-white">
    <div class="flex w-full items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex w-full items-center gap-8">
        <router-link to="/" aria-label="回首頁 - 臺中市都市更新" class="flex items-center">
          <img src="/logo.png" alt="臺中市都市更新" class="h-auto w-auto" aria-hidden="true" />
          <span class="sr-only">回首頁</span>
        </router-link>
        <div v-if="!isAuthPage" class="hidden items-center gap-8 md:flex">
          <router-link v-for="navRoute in navRoutes" :key="navRoute.path" :to="navRoute.path" :class="navLinkClass">
            {{ navRoute.label }}
          </router-link>
        </div>
      </div>
      <div v-if="!isAuthPage && isLoggedIn" class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <AvatarDropdown
            :avatar-text="userSurname"
            :name="userName"
            :email="userEmail"
            :items="avatarItems"
            align="left"
            @item-click="handleAvatarItemClick"
          />
          <span class="text-nowrap text-base font-normal leading-normal text-gray-900">{{ userName }}</span>
        </div>
        <div class="h-8 w-px bg-gray-200"></div>
        <button type="button" class="text-nowrap text-base font-normal leading-normal text-primary-600 hover:text-primary-700" @click="handleLogout">登出</button>
      </div>
      <div v-else-if="!isAuthPage" class="flex items-center gap-3 text-nowrap">
        <ButtonCTA :to="{ path: '/login' }" variant="none" aria-label="登入系統">登入</ButtonCTA>
        <ButtonCTA :to="{ path: '/register' }" variant="primary" aria-label="申請案件">案件申請</ButtonCTA>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import AvatarDropdown, { type AvatarDropdownItem } from "@/components/atoms/AvatarDropdown.vue";
import { useSidebarMenuConfig } from "@/composables/useSidebarMenuConfig";
import * as routerModule from "@/router/index";

const router = useRouter();
const route = useRoute();

// 獲取導航欄顯示的路由
const getNavRoutes = (): Array<{ path: string; label: string }> => {
  const routes = routerModule.routes;
  return routes
    .filter((route: any) => {
      // 只包含 meta.showInNav 為 true 的路由
      return route.meta?.showInNav === true;
    })
    .map((route: any) => ({
      path: route.path,
      label: route.meta?.navLabel || route.name,
    }));
};

const navRoutes = computed(() => getNavRoutes());

// 使用 ref 來追蹤登入狀態，確保響應式更新
const userInfo = ref<string | null>(localStorage.getItem("userInfo"));

// 檢查登入狀態
const checkLoginStatus = () => {
  userInfo.value = localStorage.getItem("userInfo");
};

// 監聽路由變化，當路由改變時重新檢查登入狀態
watch(
  () => route.path,
  () => {
    checkLoginStatus();
  }
);

// 監聽 storage 事件（當其他標籤頁或窗口改變 localStorage 時）
onMounted(() => {
  checkLoginStatus();
  window.addEventListener("storage", checkLoginStatus);
  // 監聽自定義事件（當同一個標籤頁內登入/登出時）
  window.addEventListener("login-status-changed", checkLoginStatus);
});

// 清理事件監聽器
onUnmounted(() => {
  window.removeEventListener("storage", checkLoginStatus);
  window.removeEventListener("login-status-changed", checkLoginStatus);
});

const isLoggedIn = computed(() => !!userInfo.value);
const isAuthPage = computed(() => {
  return route.path === "/login" || route.path === "/forgot-password";
});

const userName = computed(() => {
  if (!userInfo.value) return "訪客";
  const user = JSON.parse(userInfo.value);
  return user.username === "adm" ? "陳傑瑞" : user.username;
});

const userEmail = computed(() => {
  if (!userInfo.value) return "name@flowbite.com";
  const user = JSON.parse(userInfo.value);
  return user.email || "name@flowbite.com";
});

const userSurname = computed(() => userName.value.charAt(0));

const isAdmin = computed(() => {
  try {
    if (!userInfo.value) return false;
    const user = JSON.parse(userInfo.value);
    return user.role === "admin";
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    return false;
  }
});

const avatarItems = computed<AvatarDropdownItem[]>(() => {
  return useSidebarMenuConfig(isAdmin.value).map((item) => ({
    label: item.title,
    icon: item.icon,
  }));
});

const navLinkClass = computed(() => {
  return isLoggedIn.value
    ? "text-base font-medium leading-normal text-gray-900 hover:text-primary-700"
    : "text-sm font-medium text-gray-900 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";
});

const handleLogout = () => {
  localStorage.removeItem("userInfo");
  userInfo.value = null;
  // 觸發自定義事件，通知其他組件
  window.dispatchEvent(new Event("login-status-changed"));
  router.push("/login");
};

const handleAvatarItemClick = (item: AvatarDropdownItem) => {
  const config = useSidebarMenuConfig(isAdmin.value);
  const match = config.find((menu) => menu.title === item.label);
  const routeTarget = match?.subItems[0]?.route;
  if (routeTarget && routeTarget !== "#") {
    router.push(routeTarget);
  }
};
</script>

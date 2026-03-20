<template>
  <!-- Mobile Toggle Button -->
  <button
    type="button"
    class="fixed left-3 top-[73px] z-[70] inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:hidden"
    @click="toggleSidebar"
    aria-label="開啟側邊欄"
  >
    <Icon name="menu" :size="24" />
  </button>

  <!-- Backdrop (Mobile Only) -->
  <div v-if="isSidebarOpen" class="fixed inset-0 z-[60] bg-gray-600/80 sm:hidden" @click="closeSidebar"></div>

  <!-- Sidebar -->
  <aside
    :id="sidebarId"
    :class="[
      'fixed left-0 z-[60] w-[328px] bg-white opacity-80 transition-transform duration-300 ease-in-out',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'sm:translate-x-0',
      'top-0 h-screen sm:top-[73px] sm:h-[calc(100vh-73px)]',
    ]"
    aria-label="側邊欄"
  >
    <div class="flex h-full w-full flex-col gap-4 overflow-y-auto px-3 py-4">
      <!-- Close Button (Mobile Only) -->
      <button type="button" class="self-end rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 sm:hidden" @click="closeSidebar" aria-label="關閉側邊欄">
        <Icon name="close" :size="20" />
      </button>

      <!-- Menu Items -->
      <div class="flex flex-1 flex-col gap-4">
        <SidebarAccordion
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :title="menuItem.title"
          :icon="menuItem.icon"
          :sub-items="menuItem.subItems"
          :expanded="expandedIndex === index"
          :selected-item="selectedItem"
          @toggle="handleAccordionToggle(index, $event)"
          @sub-item-click="handleSubItemClick"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebarMenuConfig } from "@/composables/useSidebarMenuConfig";
import Icon from "@/components/atoms/Icon.vue";
import SidebarAccordion, { type SidebarSubItem } from "@/components/atoms/SidebarAccordion.vue";

const props = withDefaults(
  defineProps<{
    backdropClosable?: boolean;
  }>(),
  {
    backdropClosable: false,
  }
);

const router = useRouter();
const route = useRoute();
const emit = defineEmits<{
  "item-select": [itemName: string];
}>();

const isAdmin = computed(() => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.role === "admin";
    }
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
  }
  return false;
});

const selectedItem = ref<string>("");
const expandedIndex = ref<number | null>(null);
const isSidebarOpen = ref(false);
const sidebarId = computed(() => `sidebar-${Math.random().toString(36).substring(2, 11)}`);
const sidebarMenuConfig = computed(() => useSidebarMenuConfig(isAdmin.value));
const menuItems = computed(() => {
  return sidebarMenuConfig.value.map((item) => ({
    title: item.title,
    icon: item.icon,
    defaultExpanded: item.defaultExpanded,
    subItems: item.subItems.map((subItem) => ({
      label: subItem.label,
      value: subItem.value,
    })) as SidebarSubItem[],
  }));
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const closeSidebar = () => {
  if (!props.backdropClosable) return;
  isSidebarOpen.value = false;
}

const handleAccordionToggle = (index: number, isExpanded: boolean) => {
  if (isExpanded) {
    expandedIndex.value = index;
  } else {
    if (expandedIndex.value === index) {
      expandedIndex.value = null;
    }
  }
}

const updateSelectedItem = () => {
  const config = sidebarMenuConfig.value;
  const isCaseDetailRoute = ["/case-detail", "/case-stage-detail"].includes(route.path);
  if (isCaseDetailRoute) {
    const fromRoute = (route.query?.from as string | undefined) || "";
    const caseType = (route.query?.caseType as string | undefined) || "";
    const fallbackRoute = caseType === "dangerous" ? (isAdmin.value ? "/case-management-dangerous-admin" : "/case-management-dangerous") : isAdmin.value ? "/case-management-admin" : "/case-management";
    const targetRoute = fromRoute || fallbackRoute;
    for (let i = 0; i < config.length; i++) {
      const menuItem = config[i];
      const subItem = menuItem.subItems.find((item) => item.route === targetRoute);
      if (subItem) {
        selectedItem.value = subItem.value;
        expandedIndex.value = i;
        return;
      }
    }
  }
  const isDangerousSubRoute =
    route.path === "/case-management-dangerous" || route.path.startsWith("/case-management-dangerous/");
  if (isDangerousSubRoute) {
    const dangerousRoute = isAdmin.value ? "/case-management-dangerous-admin" : "/case-management-dangerous";
    const dangerousLabel = isAdmin.value ? "危老重建案件管理" : "危老重建案件";
    for (let i = 0; i < config.length; i++) {
      const subItem = config[i].subItems.find((item) => item.route === dangerousRoute || item.value === dangerousLabel);
      if (subItem) {
        selectedItem.value = subItem.value;
        expandedIndex.value = i;
        return;
      }
    }
  }

  for (let i = 0; i < config.length; i++) {
    const menuItem = config[i];
    let subItem = menuItem.subItems.find((item) => item.route === route.path);
    if (!subItem) {
      subItem = menuItem.subItems.find((item) => {
        if (!item.route || item.route === "#") return false;
        const prefix = item.route;
        if (!route.path.startsWith(prefix)) return false;
        return route.path === prefix || route.path[prefix.length] === "/";
      });
    }
    if (subItem) {
      selectedItem.value = subItem.value;
      expandedIndex.value = i;
      return;
    }
  }
  selectedItem.value = config[0]?.subItems[0]?.value || "";
  const defaultExpandedIndex = config.findIndex((item) => item.defaultExpanded);
  if (defaultExpandedIndex !== -1) {
    expandedIndex.value = defaultExpandedIndex;
  }
}

const checkUserRole = () => {
  updateSelectedItem();
}

onMounted(() => {
  updateSelectedItem();
  window.addEventListener("storage", checkUserRole);
  window.addEventListener("login-status-changed", checkUserRole);
});

onUnmounted(() => {
  window.removeEventListener("storage", checkUserRole);
  window.removeEventListener("login-status-changed", checkUserRole);
});

// 監聽路由變化和身份變化
watch(
  [() => route.path, isAdmin],
  () => {
    updateSelectedItem();
  },
  { immediate: true }
);

const selectItem = (itemName: string) => {
  selectedItem.value = itemName;
  const config = sidebarMenuConfig.value;
  for (const menuItem of config) {
    const subItem = menuItem.subItems.find((item) => item.value === itemName);
    if (subItem) {
      router.push(subItem.route);
      emit("item-select", itemName);
      closeSidebar();
      return;
    }
  }
}

const handleSubItemClick = (itemName: string) => {
  selectItem(itemName);
}
</script>

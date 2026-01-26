<template>
  <!-- Mobile Toggle Button -->
  <button type="button"
    class="fixed top-[73px] left-3 z-[70] inline-flex items-center justify-center rounded-lg p-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:hidden"
    @click="toggleSidebar" aria-label="開啟側邊欄">
    <Icon name="menu" :size="24" />
  </button>

  <!-- Backdrop (Mobile Only) -->
  <div v-if="isSidebarOpen" class="fixed inset-0 z-[60] bg-gray-600/80 sm:hidden" @click="closeSidebar"></div>

  <!-- Sidebar -->
  <aside :id="sidebarId" :class="[
    'fixed left-0 z-[60] w-[328px] bg-white opacity-80 transition-transform duration-300 ease-in-out',
    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
    'sm:translate-x-0',
    'top-0 h-screen sm:top-[73px] sm:h-[calc(100vh-73px)]'
  ]" aria-label="側邊欄">
    <div class="flex h-full w-full flex-col gap-4 overflow-y-auto px-3 py-4">
      <!-- Close Button (Mobile Only) -->
      <button type="button"
        class="self-end rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 sm:hidden"
        @click="closeSidebar" aria-label="關閉側邊欄">
        <Icon name="close" :size="20" />
      </button>

      <!-- Menu Items -->
      <div class="flex flex-1 flex-col gap-4">
        <SidebarAccordion v-for="(menuItem, index) in menuItems" :key="index" :title="menuItem.title"
          :icon="menuItem.icon" :sub-items="menuItem.subItems" :expanded="expandedIndex === index"
          :selected-item="selectedItem" @toggle="handleAccordionToggle(index, $event)"
          @sub-item-click="handleSubItemClick" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SidebarAccordion, { type SidebarSubItem } from "@/components/atoms/SidebarAccordion.vue";
import Icon from "@/components/atoms/Icon.vue";

// 用戶側邊欄選單配置
const userSidebarMenuConfig = [
  {
    title: "我的案件",
    icon: "case",
    subItems: [
      {
        label: "都市更新案件",
        value: "都市更新案件",
        route: "/case-management",
      },
      {
        label: "危老重建案件",
        value: "危老重建案件",
        route: "/case-management-dangerous",
      },
    ],
    defaultExpanded: true,
  },
  {
    title: "我的帳號",
    icon: "userSettings",
    subItems: [
      {
        label: "編輯個人資料",
        value: "編輯個人資料",
        route: "/profile",
      },
    ],
  },
];

// 管理員側邊欄選單配置
const adminSidebarMenuConfig = [
  {
    title: "案件管理",
    icon: "case",
    subItems: [
      {
        label: "都市更新案件管理",
        value: "都市更新案件管理",
        route: "/case-management-admin",
      },
      {
        label: "危老重建案件管理",
        value: "危老重建案件管理",
        route: "/case-management-dangerous-admin",
      },
    ],
    defaultExpanded: true,
  },
  {
    title: "首頁維護",
    icon: "page",
    subItems: [
      {
        label: "案件統計維護",
        value: "案件統計維護",
        route: "/case-statistics",
      },
      {
        label: "常見問題維護",
        value: "常見問題維護",
        route: "/faq-management",
      },
      {
        label: "下載專區維護",
        value: "下載專區維護",
        route: "/downloads-management",
      },
      {
        label: "公開消息維護",
        value: "公開消息維護",
        route: "/public-message-management",
      },
    ],
    defaultExpanded: true,
  },
  {
    title: "系統管理",
    icon: "briefcase",
    subItems: [
      {
        label: "內部人員帳號管理",
        value: "內部人員帳號管理",
        route: "/internal-staff-account-management",
      },
      {
        label: "申請人帳號管理",
        value: "申請人帳號管理",
        route: "#",
      },
      {
        label: "幹事名單管理",
        value: "幹事名單管理",
        route: "/officer-list-management",
      },
      {
        label: "數據分析",
        value: "數據分析",
        route: "#",
      },
    ],
  },
  {
    title: "我的帳號",
    icon: "userSettings",
    subItems: [
      {
        label: "人員帳號管理",
        value: "人員帳號管理",
        route: "/profile",
      },
    ],
    defaultExpanded: false,
  },
];

// 根據身份選擇對應的選單配置
const sidebarMenuConfig = computed(() => (isAdmin.value ? adminSidebarMenuConfig : userSidebarMenuConfig));

const router = useRouter();
const route = useRoute();

// 從 localStorage 讀取用戶角色來判斷是否為管理員
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

// 根據當前路由確定選中的項目
const selectedItem = ref<string>("");

// 當前展開的手風琴索引
const expandedIndex = ref<number | null>(null);

// 側邊欄顯示/隱藏狀態（移動端）
const isSidebarOpen = ref(false);

// 側邊欄 ID（用於 aria-controls）
const sidebarId = computed(() => `sidebar-${Math.random().toString(36).substring(2, 11)}`);

// 切換側邊欄
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 關閉側邊欄
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// 處理手風琴展開/收合
const handleAccordionToggle = (index: number, isExpanded: boolean) => {
  if (isExpanded) {
    // 如果當前手風琴展開，設置為當前索引
    expandedIndex.value = index;
  } else {
    // 如果當前手風琴收合，清除索引
    if (expandedIndex.value === index) {
      expandedIndex.value = null;
    }
  }
};

// 將配置轉換為 SidebarAccordion 需要的格式
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

// 更新選中項目的函數
const updateSelectedItem = () => {
  // 直接在 sidebarMenuConfig 中查找
  const config = sidebarMenuConfig.value;
  for (let i = 0; i < config.length; i++) {
    const menuItem = config[i];
    // 先嘗試精確匹配
    let subItem = menuItem.subItems.find((item) => item.route === route.path);
    // 如果沒有精確匹配，嘗試匹配父路由（用於子路由，如 /case-statistics/add 匹配 /case-statistics）
    if (!subItem) {
      subItem = menuItem.subItems.find((item) => {
        if (!item.route || item.route === "#") return false;
        // 檢查當前路由是否以子項目的路由開頭
        return route.path.startsWith(item.route);
      });
    }
    if (subItem) {
      selectedItem.value = subItem.value;
      // 自動展開包含選中項目的手風琴
      expandedIndex.value = i;
      return;
    }
  }
  // 如果沒有找到匹配項，預設選中第一個子選單項
  selectedItem.value = config[0]?.subItems[0]?.value || "";
  // 預設展開第一個手風琴（如果有 defaultExpanded）
  const defaultExpandedIndex = config.findIndex((item) => item.defaultExpanded);
  if (defaultExpandedIndex !== -1) {
    expandedIndex.value = defaultExpandedIndex;
  }
};

// 監聽登入/登出狀態變化，觸發 isAdmin 重新計算
const checkUserRole = () => {
  // 由於 isAdmin 是 computed，當 localStorage 變化時會自動重新計算
  // 這裡只需要觸發 updateSelectedItem 來更新選中項目
  updateSelectedItem();
};

// 初始化選中項目
onMounted(() => {
  updateSelectedItem();
  // 監聽 storage 事件（當其他標籤頁或窗口改變 localStorage 時）
  window.addEventListener("storage", checkUserRole);
  // 監聽自定義事件（當同一個標籤頁內登入/登出時）
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
  // 直接在 sidebarMenuConfig 中查找
  const config = sidebarMenuConfig.value;
  for (const menuItem of config) {
    const subItem = menuItem.subItems.find((item) => item.value === itemName);
    if (subItem) {
      router.push(subItem.route);
      emit("item-select", itemName);
      // 移動端：點擊後關閉側邊欄
      closeSidebar();
      return;
    }
  }
};

// 處理子項目點擊（包裝 selectItem 以支持關閉側邊欄）
const handleSubItemClick = (itemName: string) => {
  selectItem(itemName);
};

const emit = defineEmits<{
  "item-select": [itemName: string];
}>();
</script>

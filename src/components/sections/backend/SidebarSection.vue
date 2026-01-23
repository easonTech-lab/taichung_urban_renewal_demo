<template>
  <aside class="h-[940px] w-[328px] bg-white opacity-80">
    <div class="flex h-full w-full flex-col gap-4 overflow-clip px-3 py-4">
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
          @sub-item-click="selectItem"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SidebarAccordion, { type SidebarSubItem } from "@/components/atoms/SidebarAccordion.vue";

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
    icon: "home",
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
        route: "#",
      },
      {
        label: "公開消息維護",
        value: "公開消息維護",
        route: "#",
      },
    ],
    defaultExpanded: true,
  },
  {
    title: "系統管理",
    icon: "case", // 暫時使用 case 圖標，後續可添加 briefcase 圖標
    subItems: [],
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

// 根據身份選擇對應的選單配置
const sidebarMenuConfig = computed(() => (isAdmin.value ? adminSidebarMenuConfig : userSidebarMenuConfig));

const router = useRouter();
const route = useRoute();

// 判斷是否為管理員模式（根據路由名稱或路徑）
const isAdmin = computed(() => {
  const adminRoutes = [
    "case-management-admin",
    "case-management-dangerous-admin",
    "case-statistics", // 案件統計維護是管理員專用
    "case-statistics-add", // 新增年度是管理員專用
    "case-statistics-edit", // 編輯案件件數是管理員專用
    "faq-management", // 常見問題維護是管理員專用
  ];
  return (
    adminRoutes.includes(route.name as string) ||
    route.path.includes("-admin") ||
    route.path.startsWith("/case-statistics") ||
    route.path.startsWith("/faq-management")
  );
});

// 根據當前路由確定選中的項目
const selectedItem = ref<string>("");

// 當前展開的手風琴索引
const expandedIndex = ref<number | null>(null);

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

// 初始化選中項目
onMounted(() => {
  updateSelectedItem();
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
      return;
    }
  }
};

const emit = defineEmits<{
  "item-select": [itemName: string];
}>();
</script>

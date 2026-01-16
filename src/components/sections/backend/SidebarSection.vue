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
          :icon-class="menuItem.iconClass"
          :sub-items="menuItem.subItems"
          :default-expanded="menuItem.defaultExpanded"
          :selected-item="selectedItem"
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

// 側邊欄選單配置
const sidebarMenuConfig = [
  {
    title: "我的案件",
    icon: "chartPie",
    iconClass: "shrink-0 text-gray-800",
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
    iconClass: "shrink-0 text-gray-500",
    subItems: [
      {
        label: "編輯個人資料",
        value: "編輯個人資料",
        route: "/profile",
      },
    ],
  },
];

const router = useRouter();
const route = useRoute();

// 根據當前路由確定選中的項目
const selectedItem = ref<string>("");

// 將配置轉換為 SidebarAccordion 需要的格式
const menuItems = computed(() => {
  return sidebarMenuConfig.map((item) => ({
    title: item.title,
    icon: item.icon,
    iconClass: item.iconClass,
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
  for (const menuItem of sidebarMenuConfig) {
    const subItem = menuItem.subItems.find((item) => item.route === route.path);
    if (subItem) {
      selectedItem.value = subItem.value;
      return;
    }
  }
  // 預設選中第一個子選單項
  selectedItem.value = sidebarMenuConfig[0]?.subItems[0]?.value || "";
};

// 初始化選中項目
onMounted(() => {
  updateSelectedItem();
});

// 監聽路由變化
watch(
  () => route.path,
  () => {
    updateSelectedItem();
  }
);

const selectItem = (itemName: string) => {
  selectedItem.value = itemName;
  // 直接在 sidebarMenuConfig 中查找
  for (const menuItem of sidebarMenuConfig) {
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

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
import { backendMenuConfig, getValueByRoute, getRouteByValue } from "@/config/routes";

const router = useRouter();
const route = useRoute();

// 根據當前路由確定選中的項目
const selectedItem = ref<string>("");

// 將配置轉換為 SidebarAccordion 需要的格式
const menuItems = computed(() => {
  return backendMenuConfig.map((item) => ({
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
  const currentValue = getValueByRoute(route.path);
  if (currentValue) {
    selectedItem.value = currentValue;
  } else {
    // 預設選中第一個子選單項
    selectedItem.value = backendMenuConfig[0]?.subItems[0]?.value || "";
  }
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
  const routePath = getRouteByValue(itemName);
  if (routePath) {
    router.push(routePath);
  }
  emit("item-select", itemName);
};

const emit = defineEmits<{
  "item-select": [itemName: string];
}>();
</script>

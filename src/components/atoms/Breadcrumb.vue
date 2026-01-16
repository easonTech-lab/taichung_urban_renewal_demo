<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        class="inline-flex items-center"
        :aria-current="index === breadcrumbItems.length - 1 ? 'page' : undefined"
      >
        <!-- 分隔符（除了第一個項目） -->
        <div v-if="index > 0" class="mx-1.5 flex items-center">
          <Icon name="chevronRight" :size="14" class="text-gray-500" aria-hidden="true" />
        </div>

        <!-- 第一個項目（首頁，有圖標） -->
        <template v-if="index === 0">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            <Icon name="home" :size="16" class="mr-1.5 text-gray-500" aria-hidden="true" />
            {{ item.label }}
          </router-link>
          <a
            v-else-if="item.href"
            :href="item.href"
            class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            <Icon name="home" :size="16" class="mr-1.5 text-gray-500" aria-hidden="true" />
            {{ item.label }}
          </a>
          <span v-else class="inline-flex items-center text-sm font-medium text-gray-700">
            <Icon name="home" :size="16" class="mr-1.5 text-gray-500" aria-hidden="true" />
            {{ item.label }}
          </span>
        </template>

        <!-- 中間項目（可點擊連結） -->
        <template v-else-if="index < breadcrumbItems.length - 1">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            {{ item.label }}
          </router-link>
          <a
            v-else-if="item.href"
            :href="item.href"
            class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            {{ item.label }}
          </a>
          <span v-else class="inline-flex items-center text-sm font-medium text-gray-700">
            {{ item.label }}
          </span>
        </template>

        <!-- 最後一個項目（當前頁面，不可點擊） -->
        <template v-else>
          <span class="inline-flex items-center text-sm font-medium text-gray-500">
            {{ item.label }}
          </span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
import * as routerModule from "@/router/index";

export interface BreadcrumbItem {
  label: string;
  to?: string; // Vue Router 路徑
  href?: string; // 外部連結
}

const props = withDefaults(
  defineProps<{
    items?: BreadcrumbItem[]; // 可選，如果提供則使用提供的，否則自動生成
  }>(),
  {
    items: undefined,
  }
);

const route = useRoute();

// 根據路由路徑獲取麵包屑項目
const getBreadcrumbItems = (routePath: string): Array<{ label: string; to?: string; href?: string }> => {
  const items: Array<{ label: string; to?: string }> = [];
  // 如果是首頁
  if (routePath === "/") {
    return [{ label: "首頁" }];
  }
  // 從 router/index.ts 的路由配置中查找
  const routes = routerModule.routes;
  const currentRoute = routes.find((route: any) => route.path === routePath);
  if (!currentRoute) {
    // 如果找不到，返回首頁
    return [{ label: "首頁", to: "/" }];
  }
  // 添加首頁
  items.push({ label: "首頁", to: "/" });
  // 從 meta.breadcrumb 中讀取麵包屑信息
  const breadcrumbMeta = (currentRoute as any).meta?.breadcrumb;
  if (breadcrumbMeta) {
    // 遞歸添加所有父級
    const addParents = (parent: any) => {
      if (parent) {
        if (parent.parent) {
          addParents(parent.parent);
        }
        items.push({ label: parent.label, to: parent.to });
      }
    };
    if (breadcrumbMeta.parent) {
      addParents(breadcrumbMeta.parent);
    }
    // 添加當前路由
    items.push({ label: breadcrumbMeta.label });
  } else {
    // 如果沒有 meta，使用路由名稱作為 fallback
    const routeName = (currentRoute as any).name as string;
    const navLabel = (currentRoute as any).meta?.navLabel;
    items.push({ label: navLabel || routeName });
  }
  return items;
};

// 如果提供了 items，使用提供的；否則根據當前路由自動生成
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items;
  }
  // getBreadcrumbItems 返回的類型與 BreadcrumbItem 兼容
  return getBreadcrumbItems(route.path) as BreadcrumbItem[];
});
</script>

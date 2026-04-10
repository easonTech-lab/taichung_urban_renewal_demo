<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="inline-flex items-center" :aria-current="index === breadcrumbItems.length - 1 ? 'page' : undefined">
        <!-- 分隔符（除了第一個項目） -->
        <div v-if="index > 0" class="mx-1.5 flex items-center">
          <Icon name="arrowRight" :size="14" class="text-gray-500" aria-hidden="true" />
        </div>
        <!-- 第一個項目（首頁，有圖標） -->
        <template v-if="index === 0">
          <router-link v-if="item.to" :to="item.to" class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600">
            <Icon name="home" :size="16" class="mr-1.5 text-gray-500" aria-hidden="true" />
            {{ item.label }}
          </router-link>
          <a v-else-if="item.href" :href="item.href" class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600">
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
          <router-link v-if="item.to" :to="item.to" class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600">
            {{ item.label }}
          </router-link>
          <a v-else-if="item.href" :href="item.href" class="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-primary-600">
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
import Icon from "@/components/atoms/Icon.vue";
import { useRoute, type RouteLocationNormalizedLoaded, type RouteLocationRaw } from "vue-router";
export interface BreadcrumbItem {
  label: string;
  to?: RouteLocationRaw; // Vue Router 路徑或 location object
  href?: string; // 外部連結
}
const route = useRoute();
const props = withDefaults(
  defineProps<{
    items?: BreadcrumbItem[]; // 可選，如果提供則使用提供的，否則自動生成
  }>(),
  {
    items: undefined,
  }
);
// 如果提供了 items，使用提供的；否則根據當前路由自動生成
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items;
  }
  return resolveBreadcrumbItems(route);
});
const normalizeItems = (items: BreadcrumbItem[]): BreadcrumbItem[] => {
  if (items.length === 0) {
    return [{ label: "首頁", to: "/" }];
  }
  if (items[0]?.label !== "首頁") {
    return [{ label: "首頁", to: "/" }, ...items];
  }
  return items;
};
const buildItemsFromMeta = (metaBreadcrumb: any): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: "首頁", to: "/" }];
  const addParents = (parent: any) => {
    if (parent) {
      if (parent.parent) {
        addParents(parent.parent);
      }
      items.push({ label: parent.label, to: parent.to });
    }
  };
  if (metaBreadcrumb?.parent) {
    addParents(metaBreadcrumb.parent);
  }
  if (metaBreadcrumb?.label) {
    items.push({ label: metaBreadcrumb.label });
  }
  return items;
};
const resolveBreadcrumbItems = (currentRoute: RouteLocationNormalizedLoaded): BreadcrumbItem[] => {
  if (currentRoute.path === "/") {
    return [{ label: "首頁" }];
  }

  const metaBreadcrumb = currentRoute.meta?.breadcrumb as any;
  if (typeof metaBreadcrumb === "function") {
    const result = metaBreadcrumb(currentRoute);
    if (Array.isArray(result)) {
      return normalizeItems(result);
    }
    return buildItemsFromMeta(result);
  }

  if (metaBreadcrumb) {
    return buildItemsFromMeta(metaBreadcrumb);
  }

  const navLabel = currentRoute.meta?.navLabel as string | undefined;
  const routeName = (currentRoute.name as string | undefined) ?? "";
  return [{ label: "首頁", to: "/" }, { label: navLabel || routeName || "當前頁面" }];
};
</script>

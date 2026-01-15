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
import { getBreadcrumbItems } from "@/config/routes";

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

// 如果提供了 items，使用提供的；否則根據當前路由自動生成
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items;
  }
  // getBreadcrumbItems 返回的類型與 BreadcrumbItem 兼容
  return getBreadcrumbItems(route.path) as BreadcrumbItem[];
});
</script>

<template>
  <div class="inline-flex text-center text-sm font-medium text-gray-700">
    <ul class="-mb-px flex flex-wrap border-b border-gray-300">
      <li v-for="(item, index) in items" :key="index" class="w-[95px]">
        <!-- Router Link -->
        <router-link
          v-if="item.to && !item.disabled"
          :to="item.to"
          class="flex h-full w-full items-center justify-center rounded-t-lg border-b p-4 text-center transition-colors"
          :class="index === activeIndex ? 'active border-primary-700 text-primary-700' : 'border-transparent hover:border-primary-700 hover:text-primary-700'"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @click="handleClick(index, $event)"
        >
          {{ item.label }}
        </router-link>

        <!-- External Link -->
        <a
          v-else-if="item.href && !item.disabled"
          :href="item.href"
          class="flex h-full w-full items-center justify-center rounded-t-lg border-b p-4 text-center transition-colors"
          :class="index === activeIndex ? 'active border-primary-700 text-primary-700' : 'border-transparent hover:border-primary-700 hover:text-primary-700'"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @click="handleClick(index, $event)"
        >
          {{ item.label }}
        </a>

        <!-- Button -->
        <a
          v-else-if="!item.disabled"
          href="#"
          class="flex h-full w-full items-center justify-center rounded-t-lg border-b p-4 text-center transition-colors"
          :class="index === activeIndex ? 'active border-primary-700 text-primary-700' : 'border-transparent hover:border-primary-700 hover:text-primary-700'"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @click.prevent="handleClick(index, $event)"
        >
          {{ item.label }}
        </a>

        <!-- Disabled -->
        <a v-else class="flex h-full w-full cursor-not-allowed items-center justify-center rounded-t-lg p-4 text-center text-gray-400 dark:text-gray-600">
          {{ item.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface TabItem {
  label: string;
  to?: string; // Vue Router 路徑
  href?: string; // 外部連結
  disabled?: boolean; // 是否禁用
  [key: string]: any; // 允許其他屬性
}

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    modelValue?: number; // 當前激活的標籤索引（v-model 支持）
  }>(),
  {
    modelValue: 0,
  }
);

const emit = defineEmits<{
  "update:modelValue": [index: number];
  "tab-change": [index: number, item: TabItem];
  "tab-click": [index: number, item: TabItem, event: Event];
}>();

const activeIndex = computed(() => {
  return props.modelValue ?? 0;
});

const handleClick = (index: number, event: Event) => {
  const item = props.items[index];

  if (item.disabled) {
    event.preventDefault();
    return;
  }

  emit("update:modelValue", index);
  emit("tab-change", index, item);
  emit("tab-click", index, item, event);
};
</script>

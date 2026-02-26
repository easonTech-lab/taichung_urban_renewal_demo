<template>
  <div class="min-w-0 w-fit max-w-full overflow-x-auto overflow-y-hidden border-b border-gray-300 text-center text-sm font-medium text-gray-700">
    <ul ref="tabsListRef" class="-mb-px relative flex flex-nowrap w-fit gap-8">
      <li v-for="(item, index) in items" :key="index" :ref="(el) => setTabItemRef(el, index)" class="min-w-[95px]">
        <!-- Router Link -->
        <router-link
          v-if="item.to && !item.disabled"
          :to="item.to"
          class="flex h-full w-full items-center justify-center rounded-t-lg p-4 text-center whitespace-nowrap transition-colors"
          :class="[
            index === activeIndex ? 'text-primary-700' : 'text-gray-700 hover:text-primary-700',
            displayOnly ? 'cursor-default pointer-events-none' : '',
          ]"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @click="handleClick(index, $event)"
        >
          {{ item.label }}
        </router-link>

        <!-- External Link -->
        <a
          v-else-if="item.href && !item.disabled"
          :href="item.href"
          class="flex h-full w-full items-center justify-center rounded-t-lg p-4 text-center whitespace-nowrap transition-colors"
          :class="[
            index === activeIndex ? 'text-primary-700' : 'text-gray-700 hover:text-primary-700',
            displayOnly ? 'cursor-default pointer-events-none' : '',
          ]"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @click="handleClick(index, $event)"
        >
          {{ item.label }}
        </a>

        <!-- Button -->
        <a
          v-else-if="!item.disabled"
          href="#"
          class="flex h-full w-full items-center justify-center rounded-t-lg p-4 text-center whitespace-nowrap transition-colors"
          :class="[
            index === activeIndex ? 'text-primary-700' : 'text-gray-700 hover:text-primary-700',
            displayOnly ? 'cursor-default pointer-events-none' : '',
          ]"
          :aria-current="index === activeIndex ? 'page' : undefined"
          @click.prevent="handleClick(index, $event)"
        >
          {{ item.label }}
        </a>

        <!-- Disabled -->
        <a v-else class="flex h-full w-full cursor-not-allowed items-center justify-center rounded-t-lg p-4 text-center whitespace-nowrap text-gray-400 dark:text-gray-600">
          {{ item.label }}
        </a>
      </li>
      <li aria-hidden="true" class="pointer-events-none absolute bottom-0 h-0.5 bg-primary-700 transition-all duration-200 z-10" :style="indicatorStyle"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from "vue";

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
    displayOnly?: boolean; // 僅顯示不可切換
  }>(),
  {
    modelValue: 0,
    displayOnly: false,
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

const tabsListRef = ref<HTMLElement | null>(null);
const tabItemRefs = ref<HTMLElement[]>([]);
const indicatorStyle = ref<Record<string, string>>({
  opacity: "0",
  left: "0px",
  width: "0px",
});

const setTabItemRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (!el) return;
  if (el instanceof Element) {
    tabItemRefs.value[index] = el as HTMLElement;
    return;
  }
  const dom = el.$el;
  if (dom instanceof Element) {
    tabItemRefs.value[index] = dom as HTMLElement;
  }
};

const updateIndicator = () => {
  const tabsList = tabsListRef.value;
  const activeTab = tabItemRefs.value[activeIndex.value];
  if (!tabsList || !activeTab) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: "0" };
    return;
  }
  const ulRect = tabsList.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();
  const columnGap = parseFloat(window.getComputedStyle(tabsList).columnGap || "0");
  const halfGap = columnGap / 2;
  const rawLeft = tabRect.left - ulRect.left - halfGap;
  const rawWidth = tabRect.width + columnGap;
  const boundedLeft = Math.max(0, rawLeft);
  const boundedWidth = Math.min(rawWidth, ulRect.width - boundedLeft);
  indicatorStyle.value = {
    opacity: "1",
    left: `${boundedLeft}px`,
    width: `${Math.max(0, boundedWidth)}px`,
  };
};

const handleClick = (index: number, event: Event) => {
  const item = props.items[index];
  if (props.displayOnly) {
    event.preventDefault();
    return;
  }
  if (item.disabled) {
    event.preventDefault();
    return;
  }
  emit("update:modelValue", index);
  emit("tab-change", index, item);
  emit("tab-click", index, item, event);
};

onMounted(() => {
  nextTick(updateIndicator);
  window.addEventListener("resize", updateIndicator);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIndicator);
});

watch(
  () => [activeIndex.value, props.items.length],
  () => {
    nextTick(updateIndicator);
  },
  { immediate: true }
);
</script>

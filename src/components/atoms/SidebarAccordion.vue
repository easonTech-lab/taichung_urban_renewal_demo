<template>
  <div class="flex flex-col gap-1.5">
    <!-- Primary Item (可展開/收起的按鈕) -->
    <button
      type="button"
      class="flex h-9 w-full items-center gap-3 rounded-lg px-2 transition-colors"
      :class="[isExpanded ? 'bg-gray-100 py-1.5' : 'py-0 hover:bg-gray-50', buttonClass]"
      :aria-expanded="isExpanded"
      :aria-controls="`sidebar-accordion-${accordionId}`"
      @click="toggle"
    >
      <div class="flex flex-1 items-start gap-3">
        <Icon v-if="icon" :name="icon" :size="24" :class="iconClass" aria-hidden="true" />
        <p class="text-base font-medium leading-normal text-gray-900">{{ title }}</p>
      </div>
      <Icon :name="isExpanded ? 'chevronUp' : 'chevronDown'" :size="24" class="shrink-0 text-gray-800" aria-hidden="true" />
    </button>

    <!-- Submenu (子選單項) -->
    <div
      v-if="isExpanded"
      :id="`sidebar-accordion-${accordionId}`"
      class="flex flex-col gap-1.5 py-0 pl-12 pr-0"
      role="region"
      :aria-label="`${title}的子選單`"
    >
      <slot name="submenu">
        <button
          v-for="(subItem, index) in subItems"
          :key="index"
          type="button"
          class="flex h-11 items-start gap-0 px-0 py-2.5 transition-colors"
          :class="[selectedItem === subItem.value ? 'text-primary-600' : 'text-gray-900 hover:text-primary-600', subItemClass]"
          @click="handleSubItemClick(subItem.value)"
        >
          <p class="text-base font-medium leading-normal">{{ subItem.label }}</p>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";

export interface SidebarSubItem {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    icon?: string;
    iconClass?: string;
    buttonClass?: string;
    subItemClass?: string;
    subItems?: SidebarSubItem[];
    defaultExpanded?: boolean;
    selectedItem?: string;
  }>(),
  {
    icon: undefined,
    iconClass: "shrink-0 text-gray-800",
    buttonClass: "",
    subItemClass: "",
    subItems: () => [],
    defaultExpanded: false,
    selectedItem: undefined,
  }
);

const emit = defineEmits<{
  toggle: [isExpanded: boolean];
  "sub-item-click": [value: string];
}>();

const accordionId = computed(() => Math.random().toString(36).substring(2, 11));
const isExpanded = ref(props.defaultExpanded);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
  emit("toggle", isExpanded.value);
};

const handleSubItemClick = (value: string) => {
  emit("sub-item-click", value);
};

// 暴露方法供父組件調用
defineExpose({
  expand: () => {
    isExpanded.value = true;
  },
  collapse: () => {
    isExpanded.value = false;
  },
  toggle,
  isExpanded: computed(() => isExpanded.value),
});
</script>

<template>
  <div class="relative">
    <!-- 觸發按鈕 -->
    <ButtonCTA
      :id="buttonId"
      :variant="buttonVariant"
      :size="buttonSize"
      :disabled="disabled"
      :left-icon="leftIcon"
      :right-icon="!showRightIcon || rotateIcon ? undefined : rightIcon || 'chevronDown'"
      :type="'button'"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      class="relative"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
      @keydown.esc="close"
    >
      <template v-if="showRightIcon && rotateIcon">
        <slot name="button">
          {{ buttonText }}
        </slot>
        <!-- 可旋轉的圖標 -->
        <Icon :name="rightIcon || 'chevronDown'" :size="iconSize" class="shrink-0 transition-transform" :class="isOpen ? 'rotate-180' : ''" aria-hidden="true" />
      </template>
      <template v-else>
        <slot name="button">
          {{ buttonText }}
        </slot>
      </template>
    </ButtonCTA>

    <!-- 下拉選單 -->
    <div
      v-show="isOpen"
      :id="dropdownId"
      :class="[
        'absolute z-50 mt-1 rounded-lg border border-gray-300 bg-white shadow-sm',
        align === 'right' ? 'right-0' : 'left-0',
        menuWidth === 'w-full' ? 'w-full' : menuWidth || 'min-w-[412px]',
        menuClass,
      ]"
      role="menu"
      :aria-labelledby="buttonId"
    >
      <div class="flex flex-col overflow-clip px-0 py-2">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          :class="[
            'flex w-full items-center px-4 py-4 text-lg font-normal leading-normal text-gray-900 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
            selectedIndex === index ? 'bg-blue-50' : '',
            item.class,
          ]"
          role="menuitem"
          :aria-label="item.label"
          :aria-current="selectedIndex === index ? 'true' : undefined"
          @click="handleItemClick(item, index, $event)"
          @keydown.enter="handleItemClick(item, index, $event)"
          @keydown.space.prevent="handleItemClick(item, index, $event)"
        >
          <slot :name="`item-${index}`" :item="item" :index="index">
            {{ item.label }}
          </slot>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
export interface ButtonDropdownItem {
  label: string;
  value?: string;
  class?: string;
  [key: string]: any;
}
const props = withDefaults(
  defineProps<{
    buttonText?: string;
    items: ButtonDropdownItem[];
    buttonVariant?: "primary" | "dark" | "green" | "red" | "gray" | "white" | "alternative" | "alternativeDark" | "text" | "ghost" | "outline" | "none";
    buttonSize?: "xs" | "sm" | "base" | "l" | "xl";
    leftIcon?: string;
    rightIcon?: string;
    rotateIcon?: boolean; // 是否在打開時旋轉圖標
    showRightIcon?: boolean; // 是否顯示右側圖標
    align?: "left" | "right";
    selectedIndex?: number; // 當前選中的索引
    disabled?: boolean;
    menuClass?: string; // 下拉選單的自訂 class
    menuWidth?: string; // 下拉選單的寬度（例如 "w-48", "w-[412px]"）
  }>(),
  {
    buttonText: "Dropdown",
    buttonVariant: "primary",
    buttonSize: "base",
    rotateIcon: true,
    showRightIcon: true,
    align: "left",
    selectedIndex: undefined,
    disabled: false,
    menuClass: "",
    menuWidth: undefined,
  }
);
const emit = defineEmits<{
  "item-click": [item: ButtonDropdownItem, index: number];
  toggle: [isOpen: boolean];
  "update:selectedIndex": [index: number | undefined];
}>();
const isOpen = ref(false);
const buttonId = computed(() => `button-dropdown-${Math.random().toString(36).substring(2, 11)}`);
const dropdownId = computed(() => `dropdown-${Math.random().toString(36).substring(2, 11)}`);
// 計算圖標大小（與 ButtonCTA 的 size 匹配）
const iconSize = computed(() => {
  const sizeMap = {
    xs: 16,
    sm: 18,
    base: 20,
    l: 24,
    xl: 24,
  };
  return sizeMap[props.buttonSize] || 20;
});
const toggle = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
};
const close = () => {
  if (isOpen.value) {
    isOpen.value = false;
    emit("toggle", false);
  }
};
const handleItemClick = (item: ButtonDropdownItem, index: number, event: Event) => {
  event.preventDefault();
  emit("item-click", item, index);
  emit("update:selectedIndex", index);
  close();
};
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdownElement = document.getElementById(dropdownId.value);
  const buttonElement = document.getElementById(buttonId.value);
  if (isOpen.value && dropdownElement && buttonElement && !dropdownElement.contains(target) && !buttonElement.contains(target)) {
    close();
  }
};
// 處理 ESC 鍵
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) {
    close();
  }
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
});
</script>

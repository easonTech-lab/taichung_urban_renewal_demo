<template>
  <div class="relative">
    <!-- 觸發按鈕 -->
    <button
      :id="buttonId"
      type="button"
      class="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium leading-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="buttonClasses"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
      @keydown.esc="close"
    >
      <slot name="button">
        {{ buttonText }}
      </slot>
      <Icon
        name="chevronDown"
        :size="16"
        class="-mr-0.5 ml-1.5 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
        aria-hidden="true"
      />
    </button>

    <!-- 下拉選單 -->
    <div
      v-show="isOpen"
      :id="dropdownId"
      :class="[
        'absolute z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white shadow-lg',
        align === 'right' ? 'right-0' : 'left-0',
      ]"
      role="menu"
      :aria-labelledby="buttonId"
    >
      <ul class="py-1 text-sm text-gray-700">
        <li v-for="(item, index) in items" :key="index" role="none">
          <component
            :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
            :to="item.to"
            :href="item.href || '#'"
            :type="item.to || item.href ? undefined : 'button'"
            class="inline-flex w-full items-center rounded px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
            :class="item.class"
            role="menuitem"
            :aria-label="item.label"
            @click="handleItemClick(item, index, $event)"
            @keydown.enter="handleItemClick(item, index, $event)"
            @keydown.space.prevent="handleItemClick(item, index, $event)"
          >
            <slot :name="`item-${index}`" :item="item" :index="index">
              {{ item.label }}
            </slot>
          </component>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Icon from "@/components/atoms/Icon.vue";

export interface DropdownItem {
  label: string;
  to?: string; // Vue Router 路徑
  href?: string; // 外部連結
  class?: string; // 自訂 class
  [key: string]: any; // 允許其他屬性
}

const props = withDefaults(
  defineProps<{
    buttonText?: string;
    items: DropdownItem[];
    variant?: "primary" | "secondary" | "outline" | "ghost";
    align?: "left" | "right";
  }>(),
  {
    buttonText: "Dropdown button",
    variant: "primary",
    align: "left",
  }
);

const emit = defineEmits(["item-click", "toggle"]);

const isOpen = ref(false);
const buttonId = computed(() => `dropdown-button-${Math.random().toString(36).substring(2, 11)}`);
const dropdownId = computed(() => `dropdown-${Math.random().toString(36).substring(2, 11)}`);

const buttonClasses = computed(() => {
  const variantClasses = {
    primary: "bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 text-white border-primary-500",
    secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white border-gray-600",
    outline: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border",
    ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };
  return variantClasses[props.variant];
});

const toggle = () => {
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
};

const close = () => {
  if (isOpen.value) {
    isOpen.value = false;
    emit("toggle", false);
  }
};

const handleItemClick = (item: DropdownItem, index: number, event: Event) => {
  // 如果是按鈕類型，阻止預設行為
  if (!item.to && !item.href) {
    event.preventDefault();
  }
  emit("item-click", item, index);
  close();
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdownElement = document.getElementById(dropdownId.value);
  const buttonElement = document.getElementById(buttonId.value);

  if (
    isOpen.value &&
    dropdownElement &&
    buttonElement &&
    !dropdownElement.contains(target) &&
    !buttonElement.contains(target)
  ) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

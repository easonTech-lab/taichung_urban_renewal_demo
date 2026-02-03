<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Vertical Layout (default) -->
    <template v-if="labelPosition === 'vertical' || !labelPosition">
      <label v-if="showLabel && label" :for="buttonId" class="relative inline-block text-base font-medium" :class="labelClasses">
        {{ label }}
        <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
      </label>
      <div class="relative w-full">
        <!-- 觸發按鈕 -->
        <button
          :id="buttonId"
          type="button"
          class="inline-flex h-[52px] w-full items-center justify-between rounded-lg border px-4 py-3.5 text-lg font-medium leading-5 shadow-sm focus:outline-none focus:ring-2"
          :class="buttonClasses"
          :aria-expanded="isOpen"
          :aria-haspopup="true"
          @click="toggle"
          @keydown.enter="toggle"
          @keydown.space.prevent="toggle"
          @keydown.esc="close"
        >
          <span :class="buttonTextClasses">
            {{ buttonText || placeholder }}
          </span>
          <Icon name="chevronDown" :size="20" class="ml-1.5 transition-transform" :class="isOpen ? 'rotate-180' : ''" aria-hidden="true" />
        </button>

        <!-- 下拉選單 -->
        <div
          v-show="isOpen"
          :id="dropdownId"
          :class="['absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg', align === 'right' ? 'right-0' : 'left-0']"
          role="menu"
          :aria-labelledby="buttonId"
        >
          <ul class="max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
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

    <!-- Horizontal Layout -->
    <template v-else-if="labelPosition === 'horizontal'">
      <div class="flex w-full items-center gap-2">
        <label v-if="showLabel && label" :for="buttonId" class="relative inline-block whitespace-nowrap text-base font-medium" :class="labelClasses">
          {{ label }}
          <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
        </label>
        <div class="relative flex-1">
          <!-- 觸發按鈕 -->
          <button
            :id="buttonId"
            type="button"
            class="inline-flex h-[52px] w-full items-center justify-between rounded-lg border px-4 py-3.5 text-lg font-medium leading-5 shadow-sm focus:outline-none focus:ring-2"
            :class="buttonClasses"
            :aria-expanded="isOpen"
            :aria-haspopup="true"
            @click="toggle"
            @keydown.enter="toggle"
            @keydown.space.prevent="toggle"
            @keydown.esc="close"
          >
            <span :class="buttonTextClasses">
              {{ buttonText || placeholder }}
            </span>
            <Icon name="chevronDown" :size="20" class="ml-1.5 transition-transform" :class="isOpen ? 'rotate-180' : ''" aria-hidden="true" />
          </button>

          <!-- 下拉選單 -->
          <div
            v-show="isOpen"
            :id="dropdownId"
            :class="['absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg', align === 'right' ? 'right-0' : 'left-0']"
            role="menu"
            :aria-labelledby="buttonId"
          >
            <ul class="max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
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
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Icon from "@/components/atoms/Icon.vue";

export interface InputDropdownItem {
  label: string;
  to?: string; // Vue Router 路徑
  href?: string; // 外部連結
  class?: string; // 自訂 class
  [key: string]: any; // 允許其他屬性
}

const props = withDefaults(
  defineProps<{
    label?: string;
    showLabel?: boolean; // 是否顯示 label
    required?: boolean; // 是否必填（顯示 *）
    labelPosition?: "horizontal" | "vertical"; // label 位置：水平或垂直
    buttonText?: string;
    placeholder?: string;
    items: InputDropdownItem[];
    variant?: "primary" | "secondary" | "outline" | "ghost";
    align?: "left" | "right";
    containerClass?: string; // 容器自訂 class
  }>(),
  {
    showLabel: true,
    required: false,
    labelPosition: "vertical",
    buttonText: "",
    placeholder: "請選擇",
    variant: "outline",
    align: "left",
    containerClass: "",
  }
);

const emit = defineEmits(["item-click", "toggle"]);

const isOpen = ref(false);
const buttonId = computed(() => `input-dropdown-button-${Math.random().toString(36).substring(2, 11)}`);
const dropdownId = computed(() => `input-dropdown-${Math.random().toString(36).substring(2, 11)}`);

const buttonClasses = computed(() => {
  const variantClasses = {
    primary: "bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 text-white border-primary-500",
    secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-primary-500 text-white border-gray-600",
    outline: "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-50 focus:border-primary-500 focus:ring-primary-500 placeholder:text-gray-500",
    ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:border-primary-500 focus:ring-primary-500",
  };
  return variantClasses[props.variant];
});

const buttonTextClasses = computed(() => {
  if (!props.buttonText) {
    return "text-gray-500";
  }
  return "text-gray-900";
});

const labelClasses = computed(() => {
  return "text-gray-900";
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

const handleItemClick = (item: InputDropdownItem, index: number, event: Event) => {
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

  if (isOpen.value && dropdownElement && buttonElement && !dropdownElement.contains(target) && !buttonElement.contains(target)) {
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

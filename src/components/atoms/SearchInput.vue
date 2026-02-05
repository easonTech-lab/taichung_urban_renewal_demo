<template>
  <div :class="containerClass">
    <label v-if="showLabel && !labelHidden" :for="inputId" class="mb-2.5 block text-sm font-medium text-gray-900">
      {{ label || "Search" }}
    </label>
    <label v-else-if="labelHidden" :for="inputId" class="sr-only">
      {{ label || "Search" }}
    </label>
    <form class="flex items-center gap-4" @submit.prevent="handleSubmit">
      <div class="relative flex-1">
        <!-- 搜尋圖標 -->
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon name="search" :size="16" :class="iconColor" aria-hidden="true" />
        </div>
        <!-- 輸入框 -->
        <input
          :id="inputId"
          v-model="searchValue"
          type="search"
          :placeholder="placeholder"
          :required="required"
          :aria-label="ariaLabel"
          class="block w-full rounded-lg border p-3 pl-10 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          :class="inputClasses"
          @input="handleInput"
          @keydown.enter="handleSubmit"
          v-bind="$attrs"
        />
        <!-- 清除按鈕（永遠顯示） -->
        <button
          v-if="hasValue"
          type="button"
          class="absolute inset-y-0 right-0 z-20 flex w-8 items-center justify-center pr-3 text-gray-600 hover:text-gray-900 focus:outline-none"
          :aria-label="'清除搜尋內容'"
          @click="handleClear"
        >
          <Icon name="close" :size="16" color="currentColor" aria-hidden="true" />
        </button>
      </div>
      <!-- 搜尋按鈕 -->
      <ButtonCTA type="submit" :variant="buttonVariant" :class="buttonClass" :disabled="disabled" :aria-label="buttonAriaLabel || ariaLabel" @click="handleSubmit">
        {{ buttonText }}
      </ButtonCTA>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    labelHidden?: boolean;
    showLabel?: boolean;
    placeholder?: string;
    buttonText?: string;
    required?: boolean;
    disabled?: boolean;
    containerClass?: string;
    inputVariant?: "default" | "gray";
    iconColor?: string;
    buttonVariant?: "primary" | "ghost" | "outline";
    buttonClass?: string;
    ariaLabel?: string;
    buttonAriaLabel?: string;
    autoSearch?: boolean; // 是否在輸入時自動觸發搜尋
  }>(),
  {
    modelValue: "",
    label: "Search",
    labelHidden: false,
    showLabel: false,
    placeholder: "Search",
    buttonText: "Search",
    required: false,
    disabled: false,
    containerClass: "",
    inputVariant: "default",
    iconColor: "text-gray-500",
    buttonVariant: "primary",
    buttonClass: "",
    ariaLabel: "Search",
    buttonAriaLabel: "",
    autoSearch: false, // 預設不自動搜尋
  }
);

// Vue 2.7 的 defineEmits 需要明確聲明
const emit = defineEmits(["update:modelValue", "submit", "input"]);

const inputId = computed(() => `search-input-${Math.random().toString(36).substring(2, 11)}`);

const searchValue = ref(props.modelValue || "");

// 計算是否有輸入值
const hasValue = computed(() => {
  return searchValue.value && searchValue.value.trim().length > 0;
});

watch(
  () => props.modelValue,
  (newValue) => {
    searchValue.value = newValue || "";
  },
  { immediate: true }
);

const inputClasses = computed(() => {
  if (props.inputVariant === "gray") {
    return "bg-gray-50 border border-gray-300 placeholder:text-gray-500 text-gray-900";
  }
  return "bg-white border border-gray-300 placeholder:text-gray-500 text-gray-900";
});

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  searchValue.value = value;
  emit("update:modelValue", value);
  // 只有在 autoSearch 為 true 時才觸發 input 事件（自動搜尋）
  if (props.autoSearch) {
    emit("input", value);
  }
};

const handleSubmit = () => {
  if (!props.disabled) {
    emit("submit", searchValue.value);
  }
};

const handleClear = () => {
  searchValue.value = "";
  emit("update:modelValue", "");
  emit("input", "");
};
</script>

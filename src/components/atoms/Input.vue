<template>
  <div class="inline-flex flex-col items-start gap-2" :class="[containerClass || 'w-full']">
    <!-- Vertical Layout (default) -->
    <template v-if="labelPosition === 'vertical' || !labelPosition">
      <label v-if="showLabel && label" :for="inputId" class="relative inline-block text-base font-medium" :class="labelClasses">
        {{ label }}
        <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
      </label>
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="block w-full rounded-lg border text-gray-900 shadow-sm transition-colors disabled:bg-gray-200 disabled:text-gray-700"
        :class="[inputClasses, sizeClasses]"
        @input="handleInput"
        v-bind="$attrs"
      />
    </template>

    <!-- Horizontal Layout -->
    <template v-else-if="labelPosition === 'horizontal'">
      <div class="flex w-full items-center gap-2">
        <label v-if="showLabel && label" :for="inputId" class="relative inline-block whitespace-nowrap text-base font-medium" :class="labelClasses">
          {{ label }}
          <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
        </label>
        <input
          :id="inputId"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          class="block flex-1 rounded-lg border text-gray-900 shadow-sm transition-colors disabled:bg-gray-200 disabled:text-gray-700"
          :class="[inputClasses, sizeClasses]"
          @input="handleInput"
          v-bind="$attrs"
        />
      </div>
    </template>

    <p v-if="error || errorMessage" class="mt-2.5 text-sm text-red-600">
      <span v-if="errorTitle" class="font-medium">{{ errorTitle }}</span>
      <span v-if="errorTitle && errorMessage"> </span>
      <span v-if="errorMessage">{{ errorMessage }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    showLabel?: boolean; // 是否顯示 label
    required?: boolean; // 是否必填（顯示 *）
    labelPosition?: "horizontal" | "vertical"; // label 位置：水平或垂直
    type?: "text" | "password" | "email" | "number" | "tel" | "url";
    placeholder?: string;
    modelValue?: string;
    disabled?: boolean;
    variant?: "default" | "disabled";
    size?: "sm" | "base" | "lg"; // 輸入框尺寸
    error?: boolean;
    errorMessage?: string;
    errorTitle?: string;
    clearErrorOnInput?: boolean; // 是否在輸入時自動清除錯誤
    containerClass?: string; // 容器自訂 class
  }>(),
  {
    showLabel: true,
    required: false,
    labelPosition: "vertical",
    type: "text",
    disabled: false,
    variant: "default",
    size: "base",
    error: false,
    clearErrorOnInput: true, // 預設為 true，輸入時自動清除錯誤
    containerClass: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "clear-error": []; // 通知父組件清除錯誤
}>();

// 監聽輸入變化，當用戶開始輸入時自動清除錯誤
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    // 當用戶開始輸入（值發生變化）且有錯誤時，通知父組件清除錯誤
    if (props.clearErrorOnInput && (props.error || props.errorMessage) && newValue !== oldValue) {
      emit("clear-error");
    }
  }
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const inputId = computed(() => `input-${Math.random().toString(36).substring(2, 11)}`);

const inputClasses = computed(() => {
  // 錯誤狀態（優先級最高）
  if (props.error || props.errorMessage) {
    return "bg-red-50 border-red-300 text-red-900 placeholder:text-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500";
  }

  // 禁用狀態
  if (props.disabled || props.variant === "disabled") {
    return "bg-gray-200 border-gray-300 text-gray-700";
  }

  // 預設狀態
  return "bg-gray-50 border-gray-300 placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500";
});

const labelClasses = computed(() => {
  if (props.error || props.errorMessage) {
    return "text-red-600";
  }
  return "text-gray-900";
});

// 尺寸類別
const sizeClasses = computed(() => {
  const sizeMap = {
    sm: "px-4 py-3 text-sm",
    base: "px-4 py-3 text-sm",
    lg: "px-4 py-3.5 text-lg h-[52px]",
  };
  return sizeMap[props.size];
});
</script>

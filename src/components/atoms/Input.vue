<template>
  <div class="inline-flex w-full flex-col items-start justify-start gap-2">
    <label v-if="label" :for="inputId" class="mb-2.5 block text-sm font-medium" :class="labelClasses">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      class="block w-full rounded-lg border p-3 text-sm text-gray-900 shadow-sm transition-colors disabled:bg-gray-200 disabled:text-gray-700"
      :class="inputClasses"
      @input="handleInput"
      v-bind="$attrs"
    />
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
    type?: "text" | "password" | "email" | "number" | "tel" | "url";
    placeholder?: string;
    modelValue?: string;
    disabled?: boolean;
    required?: boolean;
    variant?: "default" | "disabled";
    error?: boolean;
    errorMessage?: string;
    errorTitle?: string;
    clearErrorOnInput?: boolean; // 是否在輸入時自動清除錯誤
  }>(),
  {
    type: "text",
    disabled: false,
    required: false,
    variant: "default",
    error: false,
    clearErrorOnInput: true, // 預設為 true，輸入時自動清除錯誤
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
  return "bg-white border-gray-300 placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500";
});

const labelClasses = computed(() => {
  if (props.error || props.errorMessage) {
    return "text-red-600";
  }
  return "text-gray-900";
});
</script>

<template>
  <div class="flex w-full min-w-0 flex-col items-start gap-2" :class="containerClass">
    <label v-if="showLabel && label" :for="inputId" class="relative inline-block text-base font-medium" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="absolute -right-2 -top-1 text-xs leading-none text-red-500">*</span>
    </label>
    <div class="relative w-full min-w-0">
      <div
        class="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5"
        aria-hidden="true"
      >
        <svg
          class="h-4 w-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <input
        :id="inputId"
        ref="inputRef"
        :value="modelValue"
        type="time"
        :min="min"
        :max="max"
        :disabled="disabled"
        :required="required"
        :aria-label="ariaLabel || label"
        class="block w-full rounded-lg border bg-gray-50 pe-10 text-gray-900 shadow-sm transition-colors placeholder:text-gray-500 disabled:bg-gray-200 disabled:text-gray-700"
        :class="[inputClasses, sizeClasses]"
        @input="handleInput"
        @click="handleClick"
        v-bind="$attrs"
      />
    </div>
    <p v-if="error || errorMessage" class="mt-2.5 text-sm text-red-600">
      <span v-if="errorTitle" class="font-medium">{{ errorTitle }}</span>
      <span v-if="errorTitle && errorMessage"> </span>
      <span v-if="errorMessage">{{ errorMessage }}</span>
    </p>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    showLabel?: boolean;
    required?: boolean;
    disabled?: boolean;
    min?: string; // HH:mm 例如 "09:00"
    max?: string; // HH:mm 例如 "18:00"
    containerClass?: string;
    size?: "sm" | "base" | "lg";
    error?: boolean;
    errorMessage?: string;
    errorTitle?: string;
    ariaLabel?: string;
  }>(),
  {
    showLabel: true,
    required: false,
    disabled: false,
    min: undefined,
    max: undefined,
    containerClass: "",
    size: "base",
    error: false,
  }
);
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
const inputId = ref(`timepicker-${Math.random().toString(36).substring(2, 11)}`);
const inputRef = ref<HTMLInputElement | null>(null);
const inputClasses = computed(() => {
  if (props.error || props.errorMessage) {
    return "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500";
  }
  if (props.disabled) {
    return "border-gray-300";
  }
  return "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500";
});
const labelClasses = computed(() => {
  if (props.error || props.errorMessage) return "text-red-600";
  return "text-gray-900";
});
const sizeClasses = computed(() => {
  const sizeMap = {
    sm: "px-4 py-3 text-sm",
    base: "px-4 py-3 text-sm",
    lg: "h-[52px] px-4 py-3.5 text-lg",
  };
  return sizeMap[props.size];
});
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
const handleClick = () => {
  const el = inputRef.value;
  if (el && typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
    (el as HTMLInputElement & { showPicker: () => void }).showPicker();
  }
};
</script>

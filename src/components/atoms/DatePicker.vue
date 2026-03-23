<template>
  <div :class="containerClass">
    <label v-if="label" :for="inputId" class="mb-2 block text-base font-medium text-gray-900">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>
    <div :class="displayClasses">
      <span :class="displayTextClasses">{{ displayText }}</span>
      <Icon name="calendar" :size="20" class="text-gray-600" aria-hidden="true" />
      <input
        :id="inputId"
        ref="datePickerRef"
        v-model="internalValue"
        type="date"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="minDateString"
        :max="maxDateString"
        :class="inputClasses"
        :aria-label="ariaLabel || placeholder"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Icon from "@/components/atoms/Icon.vue";
const props = withDefaults(
  defineProps<{
    modelValue?: string | Date | null;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    containerClass?: string;
    inputClass?: string;
    ariaLabel?: string;
    dateFormat?: string; // 日期格式，例如 'YYYY-MM-DD' 或 'MM/DD/YYYY'
    minDate?: string | Date; // 最小日期
    maxDate?: string | Date; // 最大日期
  }>(),
  {
    modelValue: null,
    label: "",
    placeholder: "Select date",
    disabled: false,
    required: false,
    readonly: false,
    containerClass: "max-w-sm",
    inputClass: "",
    ariaLabel: "Select date",
    dateFormat: "YYYY-MM-DD",
  }
);
const emit = defineEmits(["update:modelValue", "input", "change", "focus", "blur"]);
const datePickerRef = ref<HTMLInputElement | null>(null);
// Internal value for HTML5 date input (uses YYYY-MM-DD format)
const internalValue = ref<string>("");
const inputId = computed(() => `datepicker-${Math.random().toString(36).substring(2, 11)}`);
// Min/Max date strings for HTML5 date input
const minDateString = computed(() => {
  if (!props.minDate) return undefined;
  return convertToDateString(props.minDate);
});
const maxDateString = computed(() => {
  if (!props.maxDate) return undefined;
  return convertToDateString(props.maxDate);
});
const inputClasses = computed(() => {
  const baseClasses = "absolute inset-0 h-full w-full cursor-pointer opacity-0 [color:transparent] [background:transparent] focus:outline-none";
  const stateClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return `${baseClasses} ${stateClasses} ${props.inputClass}`.trim();
});
const displayClasses = computed(() => {
  const baseClasses =
    "relative flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500";
  const stateClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return `${baseClasses} ${stateClasses}`.trim();
});
const displayText = computed(() => {
  if (!internalValue.value) return props.placeholder;
  return internalValue.value.replace(/-/g, "/");
});
const displayTextClasses = computed(() => {
  return internalValue.value ? "text-sm text-gray-900" : "text-sm text-gray-400";
});
// Convert Date to YYYY-MM-DD string format for HTML5 date input
const convertToDateString = (value: string | Date | null): string => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// Convert YYYY-MM-DD string format to Date
const convertFromDateString = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  return date;
};
// Watch modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = convertToDateString(newValue);
  },
  { immediate: true }
);
// Watch internal value changes
watch(
  () => internalValue.value,
  (newValue) => {
    const date = convertFromDateString(newValue);
    emit("update:modelValue", date);
    emit("input", newValue);
  }
);
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const date = convertFromDateString(target.value);
  emit("change", date);
};
const handleFocus = (event: FocusEvent) => {
  const input = datePickerRef.value;
  if (input && "showPicker" in input) {
    (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
  }
  emit("focus", event);
};
const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};
</script>

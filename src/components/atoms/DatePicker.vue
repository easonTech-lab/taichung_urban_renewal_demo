<template>
  <div :class="containerClass">
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | Date | null;
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
const inputId = computed(() => `datepicker-${Math.random().toString(36).substring(2, 11)}`);

// Internal value for HTML5 date input (uses YYYY-MM-DD format)
const internalValue = ref<string>("");

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

// Min/Max date strings for HTML5 date input
const minDateString = computed(() => {
  if (!props.minDate) return undefined;
  return convertToDateString(props.minDate);
});

const maxDateString = computed(() => {
  if (!props.maxDate) return undefined;
  return convertToDateString(props.maxDate);
});

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

const inputClasses = computed(() => {
  const baseClasses =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const stateClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return `${baseClasses} ${stateClasses} ${props.inputClass}`.trim();
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const date = convertFromDateString(target.value);
  emit("change", date);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};
</script>

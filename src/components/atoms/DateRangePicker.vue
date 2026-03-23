<template>
  <div :id="dateRangePickerId" :class="containerClass">
    <div class="flex items-center gap-2">
      <input
        v-model="startDateValue"
        type="date"
        :placeholder="startPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="minDateString"
        :max="computedMaxStartDate"
        :class="inputClasses"
        :aria-label="startAriaLabel"
        @change="handleStartChange"
        @focus="handleStartFocus"
        @blur="handleStartBlur"
      />
      <span class="text-gray-500">{{ separatorText }}</span>
      <input
        v-model="endDateValue"
        type="date"
        :placeholder="endPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="computedMinEndDate"
        :max="maxDateString"
        :class="inputClasses"
        :aria-label="endAriaLabel"
        @change="handleEndChange"
        @focus="handleEndFocus"
        @blur="handleEndBlur"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
export interface DateRange {
  start: Date | string | null;
  end: Date | string | null;
}
const props = withDefaults(
  defineProps<{
    modelValue?: DateRange | null;
    startPlaceholder?: string;
    endPlaceholder?: string;
    separatorText?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    containerClass?: string;
    startAriaLabel?: string;
    endAriaLabel?: string;
    dateFormat?: string; // 日期格式，例如 'YYYY-MM-DD' 或 'MM/DD/YYYY'
    minDate?: string | Date; // 最小日期
    maxDate?: string | Date; // 最大日期
  }>(),
  {
    modelValue: null,
    startPlaceholder: "Select date start",
    endPlaceholder: "Select date end",
    separatorText: "to",
    disabled: false,
    required: false,
    readonly: false,
    containerClass: "",
    startAriaLabel: "Select start date",
    endAriaLabel: "Select end date",
    dateFormat: "YYYY-MM-DD",
  }
);
const emit = defineEmits(["update:modelValue", "start-change", "end-change", "range-change", "start-input", "end-input", "start-focus", "end-focus", "start-blur", "end-blur"]);
// Internal values for HTML5 date inputs
const startDateValue = ref<string>("");
const endDateValue = ref<string>("");
const dateRangePickerId = computed(() => `date-range-picker-${Math.random().toString(36).substring(2, 11)}`);
const inputClasses = computed(() => {
  const baseClasses =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const stateClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return `${baseClasses} ${stateClasses}`.trim();
});
// Min/Max date strings
const minDateString = computed(() => {
  if (!props.minDate) return undefined;
  return convertToDateString(props.minDate);
});
const maxDateString = computed(() => {
  if (!props.maxDate) return undefined;
  return convertToDateString(props.maxDate);
});
// Computed max date for start date (should be <= end date if end date is selected)
const computedMaxStartDate = computed(() => {
  if (endDateValue.value) {
    return endDateValue.value;
  }
  return maxDateString.value;
});
// Computed min date for end date (should be >= start date)
const computedMinEndDate = computed(() => {
  if (startDateValue.value) {
    return startDateValue.value;
  }
  return minDateString.value;
});
// Watch modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue.start && newValue.end) {
      startDateValue.value = convertToDateString(newValue.start);
      endDateValue.value = convertToDateString(newValue.end);
    } else {
      startDateValue.value = "";
      endDateValue.value = "";
    }
  },
  { immediate: true }
);
// Watch start date changes
watch(
  () => startDateValue.value,
  () => {
    updateDateRange();
  }
);
// Watch end date changes
watch(
  () => endDateValue.value,
  () => {
    updateDateRange();
  }
);
// Convert Date to YYYY-MM-DD string format
const convertToDateString = (value: Date | string | null): string => {
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
// Update date range and emit events
const updateDateRange = () => {
  const start = convertFromDateString(startDateValue.value);
  const end = convertFromDateString(endDateValue.value);
  if (start && end) {
    const dateRange: DateRange = { start, end };
    emit("update:modelValue", dateRange);
    emit("range-change", dateRange);
    emit("start-change", start);
    emit("end-change", end);
    emit("start-input", start);
    emit("end-input", end);
  } else {
    emit("update:modelValue", null);
    emit("range-change", null);
    emit("start-change", start);
    emit("end-change", end);
    emit("start-input", start);
    emit("end-input", end);
  }
};
const handleStartChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newStartDate = target.value;

  // 如果起始日期晚於結束日期，自動調整結束日期為起始日期
  if (newStartDate && endDateValue.value && newStartDate > endDateValue.value) {
    endDateValue.value = newStartDate;
    // endDateValue 的 watch 會自動觸發 updateDateRange，會發送所有必要的事件
  }
  // 無論是否調整結束日期，watch 都會自動處理更新
};
const handleEndChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newEndDate = target.value;

  // 如果結束日期早於起始日期，自動調整起始日期為結束日期
  if (newEndDate && startDateValue.value && newEndDate < startDateValue.value) {
    startDateValue.value = newEndDate;
    // startDateValue 的 watch 會自動觸發 updateDateRange，會發送所有必要的事件
  }
  // 無論是否調整起始日期，watch 都會自動處理更新
};
const handleStartFocus = (event: FocusEvent) => {
  emit("start-focus", event);
};
const handleEndFocus = (event: FocusEvent) => {
  emit("end-focus", event);
};
const handleStartBlur = (event: FocusEvent) => {
  emit("start-blur", event);
};
const handleEndBlur = (event: FocusEvent) => {
  emit("end-blur", event);
};
</script>

<template>
  <div class="relative">
    <button
      :id="buttonId"
      type="button"
      :data-dropdown-toggle="dropdownId"
      class="inline-flex items-center focus:outline-none focus:ring-4 focus:ring-gray-200"
      :class="[buttonClasses, variant === 'filter' ? 'w-full justify-between' : 'justify-center']"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
      @keydown.esc="close"
    >
      <slot name="button">
        <span :class="variant === 'filter' ? 'flex-1 text-left' : ''">{{ buttonText }}</span>
      </slot>
      <svg
        class="-me-0.5 ms-1.5 h-4 w-4 shrink-0 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
      </svg>
    </button>

    <!-- Flowbite Dropdown 選單 -->
    <div
      :id="dropdownId"
      :class="['absolute z-10 mt-2', align === 'right' ? 'right-0' : 'left-0', isOpen ? '' : 'hidden']"
      :style="{ minWidth: minWidth, width: minWidth === 'auto' ? '208px' : minWidth }"
      class="w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
      role="menu"
      :aria-labelledby="buttonId"
    >
      <ul class="p-2 text-sm text-gray-700" role="none">
        <li v-for="(item, index) in processedItems" :key="index" role="none">
          <div
            class="flex cursor-pointer items-center rounded-lg px-4 py-2 hover:bg-gray-100"
            role="menuitem"
            :aria-label="item.label"
            @click="handleItemClick(item, index, $event)"
            @keydown.enter="handleItemClick(item, index, $event)"
            @keydown.space.prevent="handleItemClick(item, index, $event)"
          >
            <!-- Flowbite Checkbox -->
            <div class="flex w-full items-center">
              <div class="relative flex h-4 w-4 items-center justify-center">
                <input
                  :id="`dropdown-checkbox-${index}`"
                  type="checkbox"
                  :checked="item.value === 'select-all' ? isAllSelected : isItemChecked(item.value)"
                  :indeterminate="item.value === 'select-all' && isIndeterminate"
                  disabled
                  class="pointer-events-none h-4 w-4 rounded border-gray-300 bg-gray-100 checked:border-primary-600 checked:bg-primary-600"
                />
                <!-- Checkmark icon for checked state -->
                <svg
                  v-if="isItemChecked(item.value) && !(item.value === 'select-all' && isIndeterminate)"
                  class="pointer-events-none absolute h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <!-- Indeterminate state: horizontal line -->
                <div v-if="item.value === 'select-all' && isIndeterminate" class="pointer-events-none absolute h-0.5 w-2 bg-white"></div>
              </div>
              <label :for="`dropdown-checkbox-${index}`" class="ms-2 w-full cursor-pointer text-sm font-medium text-gray-900">
                {{ item.label }}
              </label>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

export interface CheckboxDropdownItem {
  label: string;
  value: string | number;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    buttonText?: string;
    items: CheckboxDropdownItem[];
    modelValue?: (string | number)[];
    variant?: "primary" | "secondary" | "outline" | "ghost" | "filter";
    align?: "left" | "right";
    minWidth?: string;
    showSelectAll?: boolean;
  }>(),
  {
    buttonText: "Dropdown button",
    modelValue: () => [],
    variant: "primary",
    align: "left",
    minWidth: "auto",
    showSelectAll: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: (string | number)[]];
  change: [value: (string | number)[]];
  "item-click": [item: CheckboxDropdownItem, index: number];
  toggle: [isOpen: boolean];
}>();

const isOpen = ref(false);
const buttonId = computed(() => `checkbox-dropdown-button-${Math.random().toString(36).substring(2, 11)}`);
const dropdownId = computed(() => `checkbox-dropdown-${Math.random().toString(36).substring(2, 11)}`);

const buttonClasses = computed(() => {
  const variantClasses = {
    primary:
      "text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm",
    secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm",
    outline:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium",
    filter:
      "bg-gray-50 border border-gray-300 text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg px-4 py-3 text-sm font-normal leading-[1.25]",
  };
  return variantClasses[props.variant];
});

// 處理「全選」選項
const processedItems = computed(() => {
  if (props.showSelectAll && props.items.length > 0 && props.items[0].value !== "select-all") {
    return [{ label: "全選", value: "select-all" }, ...props.items];
  }
  return props.items;
});

// 獲取當前選中的值陣列
const selectedValues = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

// 創建一個 computed 屬性，返回一個函數來檢查項目是否被選中
// 這樣可以確保 Vue 3 正確追蹤 selectedValues 的變化
const isItemChecked = computed(() => {
  const selected = selectedValues.value;
  return (value: string | number): boolean => {
    // select-all 不在這裡判斷
    return selected.includes(value);
  };
});


// 檢查全選是否為半選狀態（部分選中）
const isIndeterminate = computed(() => {
  if (props.items.length === 0) return false;
  const selected = selectedValues.value;
  const selectedCount = props.items.filter((item) => selected.includes(item.value)).length;
  return selectedCount > 0 && selectedCount < props.items.length;
});

// 切換下拉選單顯示/隱藏
const toggle = () => {
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
};

// 關閉下拉選單
const close = () => {
  if (isOpen.value) {
    isOpen.value = false;
    emit("toggle", false);
  }
};

// 處理項目點擊
const handleItemClick = (item: CheckboxDropdownItem, index: number, event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  const currentSelected = [...selectedValues.value];
  let newSelected: (string | number)[] = [];

  if (item.value === "select-all") {
    // 處理「全選」
   const allSelected = isAllSelected.value;
    if (allSelected) {
      // 如果已經全選，則取消全選（設為空陣列）
      newSelected = [];
    } else {
      // 如果未全選，則全選所有項目
      newSelected = props.items.map((i) => i.value);
    }
  } else {
    // 處理單個選項
    const isCurrentlySelected = currentSelected.includes(item.value);
    if (isCurrentlySelected) {
      // 取消選中該項目
      newSelected = currentSelected.filter((v) => v !== item.value);
    } else {
      // 選中該項目
      newSelected = [...currentSelected, item.value];
    }
  }

  emit("update:modelValue", newSelected);
  emit("change", newSelected);
  emit("item-click", item, index);
};

// 處理點擊外部關閉下拉選單
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdownElement = document.getElementById(dropdownId.value);
  const buttonElement = document.getElementById(buttonId.value);

  if (isOpen.value && dropdownElement && buttonElement && !dropdownElement.contains(target) && !buttonElement.contains(target)) {
    close();
  }
};

const isAllSelected = computed(() => {
  if (props.items.length === 0) return false;
  return props.items.every((item) => selectedValues.value.includes(item.value));
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

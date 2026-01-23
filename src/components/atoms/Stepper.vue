<template>
  <ol class="relative border-l border-gray-300">
    <li
      v-for="(step, index) in steps"
      :key="index"
      :class="[
        'mb-10 ms-7',
        index === steps.length - 1 ? '' : '',
      ]"
    >
      <!-- Step Icon -->
      <span
        :class="[
          'absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white',
          getStepIconClass(step.status),
        ]"
      >
        <slot :name="`icon-${index}`" :step="step" :index="index">
          <Icon v-if="step.icon" :name="step.icon" :size="20" :color="getIconColor(step.status)" />
        </slot>
      </span>

      <!-- Step Content -->
      <div>
        <!-- Step Header (Clickable if accordion mode) -->
        <button
          v-if="accordionMode"
          type="button"
          class="w-full text-left"
          @click="toggleStep(index)"
        >
          <h3 :class="['font-medium leading-tight', getStepTitleClass(step.status)]">
            {{ step.title }}
          </h3>
          <p v-if="step.description" class="text-sm text-gray-600">
            {{ step.description }}
          </p>
        </button>
        <div v-else>
          <h3 :class="['font-medium leading-tight', getStepTitleClass(step.status)]">
            {{ step.title }}
          </h3>
          <p v-if="step.description" class="text-sm text-gray-600">
            {{ step.description }}
          </p>
        </div>

        <!-- Accordion Content (Expandable) -->
        <div
          v-if="accordionMode && isStepExpanded(index) && step.children"
          class="mt-4 ml-4 border-l-2 border-gray-300 pl-4"
        >
          <slot :name="`content-${index}`" :step="step" :index="index">
            <div v-if="step.children && step.children.length > 0" class="space-y-4">
              <div
                v-for="(child, childIndex) in step.children"
                :key="childIndex"
                class="flex items-center gap-3"
              >
                <div
                  :class="[
                    'flex h-4 w-4 items-center justify-center rounded-full',
                    getChildStepIconClass(child.status),
                  ]"
                >
                  <slot :name="`child-icon-${index}-${childIndex}`" :child="child" :parent-index="index" :child-index="childIndex">
                    <Icon v-if="child.icon" :name="child.icon" :size="12" :color="getIconColor(child.status)" />
                  </slot>
                </div>
                <div>
                  <h4 :class="['text-sm font-medium', getStepTitleClass(child.status)]">
                    {{ child.title }}
                  </h4>
                  <p v-if="child.description" class="text-xs text-gray-600">
                    {{ child.description }}
                  </p>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";

export type StepperStatus = "completed" | "current" | "pending";

export interface StepperStep {
  title: string;
  description?: string;
  status?: StepperStatus;
  icon?: string; // 預設圖標名稱（如果沒有使用 slot）
  expanded?: boolean; // 是否展開（accordion 模式）
  children?: StepperStep[]; // 子步驟（accordion 模式）
  [key: string]: any; // 允許其他屬性
}

const props = withDefaults(
  defineProps<{
    steps: StepperStep[];
    accordionMode?: boolean; // 是否啟用手風琴模式
  }>(),
  {
    steps: () => [],
    accordionMode: false,
  }
);

const emit = defineEmits<{
  "step-toggle": [index: number, expanded: boolean];
}>();

// 內部展開狀態管理
const expandedSteps = ref<Set<number>>(new Set());

// 切換步驟展開/收合
const toggleStep = (index: number) => {
  const step = props.steps[index];
  const isExpanded = expandedSteps.value.has(index);
  
  if (isExpanded) {
    expandedSteps.value.delete(index);
  } else {
    expandedSteps.value.add(index);
  }
  
  // 更新 step 的 expanded 狀態（如果 step 是響應式的）
  if (step) {
    step.expanded = !isExpanded;
  }
  
  emit("step-toggle", index, !isExpanded);
};

// 檢查步驟是否展開
const isStepExpanded = (index: number): boolean => {
  return expandedSteps.value.has(index) || props.steps[index]?.expanded === true;
};

// 根據狀態獲取圖標容器的 class
const getStepIconClass = (status?: StepperStatus): string => {
  switch (status) {
    case "completed":
      return "text-green-700 bg-green-100";
    case "current":
      return "text-primary-700 bg-primary-100";
    case "pending":
    default:
      return "bg-gray-200 text-gray-600";
  }
};

// 根據狀態獲取標題的 class
const getStepTitleClass = (status?: StepperStatus): string => {
  switch (status) {
    case "completed":
      return "text-gray-900";
    case "current":
      return "text-primary-700";
    case "pending":
    default:
      return "text-gray-600";
  }
};

// 根據狀態獲取圖標顏色
const getIconColor = (status?: StepperStatus): string => {
  switch (status) {
    case "completed":
      return "#15803d"; // green-700
    case "current":
      return "#1c64f2"; // primary-700
    case "pending":
    default:
      return "#4b5563"; // gray-600
  }
};

// 根據狀態獲取子步驟圖標容器的 class
const getChildStepIconClass = (status?: StepperStatus): string => {
  switch (status) {
    case "completed":
      return "bg-primary-500";
    case "current":
      return "bg-primary-500";
    case "pending":
    default:
      return "bg-gray-300";
  }
};
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white">
    <div :style="gridTemplateStyle" class="grid items-center border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
      <div v-for="column in columns" :key="column.key" class="px-4">
        <span v-if="column.label">{{ column.label }}</span>
        <span v-else class="block h-[54px]"></span>
      </div>
    </div>
    <div class="relative">
      <div v-for="(stage, index) in progressStages" :key="`${stage.name}-${index}`" class="relative">
        <div :style="gridTemplateStyle" class="grid h-20 items-center">
          <div class="relative flex h-full items-center justify-center">
            <div
              v-if="index > 0"
              class="pointer-events-none absolute left-1/2 top-0 z-0 h-[calc(50%-16px)] w-[2px] -translate-x-1/2 bg-gray-300"
            ></div>
            <div
              v-if="index < progressStages.length - 1"
              class="pointer-events-none absolute left-1/2 bottom-0 z-0 h-[calc(50%-16px)] w-[2px] -translate-x-1/2 bg-gray-300"
            ></div>
            <div class="absolute left-1/2 top-1/2 z-[5] h-[32px] w-[32px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
            <Icon class="relative z-10" :name="getStageIcon(stage.status)" :size="32" />
          </div>
          <div class="px-4 text-base font-medium text-gray-900">
            {{ stage.name }}
          </div>
          <div class="px-4">
            <Badge :variant="getStatusBadgeVariant(stage.status)" :text="stage.statusText" />
          </div>
          <div class="px-4 text-base text-gray-500">{{ stage.reviewDate }}</div>
          <div class="px-4 text-base text-gray-500">{{ stage.reviewTime }}</div>
          <div class="px-4 flex items-center justify-between">
            <button v-if="stage.hasDetails" class="text-base text-primary-600 hover:text-primary-700" @click.stop="handleViewDetails(index)">查看詳細資料</button>
            <button class="flex items-center justify-center" @click.stop="toggleStageExpand(index)">
              <Icon :name="stage.isExpanded ? 'chevronUp' : 'chevronDown'" :size="24" color="#1A56DB" />
            </button>
          </div>
        </div>
        <div v-if="stage.isExpanded && stage.subStages && stage.subStages.length > 0" class="bg-blue-50 py-6">
          <div :style="gridTemplateStyle" class="grid">
            <div class="relative h-full">
              <div
                v-if="index !== progressStages.length - 1"
                class="pointer-events-none absolute left-1/2 -top-6 -bottom-6 w-[2px] -translate-x-1/2 bg-gray-300"
              ></div>
            </div>
            <div class="col-start-3 col-end-6 pl-10">
              <Stepper :steps="stage.subStages" variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Stepper from "@/components/atoms/Stepper.vue";
import type { ProgressStage } from "@/types/backend/caseManagement/common/CaseDetailView.d";
type ColumnConfig = {
  key: string;
  label: string;
  width: number;
};
const props = defineProps<{
  progressStages: ProgressStage[];
  columns: ColumnConfig[];
  getStageIcon: (status: ProgressStage["status"]) => string;
  getStatusBadgeVariant: (status: ProgressStage["status"]) => "success" | "primary" | "gray";
  toggleStageExpand: (index: number) => void;
  handleViewDetails: (index: number) => void;
}>();
const gridTemplateStyle = computed(() => {
  return {
    gridTemplateColumns: props.columns.map((column) => `${column.width}fr`).join(" "),
  };
});
</script>

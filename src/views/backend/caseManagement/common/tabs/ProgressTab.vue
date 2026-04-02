<template>
  <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <div class="h-7 w-1 rounded bg-primary-600"></div>
        <h2 class="text-2xl font-medium leading-6 text-gray-900">案件各階段進度</h2>
      </div>
      <ButtonCTA v-if="isAdminUser" variant="outline" size="xs" left-icon="editOutline" class="!h-9 !min-w-[96px] px-3 py-2 text-sm" @click="handleOpenEditStageDrawer">
        編輯階段
      </ButtonCTA>
    </div>
    <CaseProgressTable
      :columns="stageColumns"
      :progress-stages="progressStages"
      :get-stage-icon="getStageIcon"
      :get-status-badge-variant="getStatusBadgeVariant"
      :toggle-stage-expand="toggleStageExpand"
      :handle-view-details="handleViewDetails"
    />
  </div>
  <Drawer v-model="showEditStageDrawer" title="編輯案件階段" width="xl">
    <template #default>
      <div class="flex flex-col">
        <VueDraggable
          v-model="editStageItems"
          item-key="id"
          v-bind="editStageDragOptions"
        >
          <div
            v-for="(item, index) in editStageItems"
            :key="item.id"
            class="flex items-center gap-5 border-b border-gray-300 py-5"
          >
            <div class="flex flex-1 items-center gap-3">
              <button type="button" :class="[dragHandleClass, 'cursor-grab text-gray-500 active:cursor-grabbing']" aria-label="拖拉排序">
                <Icon name="barsOutline" :size="24" class="text-gray-500" />
              </button>
              <span class="text-base text-gray-500">{{ index + 1 }}</span>
              <span class="text-lg text-gray-900">{{ item.label }}</span>
            </div>
            <button
              v-if="item.deletable"
              class="px-3 py-4 text-base text-primary-600"
              @click="handleOpenRemoveStage(item)"
            >
              移除
            </button>
          </div>
        </VueDraggable>
        <div class="pt-6">
          <ButtonCTA variant="outline" size="xl" left-icon="plus" class="w-full" @click="handleAddCaseStage"> 新增案件階段 </ButtonCTA>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="showEditStageDrawer = false">取消</ButtonCTA>
        <ButtonCTA :variant="stageUnsavedCheck.hasUnsavedChanges.value ? 'primary' : 'gray'" size="xl" class="w-[124px]" :disabled="!stageUnsavedCheck.hasUnsavedChanges.value" @click="handleSaveEditStage">儲存</ButtonCTA>
      </div>
    </template>
  </Drawer>
  <ConfirmDeleteModal
    v-model="showRemoveStageModal"
    message="確認刪除此案件階段"
    description="內容將完全刪除無法復原"
    confirm-label="刪除"
    cancel-label="取消"
    @confirm="handleConfirmRemoveStage"
    @cancel="handleCancelRemoveStage"
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { VueDraggable } from "vue-draggable-plus";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { loadStoredCaseStageItems, saveStoredCaseStageItems, type CaseStageItem } from "@/utils/caseStageItems";
import { createVerticalListDragOptions, DRAG_HANDLE_CLASS } from "@/utils/draggable";
import type { StepperStep } from "@/components/atoms/Stepper.vue";
import type { ProgressStage } from "@/types/backend/caseManagement/common/CaseDetailView.d";
import Icon from "@/components/atoms/Icon.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import CaseProgressTable from "@/components/molecules/CaseProgressTable.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
type BaseStage = Omit<ProgressStage, "subStages">;
type StageStatus = ProgressStage["status"];
const props = defineProps<{
  isAdminUser: boolean;
  /** 該案件的幹事名單（用於新增案件階段時帶入參與幹事） */
  caseOfficerNames?: string;
}>();
const router = useRouter();
const route = useRoute();
const editStageItems = ref<CaseStageItem[]>([]);
const progressStages = ref<ProgressStage[]>([]);
const showEditStageDrawer = ref(false);
const stageUnsavedCheck = useFormUnsavedCheck(() => buildEditStageSnapshot());
const showRemoveStageModal = ref(false);
const stageToRemoveId = ref<number | null>(null);
const dragHandleClass = DRAG_HANDLE_CLASS;
const editStageDragOptions = createVerticalListDragOptions(dragHandleClass);
const baseStages: BaseStage[] = [
  {
    name: "最終核定",
    status: "pending",
    statusText: "未開始",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: true,
    isExpanded: false,
  },
  {
    name: "都更大會",
    status: "current",
    statusText: "進行中",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: true,
    isExpanded: true,
  },
  {
    name: "專案小組",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: true,
    isExpanded: false,
  },
  {
    name: "公辦公聽會",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: true,
    isExpanded: false,
  },
  {
    name: "都更幹事會",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: true,
    isExpanded: false,
  },
  {
    name: "案件申請",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: true,
    isExpanded: false,
  },
];
const subStageTitles = ["階段開放", "審核中", "召開會議", "函發會議記錄", "已完成"];
const STORAGE_KEY = "caseStageStatusOverrides";
const stageColumns = [
  { key: "icon", label: "", width: 120 },
  { key: "stageName", label: "案件階段", width: 126 },
  { key: "status", label: "階段狀態", width: 286 },
  { key: "reviewDate", label: "審議日期", width: 118 },
  { key: "reviewTime", label: "審議時間", width: 150 },
  { key: "action", label: "操作", width: 184 },
];
const buildSubStages = (status: ProgressStage["status"]): StepperStep[] => {
  if (status === "completed") {
    return subStageTitles.map((title) => ({
      title,
      status: "completed",
      icon: "stepCheck",
    }));
  }
  if (status === "current") {
    return subStageTitles.map((title, index) => ({
      title,
      status: index === 0 ? "completed" : index === 1 ? "current" : "pending",
      icon: index === 0 ? "stepCheck" : "setpUncheck",
    }));
  }
  return subStageTitles.map((title) => ({
    title,
    status: "pending",
    icon: "setpUncheck",
  }));
};
const buildEditStageSnapshot = () => JSON.stringify(editStageItems.value.map((item) => ({ id: item.id, label: item.label.trim() })));
const getStageCaseType = () => {
  const caseType = route.query?.caseType;
  if (typeof caseType === "string") return caseType;
  if (Array.isArray(caseType)) return caseType[0] || undefined;
  return undefined;
};
const syncEditStageItems = () => {
  editStageItems.value = loadStoredCaseStageItems(getStageCaseType());
};
const handleOpenEditStageDrawer = () => {
  syncEditStageItems();
  stageUnsavedCheck.captureInitial();
  showEditStageDrawer.value = true;
};
const handleOpenRemoveStage = (item: CaseStageItem) => {
  stageToRemoveId.value = item.id;
  showRemoveStageModal.value = true;
};
const handleConfirmRemoveStage = () => {
  if (stageToRemoveId.value !== null) {
    editStageItems.value = editStageItems.value.filter((item) => item.id !== stageToRemoveId.value);
  }
  showRemoveStageModal.value = false;
  stageToRemoveId.value = null;
};
const handleCancelRemoveStage = () => {
  showRemoveStageModal.value = false;
  stageToRemoveId.value = null;
};
const handleSaveEditStage = () => {
  saveStoredCaseStageItems(editStageItems.value, getStageCaseType());
  stageUnsavedCheck.captureInitial();
  showEditStageDrawer.value = false;
};
const getStageIcon = (status: ProgressStage["status"]) => {
  if (status === "completed") return "stepCheck";
  if (status === "current") return "setpUncheck";
  return "stepUncheckGray";
};
const getStatusBadgeVariant = (status: ProgressStage["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "current":
      return "primary";
    case "pending":
    default:
      return "gray";
  }
};
const toggleStageExpand = (index: number) => {
  progressStages.value[index].isExpanded = !progressStages.value[index].isExpanded;
};
const loadStageOverrides = (): Record<string, { status: string }> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, { status: string }>;
  } catch {
    return {};
  }
};
const mapOverrideStatus = (
  status: string
): {
  status: StageStatus;
  statusText: string;
  subStageStatus: StageStatus;
} => {
  if (status === "completed") {
    return { status: "completed" as const, statusText: "已完成", subStageStatus: "completed" as const };
  }
  if (status === "in-progress") {
    return { status: "current" as const, statusText: "進行中", subStageStatus: "current" as const };
  }
  if (status === "withdrawn") {
    return { status: "pending" as const, statusText: "已撤案", subStageStatus: "pending" as const };
  }
  if (status === "terminated") {
    return { status: "pending" as const, statusText: "案件廢止", subStageStatus: "pending" as const };
  }
  return { status: "pending", statusText: "未開始", subStageStatus: "pending" };
};
const buildProgressStages = () => {
  const overrides = loadStageOverrides();
  progressStages.value = baseStages.map((stage) => {
    const override = overrides[stage.name];
    const mapped = override
      ? mapOverrideStatus(override.status)
      : {
          status: stage.status,
          statusText: stage.statusText,
          subStageStatus: stage.status,
        };
    return {
      ...stage,
      status: mapped.status,
      statusText: mapped.statusText,
      subStages: buildSubStages(mapped.subStageStatus),
    };
  });
};
const handleViewDetails = (index: number) => {
  const stageName = progressStages.value[index]?.name || "";
  router.push({
    path: "/case-stage-detail",
    query: {
      stage: stageName,
      from: (route.query?.from as string | undefined) || route.path,
      admin: props.isAdminUser ? "true" : undefined,
    },
  });
};
const handleAddCaseStage = () => {
  showEditStageDrawer.value = false;
  const query: Record<string, string | undefined> = {
    from: (route.query?.from as string | undefined) || route.path,
    admin: props.isAdminUser ? "true" : undefined,
    caseType: route.query?.caseType as string | undefined,
  };
  if (props.caseOfficerNames) {
    query.officers = encodeURIComponent(props.caseOfficerNames);
  }
  router.push({ path: "/add-case-stage", query });
};
onMounted(() => {
  syncEditStageItems();
  buildProgressStages();
  stageUnsavedCheck.captureInitial();
});
</script>

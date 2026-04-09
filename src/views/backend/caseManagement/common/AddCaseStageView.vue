<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <button
          type="button"
          class="flex w-full max-w-[501px] items-center gap-4 text-left"
          aria-label="返回前一頁"
          @click="handleGoBack"
        >
          <Icon name="arrowLeftOutline" class="h-6 w-6 shrink-0 text-gray-900" aria-hidden="true" />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">前一頁</h1>
        </button>
      </div>

      <!-- 新增案件階段表單 -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex gap-3">
          <div class="h-7 w-1 shrink-0 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">新增案件階段</h2>
        </div>
        <div class="grid w-full max-w-[744px] grid-cols-[repeat(2,364px)] gap-4">
          <div class="w-[364px]">
            <InputDropdown
              label="新增階段"
              required
              placeholder="請選擇"
              :button-text="form.stage"
              :items="stageOptions"
              container-class="w-full"
              @item-click="(item) => (form.stage = item.label)"
            />
          </div>
          <template v-for="field in selectedStageFields" :key="field.key">
            <div :class="field.fullWidth ? 'col-span-2 w-[744px]' : 'w-[364px]'">
              <DatePicker
                v-if="field.type === 'date'"
                :model-value="getDateFieldValue(field.key)"
                @update:modelValue="setDateFieldValue(field.key, $event)"
                :label="field.label"
                :required="field.required"
                placeholder="選擇日期"
                container-class="w-full"
              />
              <TimePicker
                v-else-if="field.type === 'time'"
                :model-value="getStringFieldValue(field.key)"
                @update:modelValue="setStringFieldValue(field.key, $event)"
                :label="field.label"
                :required="field.required"
                size="lg"
                min="09:00"
                max="18:00"
                container-class="w-full"
              />
              <Input
                v-else-if="field.key !== 'participants'"
                :model-value="getStringFieldValue(field.key)"
                @update:modelValue="setStringFieldValue(field.key, $event)"
                :label="field.label"
                :required="field.required"
                :placeholder="field.placeholder || ''"
                size="lg"
                container-class="w-full"
                :disabled="field.disabled"
              />
              <div v-else class="flex items-end gap-4">
                <Input
                  :model-value="getStringFieldValue(field.key)"
                  @update:modelValue="setStringFieldValue(field.key, $event)"
                  :label="field.label"
                  :required="field.required"
                  :placeholder="field.placeholder || ''"
                  size="lg"
                  container-class="w-[704px]"
                  :disabled="field.disabled"
                />
                <button
                  type="button"
                  class="flex h-[52px] w-6 items-center justify-center pb-0.5 text-primary-600"
                  aria-label="編輯參與幹事"
                  @click="handleEditParticipants"
                >
                  <Icon name="editOutline" :size="24" class="text-primary-600" />
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 階段審查檔案 -->
      <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex gap-3">
          <div class="h-7 w-1 shrink-0 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">階段審查檔案</h2>
        </div>
        <div class="flex flex-col items-center gap-6 py-6">
          <Empty
            type="case-management"
            message="尚無申請人端審查檔案相關項目"
            :show-button="true"
            button-text="新增項目"
            @button-click="handleAddReviewItem"
          />
        </div>
      </div>

      <!-- 底部按鈕 -->
      <div class="flex items-center justify-center gap-4">
        <ButtonCTA variant="outline" size="xl" @click="handleCancel">取消</ButtonCTA>
        <ButtonCTA variant="primary" size="xl" :disabled="isSubmitDisabled" @click="handleSubmit">新增</ButtonCTA>
      </div>
    </div>

    <UnsavedChangesModal
      :model-value="unsavedDialog.showUnsavedChangesModal.value"
      @update:modelValue="(value) => (unsavedDialog.showUnsavedChangesModal.value = value)"
      message="尚未完成新增，確定離開？
未儲存內容將遺失。"
      confirm-label="儲存"
      confirm-variant="red"
      :confirm-disabled="isSubmitDisabled"
      @exit="handleExitWithoutSaving"
      @confirm="handleSaveFromUnsavedModal"
    />
    <Drawer v-model="showParticipantsDrawer" title="編輯幹事名單" width="xl" close-action="emit" @close="handleParticipantsDrawerClose">
      <template #default>
        <div class="flex flex-col gap-0">
          <div
            v-for="(officer, index) in participantEditors"
            :key="index"
            class="flex items-center justify-between border-b border-gray-300 py-5"
          >
            <div class="flex flex-1 items-center gap-2">
              <div class="flex w-5 items-center justify-center">
                <span class="text-base font-normal leading-[1.25] text-gray-500">{{ index + 1 }}</span>
              </div>
              <InputDropdown
                :button-text="officer.selectedOfficer || ''"
                placeholder="選擇"
                :items="getAvailableParticipantsForIndex(index)"
                :show-label="false"
                @item-click="(item) => handleParticipantSelect(index, item)"
              />
            </div>
            <div class="flex items-center px-3 py-4">
              <ButtonCTA variant="textPlain" size="base" class="p-0" @click="handleRemoveParticipant(index)">移除</ButtonCTA>
            </div>
          </div>
          <div class="flex items-center justify-start border-b border-gray-300 py-5">
            <ButtonCTA variant="outline" size="xl" class="w-full" left-icon="plus" @click="handleAddParticipant">新增幹事</ButtonCTA>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-4">
          <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelParticipantsEdit">取消</ButtonCTA>
          <ButtonCTA
            :variant="canSaveParticipants ? 'primary' : 'gray'"
            size="xl"
            class="w-[124px]"
            :disabled="!canSaveParticipants"
            @click="handleSaveParticipantsEdit"
          >
            儲存
          </ButtonCTA>
        </div>
      </template>
    </Drawer>
    <UnsavedChangesModal
      :model-value="participantsUnsavedDialog.showUnsavedChangesModal.value"
      @update:modelValue="(value) => (participantsUnsavedDialog.showUnsavedChangesModal.value = value)"
      @exit="handleExitParticipantsWithoutSaving"
      @confirm="handleSaveFromParticipantsUnsavedModal"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import { apiGetOfficerList } from "@/api/backend/systemManagement/officerService";
import { appendStoredCaseStageItem } from "@/utils/caseStageItems";
import { getAddCaseStageBreadcrumbItems } from "@/utils/breadcrumbs";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Empty from "@/components/atoms/Empty.vue";
import TimePicker from "@/components/atoms/TimePicker.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import type { OfficerApiItem } from "@/types/api/backend/systemManagement/officerService";
type StageFieldType = "text" | "date" | "time";
type StageFieldKey =
  | "applyDate"
  | "selfHearingDate"
  | "selfHearingTime"
  | "supplementRequestDate"
  | "newspaperDate"
  | "publicDisplayStartDate"
  | "publicDisplayEndDate"
  | "meetingDate"
  | "meetingTime"
  | "meetingPlace"
  | "participants"
  | "siteVisitTime"
  | "revisionSubmissionDate"
  | "approvalDate";
type StageFieldConfig = {
  key: StageFieldKey;
  label: string;
  type: StageFieldType;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
};
type StageConfig = {
  value: string;
  label: string;
  fields: StageFieldConfig[];
};
type ParticipantEditorItem = {
  selectedOfficer: string;
};
const route = useRoute();
const router = useRouter();
const breadcrumbItems = computed(() => getAddCaseStageBreadcrumbItems(route));
const unsavedDialog = useUnsavedChangesDialog();
const participantsUnsavedDialog = useUnsavedChangesDialog();
const skipNextLeaveCheck = ref(false);
const showParticipantsDrawer = ref(false);
const participantEditors = ref<ParticipantEditorItem[]>([]);
const availableOfficerNames = ref<string[]>([]);
const form = ref({
  stage: "",
  applyDate: null as Date | null,
  selfHearingDate: null as Date | null,
  selfHearingTime: "",
  supplementRequestDate: null as Date | null,
  newspaperDate: null as Date | null,
  publicDisplayStartDate: null as Date | null,
  publicDisplayEndDate: null as Date | null,
  meetingDate: null as Date | null,
  meetingTime: "",
  meetingPlace: "",
  siteVisitTime: "",
  revisionSubmissionDate: null as Date | null,
  approvalDate: null as Date | null,
  participants: "",
});
const stageConfigs: StageConfig[] = [
  {
    value: "案件申請",
    label: "案件申請",
    fields: [
      { key: "applyDate", label: "報核日期", type: "date", required: true },
      { key: "selfHearingDate", label: "自辦公聽會日期", type: "date" },
      { key: "selfHearingTime", label: "自辦公聽會時間", type: "time" },
      { key: "supplementRequestDate", label: "函請補正日期", type: "date" },
    ],
  },
  {
    value: "都更幹事會",
    label: "都更幹事會",
    fields: [
      { key: "meetingDate", label: "會議日期", type: "date", required: true },
      { key: "meetingTime", label: "會議時間", type: "time", required: true },
      { key: "meetingPlace", label: "會議地點", type: "text", placeholder: "請輸入會議地點" },
      { key: "participants", label: "參與幹事", type: "text", fullWidth: true, disabled: true, placeholder: "請輸入參與幹事" },
    ],
  },
  {
    value: "公辦公聽會",
    label: "公辦公聽會",
    fields: [
      { key: "newspaperDate", label: "登報日期", type: "date" },
      { key: "publicDisplayStartDate", label: "公開展覽起始日", type: "date" },
      { key: "publicDisplayEndDate", label: "公開展覽結束日", type: "date" },
      { key: "meetingDate", label: "會議日期", type: "date" },
      { key: "meetingTime", label: "會議時間", type: "time" },
      { key: "meetingPlace", label: "會議地點", type: "text", placeholder: "請輸入會議地點" },
      { key: "participants", label: "參與幹事", type: "text", required: true, fullWidth: true, disabled: true, placeholder: "請輸入參與幹事" },
    ],
  },
  {
    value: "專案小組",
    label: "專案小組",
    fields: [
      { key: "meetingDate", label: "會議日期", type: "date", required: true },
      { key: "meetingTime", label: "會議時間", type: "time", required: true },
      { key: "meetingPlace", label: "會議地點", type: "text", placeholder: "請輸入會議地點" },
      { key: "participants", label: "參與幹事", type: "text", fullWidth: true, disabled: true, placeholder: "請輸入參與幹事" },
    ],
  },
  {
    value: "都更大會",
    label: "都更大會",
    fields: [
      { key: "siteVisitTime", label: "現勘時間", type: "time" },
      { key: "meetingDate", label: "會議日期", type: "date", required: true },
      { key: "meetingTime", label: "會議時間", type: "time", required: true },
      { key: "meetingPlace", label: "會議地點", type: "text", placeholder: "請輸入會議地點" },
      { key: "participants", label: "參與幹事", type: "text", fullWidth: true, disabled: true, placeholder: "請輸入參與幹事" },
    ],
  },
  {
    value: "最終核定",
    label: "最終核定",
    fields: [
      { key: "revisionSubmissionDate", label: "檢送修正時間（日期）", type: "date" },
      { key: "approvalDate", label: "核定日期", type: "date", required: true },
    ],
  },
];
const stageOptions = stageConfigs.map((item) => ({ label: item.label, value: item.value }));
/** 使用者已從彈窗選擇離開，略過下一次 onBeforeRouteLeave 的攔截，避免點一次退出卻彈兩次 */
const isSubmitDisabled = computed(() => !form.value.stage?.trim());
const selectedStageFields = computed(() => stageConfigs.find((item) => item.value === form.value.stage)?.fields || []);
const stageFormUnsavedCheck = useFormUnsavedCheck(() => buildFormSnapshot());
const participantsUnsavedCheck = useFormUnsavedCheck(() => buildParticipantsSnapshot());
const participantOptions = computed<InputDropdownItem[]>(() => {
  return availableOfficerNames.value.map((name) => ({ label: name, value: name }));
});
const canSaveParticipants = computed(() => participantsUnsavedCheck.hasUnsavedChanges.value);
const getDateFieldValue = (key: StageFieldKey) => {
  const value = (form.value as Record<StageFieldKey, string | Date | null>)[key];
  return value instanceof Date || value === null ? value : null;
};
const setDateFieldValue = (key: StageFieldKey, value: Date | null) => {
  (form.value as Record<StageFieldKey, string | Date | null>)[key] = value;
};
const getStringFieldValue = (key: StageFieldKey) => {
  const value = (form.value as Record<StageFieldKey, string | Date | null>)[key];
  return typeof value === "string" ? value : "";
};
const setStringFieldValue = (key: StageFieldKey, value: string) => {
  (form.value as Record<StageFieldKey, string | Date | null>)[key] = value;
};
const buildFormSnapshot = () => {
  return JSON.stringify({
    stage: form.value.stage,
    applyDate: form.value.applyDate,
    selfHearingDate: form.value.selfHearingDate,
    selfHearingTime: form.value.selfHearingTime,
    supplementRequestDate: form.value.supplementRequestDate,
    newspaperDate: form.value.newspaperDate,
    publicDisplayStartDate: form.value.publicDisplayStartDate,
    publicDisplayEndDate: form.value.publicDisplayEndDate,
    meetingDate: form.value.meetingDate,
    meetingTime: form.value.meetingTime,
    meetingPlace: form.value.meetingPlace,
    siteVisitTime: form.value.siteVisitTime,
    revisionSubmissionDate: form.value.revisionSubmissionDate,
    approvalDate: form.value.approvalDate,
    participants: form.value.participants,
  });
}
const buildParticipantsSnapshot = () => {
  return JSON.stringify(normalizeParticipantEditors(participantEditors.value));
};
const getTodayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const getCurrentTimeString = () => {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}
const goToProgress = () => {
  router.push({
    path: "/case-detail",
    query: {
      from: route.query?.from,
      admin: route.query?.admin,
      caseType: route.query?.caseType,
      tab: "progress",
    },
  });
};
const getStageCaseType = () => {
  const caseType = route.query?.caseType;
  if (typeof caseType === "string") return caseType;
  if (Array.isArray(caseType)) return caseType[0] || undefined;
  return undefined;
};
const handleSidebarItemSelect = (_itemName: string) => {};
const handleGoBack = () => {
  unsavedDialog.requestUnsavedConfirmation(stageFormUnsavedCheck.hasUnsavedChanges.value, goToProgress);
};
const handleCancel = () => {
  unsavedDialog.requestUnsavedConfirmation(stageFormUnsavedCheck.hasUnsavedChanges.value, goToProgress);
};
const handleExitWithoutSaving = () => {
  skipNextLeaveCheck.value = true;
  unsavedDialog.runPendingAction();
};
const handleSaveFromUnsavedModal = () => {
  const fn = unsavedDialog.takePendingAction();
  unsavedDialog.closeUnsavedChangesModal();
  stageFormUnsavedCheck.captureInitial();
  skipNextLeaveCheck.value = true;
  fn?.();
};
const handleSubmit = () => {
  if (form.value.stage.trim()) {
    appendStoredCaseStageItem(form.value.stage.trim(), getStageCaseType());
  }
  stageFormUnsavedCheck.captureInitial();
  goToProgress();
};
const handleAddReviewItem = () => {
  // TODO: 開啟新增審查項目 Drawer 或導向對應流程
};
const handleEditParticipants = () => {
  syncParticipantEditors();
  showParticipantsDrawer.value = true;
  nextTick(() => {
    participantsUnsavedCheck.captureInitial();
  });
};
const handleParticipantSelect = (index: number, item: InputDropdownItem) => {
  participantEditors.value[index].selectedOfficer = item.label;
};
const handleRemoveParticipant = (index: number) => {
  participantEditors.value.splice(index, 1);
};
const handleAddParticipant = () => {
  participantEditors.value.push({ selectedOfficer: "" });
};
const parseOfficerNames = (value: string) => {
  return value
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
};
const normalizeParticipantEditors = (items: ParticipantEditorItem[]) => {
  return items
    .map((item) => item.selectedOfficer.trim())
    .filter(Boolean);
};
const mapOfficerNames = (items: OfficerApiItem[]) => {
  return items
    .map((item) => item.name?.trim() || "")
    .filter(Boolean);
};
const closeParticipantsDrawer = () => {
  showParticipantsDrawer.value = false;
  syncParticipantEditors();
};
const applyParticipantsSelection = () => {
  form.value.participants = normalizeParticipantEditors(participantEditors.value).join("、");
};
const handleParticipantsDrawerClose = () => {
  participantsUnsavedDialog.requestUnsavedConfirmation(participantsUnsavedCheck.hasUnsavedChanges.value, closeParticipantsDrawer);
};
const handleCancelParticipantsEdit = () => {
  handleParticipantsDrawerClose();
};
const handleExitParticipantsWithoutSaving = () => {
  participantsUnsavedDialog.runPendingAction();
};
const handleSaveParticipantsEdit = () => {
  applyParticipantsSelection();
  participantsUnsavedCheck.captureInitial();
  showParticipantsDrawer.value = false;
};
const handleSaveFromParticipantsUnsavedModal = () => {
  const action = participantsUnsavedDialog.takePendingAction();
  participantsUnsavedDialog.closeUnsavedChangesModal();
  applyParticipantsSelection();
  participantsUnsavedCheck.captureInitial();
  action?.();
};
const getAvailableParticipantsForIndex = (index: number) => {
  const selectedNames = participantEditors.value
    .map((item, itemIndex) => (itemIndex === index ? "" : item.selectedOfficer.trim()))
    .filter(Boolean);
  return participantOptions.value.filter((item) => !selectedNames.includes(item.label));
};
const syncParticipantEditors = () => {
  const currentNames = parseOfficerNames(form.value.participants);
  participantEditors.value = currentNames.length
    ? currentNames.map((name) => ({ selectedOfficer: name }))
    : [{ selectedOfficer: "" }];
};
const getInitialParticipants = () => {
  const officers = route.query?.officers;
  if (!officers) return "";

  const value = Array.isArray(officers) ? officers[0] : officers;
  if (!value || typeof value !== "string") return "";

  try {
    return parseOfficerNames(decodeURIComponent(value)).join("、");
  } catch {
    return parseOfficerNames(value).join("、");
  }
};
const initializeAvailableOfficers = async () => {
  try {
    const response = await apiGetOfficerList();
    const officers = mapOfficerNames(Array.isArray(response.data.data) ? response.data.data : []);
    if (officers.length) {
      availableOfficerNames.value = officers;
      return;
    }
  } catch {}

  availableOfficerNames.value = ["張源明", "林珮君", "郭依佳", "朱秀秋", "曾彰豪"];
};
onBeforeRouteLeave((_to, _from, next) => {
  if (skipNextLeaveCheck.value) {
    skipNextLeaveCheck.value = false;
    next();
    return;
  }
  if (!stageFormUnsavedCheck.hasUnsavedChanges.value) {
    next();
    return;
  }
  unsavedDialog.requestUnsavedConfirmation(true, () => next());
});
onMounted(async () => {
  form.value.meetingDate = new Date(getTodayString());
  form.value.meetingTime = getCurrentTimeString();
  await initializeAvailableOfficers();
  form.value.participants = getInitialParticipants();
  syncParticipantEditors();
  nextTick(() => {
    stageFormUnsavedCheck.captureInitial();
  });
});
</script>

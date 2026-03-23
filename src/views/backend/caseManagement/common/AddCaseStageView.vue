<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
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
          <div class="w-[364px]">
            <DatePicker
              v-model="form.meetingDate"
              label="會議日期"
              required
              placeholder="選擇日期"
              container-class="w-full"
            />
          </div>
          <div class="w-[364px]">
            <TimePicker
              v-model="form.meetingTime"
              label="會議時間"
              required
              size="lg"
              min="09:00"
              max="18:00"
              container-class="w-full"
            />
          </div>
          <div class="w-[364px]">
            <Input
              v-model="form.meetingPlace"
              label="會議地點"
              placeholder="請輸入會議地點"
              size="lg"
              container-class="w-full"
            />
          </div>
          <div class="col-span-2 w-[744px]">
            <Input
              v-model="form.participants"
              label="參與幹事"
              required
              placeholder="請輸入參與幹事"
              size="lg"
              container-class="w-full"
              disabled
            />
          </div>
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
      confirm-label="儲存"
      confirm-variant="red"
      :confirm-disabled="isSubmitDisabled"
      @exit="handleExitWithoutSaving"
      @confirm="handleSaveFromUnsavedModal"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Empty from "@/components/atoms/Empty.vue";
import TimePicker from "@/components/atoms/TimePicker.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown from "@/components/atoms/InputDropdown.vue";
const route = useRoute();
const router = useRouter();
const unsavedDialog = useUnsavedChangesDialog();
const skipNextLeaveCheck = ref(false);
const form = ref({
  stage: "",
  meetingDate: "",
  meetingTime: "",
  meetingPlace: "",
  participants: "",
});
const stageOptions = [
  { label: "都更幹事2", value: "officer2" },
  { label: "都更幹事會", value: "officer-meeting" },
  { label: "都更大會", value: "general-meeting" },
  { label: "公辦公聽會", value: "public-hearing" },
  { label: "專案小組", value: "project-team" },
];
/** 使用者已從彈窗選擇離開，略過下一次 onBeforeRouteLeave 的攔截，避免點一次退出卻彈兩次 */
const isSubmitDisabled = computed(() => !form.value.stage?.trim());
const stageFormUnsavedCheck = useFormUnsavedCheck(() => buildFormSnapshot());
const buildFormSnapshot = () => {
  return JSON.stringify({
    stage: form.value.stage,
    meetingDate: form.value.meetingDate,
    meetingTime: form.value.meetingTime,
    meetingPlace: form.value.meetingPlace,
    participants: form.value.participants,
  });
}
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
  // TODO: 送出表單後導回案件進度
  stageFormUnsavedCheck.captureInitial();
  goToProgress();
};
const handleAddReviewItem = () => {
  // TODO: 開啟新增審查項目 Drawer 或導向對應流程
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
onMounted(() => {
  form.value.meetingDate = getTodayString();
  form.value.meetingTime = getCurrentTimeString();
  const officers = route.query?.officers;
  if (officers) {
    const str = Array.isArray(officers) ? officers[0] : officers;
    if (str && typeof str === "string") {
      try {
        form.value.participants = decodeURIComponent(str);
      } catch {
        form.value.participants = str;
      }
    }
  }
  nextTick(() => {
    stageFormUnsavedCheck.captureInitial();
  });
});
</script>

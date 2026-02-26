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
        <div class="flex flex-wrap gap-4">
          <div class="w-full min-w-0 max-w-[364px]">
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
          <div class="w-full min-w-0 max-w-[364px]">
            <DatePicker
              v-model="form.meetingDate"
              label="會議日期"
              required
              placeholder="選擇日期"
              container-class="w-full"
            />
          </div>
          <div class="w-full min-w-0 max-w-[364px]">
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
          <div class="w-full min-w-0 max-w-[364px]">
            <Input
              v-model="form.meetingPlace"
              label="會議地點"
              placeholder="請輸入會議地點"
              size="lg"
              container-class="w-full"
            />
          </div>
          <div class="w-full min-w-0 max-w-[744px]">
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
            type="search"
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

    <!-- 新增一半就離開：有尚未儲存的修改時詢問 -->
    <Modal
      v-model="showUnsavedChangesModal"
      size="md"
      :static="false"
      :show-close-button="false"
      close-action="emit"
      backdrop-class="bg-gray-600/80"
    >
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pt-4">
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
            aria-label="關閉"
            @click="showUnsavedChangesModal = false"
          >
            <Icon name="close" :size="20" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xl font-medium leading-none text-white">!</div>
          <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">有尚未儲存的修改，離開前是否先儲存</p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA variant="white" size="xs" class="h-8 w-[120px] border-gray-200 px-3 py-2 text-sm font-medium leading-[1.5] text-gray-800" @click="handleExitWithoutSaving">
            退出編輯
          </ButtonCTA>
          <ButtonCTA variant="red" size="xs" class="h-8 w-[120px] px-3 py-2 text-sm font-medium leading-[1.5]" :disabled="isSubmitDisabled" @click="handleSaveFromUnsavedModal">
            儲存
          </ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import Icon from "@/components/atoms/Icon.vue";
import Input from "@/components/atoms/Input.vue";
import Empty from "@/components/atoms/Empty.vue";
import Modal from "@/components/atoms/Modal.vue";
import TimePicker from "@/components/atoms/TimePicker.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown from "@/components/atoms/InputDropdown.vue";

const router = useRouter();
const route = useRoute();

const handleSidebarItemSelect = (_itemName: string) => {};

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

const isSubmitDisabled = computed(() => !form.value.stage?.trim());

const buildFormSnapshot = () =>
  JSON.stringify({
    stage: form.value.stage,
    meetingDate: form.value.meetingDate,
    meetingTime: form.value.meetingTime,
    meetingPlace: form.value.meetingPlace,
    participants: form.value.participants,
  });

const { hasUnsavedChanges, captureInitial } = useFormUnsavedCheck(buildFormSnapshot);
const showUnsavedChangesModal = ref(false);
const pendingLeave = ref<(() => void) | null>(null);
/** 使用者已從彈窗選擇離開，略過下一次 onBeforeRouteLeave 的攔截，避免點一次退出卻彈兩次 */
const skipNextLeaveCheck = ref(false);

const getTodayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getCurrentTimeString = () => {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
};

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

const handleGoBack = () => {
  if (hasUnsavedChanges.value) {
    pendingLeave.value = goToProgress;
    showUnsavedChangesModal.value = true;
  } else {
    goToProgress();
  }
};

const handleCancel = () => {
  if (hasUnsavedChanges.value) {
    pendingLeave.value = goToProgress;
    showUnsavedChangesModal.value = true;
  } else {
    goToProgress();
  }
};

const handleExitWithoutSaving = () => {
  showUnsavedChangesModal.value = false;
  const fn = pendingLeave.value;
  pendingLeave.value = null;
  skipNextLeaveCheck.value = true;
  fn?.();
};

const handleSaveFromUnsavedModal = () => {
  const fn = pendingLeave.value;
  showUnsavedChangesModal.value = false;
  pendingLeave.value = null;
  captureInitial();
  skipNextLeaveCheck.value = true;
  fn?.();
};

onBeforeRouteLeave((_to, _from, next) => {
  if (skipNextLeaveCheck.value) {
    skipNextLeaveCheck.value = false;
    next();
    return;
  }
  if (!hasUnsavedChanges.value) {
    next();
    return;
  }
  pendingLeave.value = () => next();
  showUnsavedChangesModal.value = true;
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
  captureInitial();
});

const handleSubmit = () => {
  // TODO: 送出表單後導回案件進度
  captureInitial();
  goToProgress();
};

const handleAddReviewItem = () => {
  // TODO: 開啟新增審查項目 Drawer 或導向對應流程
};
</script>

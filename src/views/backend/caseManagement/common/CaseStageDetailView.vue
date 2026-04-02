<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection :backdrop-closable="!addItemUnsavedDialog.showUnsavedChangesModal.value" @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center justify-between gap-6">
          <h1 class="max-w-[520px] truncate text-3xl font-bold leading-[30px] text-gray-900">{{ stageTitle }}</h1>
          <ButtonCTA variant="red-outline" size="l" class="!min-w-0">刪除階段</ButtonCTA>
        </div>
      </div>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-10 rounded-lg bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">會議基本資料</h2>
            </div>
            <ButtonCTA variant="outline" size="sm" left-icon="pencil" class="!min-w-0">編輯內容</ButtonCTA>
          </div>
          <div class="grid gap-6 md:grid-cols-3">
            <div class="flex flex-col gap-2 pl-5">
              <p class="text-base font-medium text-gray-500">會議日期</p>
              <p class="text-base text-gray-900">-</p>
            </div>
            <div class="flex flex-col gap-2 pl-5">
              <p class="text-base font-medium text-gray-500">會議時間</p>
              <p class="text-base text-gray-900">-</p>
            </div>
            <div class="flex flex-col gap-2 pl-5">
              <p class="text-base font-medium text-gray-500">會議地點</p>
              <p class="text-base text-gray-900">-</p>
            </div>
          </div>
          <div class="flex flex-col gap-2 pl-5">
            <p class="text-base font-medium text-gray-500">參與幹事</p>
            <p class="text-base text-gray-900">張泓明、梁子瑞、蕭玉軒、楊淳宇</p>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-6">
            <div class="flex flex-1 items-center justify-between gap-4 rounded-lg p-4" :class="statusDisplay.containerClass">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-4">
                  <Icon :name="statusDisplay.icon" :size="32" />
                  <div class="flex flex-col gap-1">
                    <p class="text-sm font-medium uppercase text-gray-500">階段狀態</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ statusDisplay.statusText }}</p>
                  </div>
                </div>
                <div class="hidden h-12 w-px bg-gray-200 sm:block"></div>
              </div>
              <p class="text-2xl font-semibold text-gray-900">{{ statusDisplay.description }}</p>
            </div>
            <ButtonCTA variant="outline" size="sm" left-icon="pencil" class="!min-w-0" @click="showEditResultDrawer = true">修改結果</ButtonCTA>
          </div>
        </div>
        <div class="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">審查檔案</h2>
            </div>
            <ButtonDropdown
              v-if="reviewFiles.length > 0"
              button-text="新增項目"
              :items="addFileOptions"
              button-variant="outline"
              button-size="sm"
              left-icon="plus"
              menu-width="w-[200px]"
              :showRightIcon="false"
              align="right"
              @item-click="handleAddFileOption"
            />
          </div>
          <div v-if="reviewFiles.length === 0" class="py-2">
            <div class="flex flex-col items-center gap-3">
              <Empty type="case-management" message="尚無審查檔案相關項目" :show-button="false" class="!gap-4 !py-0" />
              <ButtonDropdown
                button-text="新增項目"
                :items="addFileOptions"
                button-variant="outline"
                button-size="sm"
                menu-width="w-[200px]"
                menu-class="bottom-0 left-full mt-0 ml-0"
                :show-right-icon="false"
                @item-click="handleAddFileOption"
              />
            </div>
          </div>
          <div v-else class="flex flex-col gap-4 pt-4">
            <div v-for="file in reviewFiles" :key="file.id" class="rounded-lg border border-blue-500 px-5 py-8">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-5">
                  <button class="flex items-center justify-center text-gray-800" @click="file.isExpanded = !file.isExpanded" aria-label="切換展開">
                    <Icon :name="file.isExpanded ? 'chevronUp' : 'chevronDown'" :size="24" />
                  </button>
                  <p class="text-lg text-gray-900">{{ file.name }}</p>
                </div>
                <div class="flex items-center gap-4 text-primary-700">
                  <button class="flex items-center justify-center" aria-label="編輯項目" @click="handleEditReviewFile(file)">
                    <Icon name="editOutline" :size="24" color="#1A56DB" />
                  </button>
                  <button class="flex items-center justify-center" aria-label="刪除項目" @click="openDeleteModal(file)">
                    <Icon name="trashCan" :size="24" color="#1A56DB" />
                  </button>
                </div>
              </div>
              <div v-if="file.isExpanded" class="mt-8 flex flex-col gap-10">
                <div class="flex flex-col gap-5 px-5">
                  <div class="flex flex-wrap gap-10">
                    <div class="flex w-[150px] flex-col gap-1">
                      <p class="text-base font-medium text-gray-500">上傳截止日</p>
                      <p class="text-lg text-gray-900">{{ file.uploadDeadline }}</p>
                    </div>
                    <div class="flex flex-1 flex-col gap-1">
                      <p class="text-base font-medium text-gray-500">權限設定</p>
                      <div class="flex flex-wrap gap-5">
                        <div class="flex items-center gap-1">
                          <p class="text-lg text-gray-900">幹事瀏覽</p>
                          <Switch v-model="file.staffVisible" :show-text="true" on-text="開啟" off-text="關閉" />
                        </div>
                        <div class="flex items-center gap-1">
                          <p class="text-lg text-gray-900">申請端瀏覽</p>
                          <Switch v-model="file.applicantVisible" :show-text="true" on-text="開啟" off-text="關閉" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-10">
                    <div class="flex w-[150px] flex-col gap-1">
                      <p class="text-base font-medium text-gray-500">發文日期</p>
                      <p class="text-lg text-gray-900">{{ file.publishDate }}</p>
                    </div>
                    <div class="flex w-[150px] flex-col gap-1">
                      <p class="text-base font-medium text-gray-500">收文日期</p>
                      <button
                        v-if="!file.receiveDate || file.receiveDate === '-'"
                        type="button"
                        class="text-left text-lg text-blue-500 underline"
                        @click="handleEditReviewFile(file)"
                      >
                        新增
                      </button>
                      <p v-else class="text-lg text-gray-900">{{ file.receiveDate }}</p>
                    </div>
                  </div>
                </div>
                <div class="h-px w-full bg-neutral-300"></div>
                <div class="flex flex-col gap-5 px-10">
                  <div v-for="item in file.uploadItems" :key="item.label" class="flex items-center justify-between px-5 py-3">
                    <div class="flex items-center gap-5">
                      <span class="rounded-md px-3 py-0.5 text-sm font-medium" :class="getUploadStatusClasses(item.status)">
                        {{ item.status === "uploaded" ? "已上傳" : "未上傳" }}
                      </span>
                      <p class="text-lg text-gray-900">{{ item.label }}</p>
                    </div>
                    <button
                      type="button"
                      class="text-sm font-medium underline"
                      :class="item.status === 'uploaded' ? 'text-primary-700' : 'cursor-not-allowed text-[#A4CAFE]'"
                      :disabled="item.status !== 'uploaded'"
                    >
                      查看
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Drawer v-model="showEditResultDrawer" title="修改案件階段結果" width="xl">
    <template #default>
      <div class="flex flex-col gap-4">
        <p class="text-base font-medium text-gray-900">請選擇階段目前狀態</p>
        <div class="flex flex-col gap-5">
          <div v-for="option in statusOptions" :key="option.value" class="flex flex-col gap-4">
            <Radio v-model="selectedStatus" :value="option.value" :label="option.label" name="stageStatus" />
            <div v-if="option.value === 'in-progress' && selectedStatus === 'in-progress'" class="flex flex-col gap-4">
              <p class="text-base font-medium text-gray-700">在階段狀態細項顯示</p>
              <div class="flex flex-col gap-4 rounded-lg bg-gray-50 px-6 py-4">
                <div v-for="item in progressItems" :key="item.label" class="flex items-center justify-between">
                  <p class="text-base text-gray-900">{{ item.label }}</p>
                  <Switch
                    :model-value="item.enabled"
                    :show-text="true"
                    on-text="顯示"
                    off-text="關閉"
                    @update:modelValue="(value) => handleToggleProgressItem(item.label, value)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelEditResult">取消</ButtonCTA>
        <ButtonCTA variant="primary" size="xl" class="w-[124px]" @click="handleSaveEditResult">儲存</ButtonCTA>
      </div>
    </template>
  </Drawer>
  <Drawer v-model="showAddItemDrawer" :title="addItemDrawerTitle" width="xl" close-action="emit" @close="handleAddItemDrawerClose">
    <template #default>
      <div class="flex flex-col gap-6">
        <Input v-model="addItemForm.name" label="項目名稱" placeholder="輸入項目名稱" size="lg" required />
        <InputDropdown
          v-if="!isEditMode"
          label="項目類別"
          required
          :button-text="addItemForm.category"
          placeholder="請選擇"
          :items="addFileOptions"
          @item-click="handleCategorySelect"
        />
        <div v-if="!isRevisionCategory && !isEditMode" class="flex flex-col gap-4">
          <p class="text-base font-medium text-gray-900">申請端上傳項目設定</p>
          <div class="flex flex-col gap-3">
            <label v-for="item in uploadOptions" :key="item.value" class="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
              <input
                v-model="addItemForm.uploadSelections"
                :value="item.value"
                type="checkbox"
                class="h-4 w-4 rounded border border-gray-500 bg-gray-50 text-primary-600 focus:ring-2 focus:ring-primary-200"
              />
              {{ item.label }}
            </label>
          </div>
        </div>
        <DatePicker v-if="!isRevisionCategory" v-model="addItemForm.deadline" label="上傳截止日期" placeholder="設定上傳截止日期" containerClass="w-full" required />
        <div class="flex flex-col gap-4">
          <p class="text-base font-medium text-[#1a1b1d]">權限設定</p>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <p class="text-base text-[#6b6e70]">幹事瀏覽</p>
              <Switch v-model="addItemForm.staffVisible" :show-text="true" on-text="上架" off-text="關閉" />
            </div>
            <div class="flex items-center gap-3">
              <p class="text-base text-[#6b6e70]">申請端瀏覽</p>
              <Switch v-model="addItemForm.applicantVisible" :show-text="true" on-text="上架" off-text="關閉" />
            </div>
          </div>
        </div>
        <div v-if="isEditMode || isRevisionCategory" class="h-px w-full bg-gray-300"></div>
        <template v-if="isEditMode">
          <DatePicker
            v-model="addItemForm.publishDate"
            label="發文日期"
            :placeholder="isRevisionCategory ? '選擇發文日期' : '申請端填寫'"
            containerClass="w-full"
            :disabled="!isRevisionCategory"
            :required="isRevisionCategory"
          />
          <DatePicker v-model="addItemForm.receiveDate" label="收文日期" placeholder="填寫收文日期" containerClass="w-full" />
          <Input v-model="addItemForm.receiveNumber" label="收文字號" placeholder="填寫收文字號" size="lg" />
        </template>
        <template v-else-if="isRevisionCategory">
          <Input v-model="addItemForm.documentNo" label="發文字號" placeholder="輸入發文字號" size="lg" required />
          <DatePicker v-model="addItemForm.publishDate" label="發文日期" placeholder="選擇發文日期" containerClass="w-full" required />
          <FileUpload v-model="addItemForm.attachments" label="公文及修正意見上傳" :max-size="10" multiple @file-error="handleFileError" />
        </template>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelAddItem">取消</ButtonCTA>
        <ButtonCTA variant="primary" size="xl" class="w-[124px]" :disabled="isAddItemSaveDisabled" @click="handleSaveAddItem">儲存</ButtonCTA>
      </div>
    </template>
  </Drawer>
  <div class="fixed bottom-6 z-[90]" :style="saveToastPositionStyle">
    <Toast v-model="showSaveToast" message="儲存成功" :show-actions="false" :show-close="true" :auto-close="true">
      <template #icon>
        <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
      </template>
    </Toast>
  </div>
  <div class="fixed bottom-6 z-[90]" :style="saveToastPositionStyle">
    <Toast v-model="showAddItemToast" message="已新增" :show-actions="false" :show-close="true" :auto-close="true">
      <template #icon>
        <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
      </template>
    </Toast>
  </div>
  <UnsavedChangesModal
    :model-value="addItemUnsavedDialog.showUnsavedChangesModal.value"
    @update:modelValue="(value) => (addItemUnsavedDialog.showUnsavedChangesModal.value = value)"
    :confirm-disabled="isAddItemSaveDisabled"
    @exit="handleExitAddItemEdit"
    @confirm="handleSaveAndCloseAddItem"
  />
  <Modal v-model="showCreateReportGuideModal" size="md" :static="false" :show-close-button="false" close-action="emit" backdrop-class="bg-gray-600/80">
    <template #header>
      <div class="flex w-full items-center justify-end px-4 pb-0 pt-4">
        <button
          type="button"
          class="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="關閉彈窗"
          @click="handleCloseCreateReportGuide"
        >
          <Icon name="close" :size="20" />
        </button>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col items-center gap-4 px-6 py-5">
        <Icon name="filePlus" :size="42" color="#9CA3AF" fill="#9CA3AF" />
        <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
          繼續建立都市更新事業計畫書(補正版)
          <br />
          供申請者上傳
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
        <ButtonCTA variant="white" size="xs" class="h-8 w-[120px] border-gray-200 px-3 py-2 text-sm font-medium leading-[1.5] text-gray-800" @click="handleCloseCreateReportGuide">
          取消
        </ButtonCTA>
        <ButtonCTA variant="primary" size="xs" class="h-8 w-[120px] px-3 py-2 text-sm font-medium leading-[1.5]" @click="handleConfirmCreateReportGuide"> 確認 </ButtonCTA>
      </div>
    </template>
  </Modal>
  <Modal v-model="showUploadWarningModal" size="md" backdrop-class="bg-gray-600/80" :show-close-button="true" close-action="emit">
    <template #body>
      <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
        <p class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">{{ uploadWarningMessage }}</p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-center px-6 pb-6 pt-0">
        <ButtonCTA variant="primary" size="xs" class="h-8 min-w-[120px]" @click="showUploadWarningModal = false">確認</ButtonCTA>
      </div>
    </template>
  </Modal>
  <ConfirmDeleteModal v-model="showDeleteModal" message="確認刪除此項目" description="內容將完全刪除無法復原" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { useFormUnsavedCheck } from "@/composables/useFormUnsavedCheck";
import { useUnsavedChangesDialog } from "@/composables/useUnsavedChangesDialog";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import Radio from "@/components/atoms/Radio.vue";
import Modal from "@/components/atoms/Modal.vue";
import Toast from "@/components/atoms/Toast.vue";
import Input from "@/components/atoms/Input.vue";
import Switch from "@/components/atoms/Switch.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import UnsavedChangesModal from "@/components/molecules/UnsavedChangesModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import ButtonDropdown, { type ButtonDropdownItem } from "@/components/atoms/ButtonDropdown.vue";
import type { AddReviewItemForm, ReviewFileCategory, ReviewFileItem } from "@/types/backend/caseManagement/common/CaseStageDetailView.d";
const route = useRoute();
const addItemUnsavedDialog = useUnsavedChangesDialog();
const showSaveToast = ref(false);
const addItemUnsavedCheck = useFormUnsavedCheck(() => getAddItemSnapshot());
const showDeleteModal = ref(false);
const showAddItemToast = ref(false);
const uploadWarningMessage = ref("");
const showAddItemDrawer = ref(false);
const savedStatus = ref("in-progress");
const showEditResultDrawer = ref(false);
const selectedStatus = ref("in-progress");
const showUploadWarningModal = ref(false);
const showCreateReportGuideModal = ref(false);
const reviewFiles = ref<ReviewFileItem[]>([]);
const deleteTargetId = ref<number | null>(null);
const editTargetId = ref<number | null>(null);
const progressItems = ref([
  { label: "階段開放", enabled: true },
  { label: "審查中", enabled: true },
  { label: "依意見修正補件", enabled: true },
  { label: "召開會議", enabled: true },
  { label: "函發會議記錄", enabled: true },
  { label: "依會議記錄修正補件", enabled: true },
]);
/*
const reviewFiles = ref<ReviewFileItem[]>([
  {
    id: 1,
    name: "都市更新事業計畫書",
    uploadDeadline: "114/10/20",
    staffVisible: false,
    applicantVisible: true,
    publishDate: "-",
    receiveDate: "",
    uploadItems: [
      { label: "報告書", status: "pending" },
      { label: "公文", status: "pending" },
    ],
    isExpanded: true,
  },
]);
*/
const createInitialAddItemForm = (): AddReviewItemForm => ({
  name: "",
  category: "報告書/審查簡報",
  uploadSelections: ["upload-official", "upload-report", "upload-presentation"],
  deadline: null,
  staffVisible: false,
  applicantVisible: true,
  documentNo: "",
  publishDate: null,
  receiveDate: null,
  receiveNumber: "",
  attachments: [],
});
const addItemForm = ref<AddReviewItemForm>(createInitialAddItemForm());
const STORAGE_KEY = "caseStageStatusOverrides";
const addFileOptions: ButtonDropdownItem[] = [
  { label: "報告書/審查簡報", value: "report" },
  { label: "修正意見/會議記錄", value: "revision" },
];
const saveToastPositionStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};
const uploadOptions = [
  { label: "上傳公文", value: "upload-official" },
  { label: "上傳報告書", value: "upload-report" },
  { label: "上傳審查簡報", value: "upload-presentation" },
];
const statusOptions = [
  { label: "未開始", value: "not-started" },
  { label: "進行中", value: "in-progress" },
  { label: "已完成", value: "completed" },
  { label: "已撤案", value: "withdrawn" },
  { label: "案件廢止", value: "terminated" },
];
const stageOrder = ["案件申請", "公辦公聽會", "都更幹事會", "專案小組", "都更大會", "最終核定"];
const isEditMode = computed(() => editTargetId.value !== null);
const addItemDrawerTitle = computed(() => (isEditMode.value ? "編輯" : "新增項目"));
const isRevisionCategory = computed(() => addItemForm.value.category === "修正意見/會議記錄");
const stageTitle = computed(() => (route.query?.stage as string | undefined) || "都更幹事會");
const isAddItemSaveDisabled = computed(() => {
  if (!addItemForm.value.name.trim()) return true;
  if (!addItemForm.value.category) return true;
  if (isEditMode.value) {
    if (!isRevisionCategory.value && !addItemForm.value.deadline) return true;
    return !addItemUnsavedCheck.hasUnsavedChanges.value;
  }
  if (isRevisionCategory.value) {
    if (!addItemForm.value.documentNo.trim()) return true;
    if (!addItemForm.value.publishDate) return true;
    return false;
  }
  if (!addItemForm.value.deadline) return true;
  return addItemForm.value.uploadSelections.length === 0;
});
const getNextStageLabel = (currentStage: string) => {
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) return "已完成";
  return `進入下階段-${stageOrder[currentIndex + 1]}`;
};
const getCurrentProgressDescription = () => {
  const enabledItem = progressItems.value.find((item) => item.enabled);
  if (!enabledItem) return "階段未開放";
  if (enabledItem.label === "階段開放") return "階段開放";
  if (enabledItem.label === "審查中") return "審查中-承辦單位審查中";
  if (enabledItem.label === "依意見修正補件") return "依意見修正補件";
  return enabledItem.label;
};
const statusDisplay = computed(() => {
  const status = savedStatus.value;
  if (status === "completed") {
    return {
      icon: "stepCheck",
      statusText: "已完成",
      description: getNextStageLabel(stageTitle.value),
      containerClass: "bg-green-50",
    };
  }
  if (status === "in-progress") {
    return {
      icon: "setpUncheck",
      statusText: "進行中",
      description: getCurrentProgressDescription(),
      containerClass: "bg-blue-50",
    };
  }
  if (status === "withdrawn") {
    return {
      icon: "deleteCircle",
      statusText: "已撤案",
      description: "申請人撤回",
      containerClass: "bg-pink-50",
    };
  }
  if (status === "terminated") {
    return {
      icon: "deleteCircle",
      statusText: "案件廢止",
      description: "案件廢止-階段中斷",
      containerClass: "bg-pink-50",
    };
  }
  return {
    icon: "stepUncheckGray",
    statusText: "未開始",
    description: "未開始",
    containerClass: "bg-gray-50",
  };
});
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const getAddItemSnapshot = () =>
  JSON.stringify({
    name: addItemForm.value.name.trim(),
    category: addItemForm.value.category,
    uploadSelections: [...addItemForm.value.uploadSelections].sort(),
    deadline: addItemForm.value.deadline ?? "",
    staffVisible: addItemForm.value.staffVisible,
    applicantVisible: addItemForm.value.applicantVisible,
    documentNo: addItemForm.value.documentNo.trim(),
    publishDate: addItemForm.value.publishDate ?? "",
    receiveDate: addItemForm.value.receiveDate ?? "",
    receiveNumber: addItemForm.value.receiveNumber.trim(),
    attachmentsCount: addItemForm.value.attachments.length,
  });
const resetProgressItems = () => {
  progressItems.value = progressItems.value.map((item) => ({
    ...item,
    enabled: false,
  }));
};
watch(
  () => selectedStatus.value,
  (status) => {
    if (status === "in-progress") {
      resetProgressItems();
    }
  },
  { immediate: true }
);
watch(
  () => showAddItemDrawer.value,
  (isOpen) => {
    if (isOpen) {
      addItemUnsavedCheck.captureInitial();
    }
  }
);
const handleToggleProgressItem = (label: string, value: boolean) => {
  progressItems.value = progressItems.value.map((item) => ({
    ...item,
    enabled: item.label === label ? value : value ? false : item.enabled,
  }));
};
const loadStageOverrides = (): Record<string, { status: string; progress: Record<string, boolean> }> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, { status: string; progress: Record<string, boolean> }>;
  } catch {
    return {};
  }
};
const saveStageOverrides = (overrides: Record<string, { status: string; progress: Record<string, boolean> }>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};
const syncFromStorage = () => {
  const overrides = loadStageOverrides();
  const current = overrides[stageTitle.value];
  if (current?.status) {
    savedStatus.value = current.status;
    selectedStatus.value = current.status;
  } else {
    savedStatus.value = selectedStatus.value;
  }
  if (current?.progress) {
    progressItems.value = progressItems.value.map((item) => ({
      ...item,
      enabled: Boolean(current.progress[item.label]),
    }));
  }
};
const handleSaveEditResult = () => {
  const overrides = loadStageOverrides();
  overrides[stageTitle.value] = {
    status: selectedStatus.value,
    progress: progressItems.value.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.label] = item.enabled;
      return acc;
    }, {}),
  };
  saveStageOverrides(overrides);
  savedStatus.value = selectedStatus.value;
  showEditResultDrawer.value = false;
  showSaveToast.value = true;
};
const handleCancelEditResult = () => {
  showEditResultDrawer.value = false;
  syncFromStorage();
};
const handleAddFileOption = (item: ButtonDropdownItem) => {
  editTargetId.value = null;
  if (item.value === "report") {
    addItemForm.value.category = item.label as ReviewFileCategory;
    showAddItemDrawer.value = true;
  }
  if (item.value === "revision") {
    addItemForm.value.category = item.label as ReviewFileCategory;
    showAddItemDrawer.value = true;
  }
};
const handleCategorySelect = (item: InputDropdownItem) => {
  addItemForm.value.category = item.label as ReviewFileCategory;
};
const parseRocDate = (value: string | undefined) => {
  if (!value || value === "-") return null;
  const match = value.match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const [, rocYear, month, day] = match;
  return new Date(Number(rocYear) + 1911, Number(month) - 1, Number(day));
};
const mapUploadLabelsToSelections = (items: ReviewFileItem["uploadItems"]) =>
  items
    .map((item) => {
      if (item.label === "公文") return "upload-official";
      if (item.label === "報告書") return "upload-report";
      if (item.label === "審查簡報") return "upload-presentation";
      return null;
    })
    .filter((value): value is "upload-official" | "upload-report" | "upload-presentation" => value !== null);
const resetAddItemForm = () => {
  editTargetId.value = null;
  addItemForm.value = createInitialAddItemForm();
};
const handleEditReviewFile = (file: ReviewFileItem) => {
  editTargetId.value = file.id;
  addItemForm.value = {
    name: file.name,
    category: file.category,
    uploadSelections: mapUploadLabelsToSelections(file.uploadItems),
    deadline: parseRocDate(file.uploadDeadline),
    staffVisible: file.staffVisible,
    applicantVisible: file.applicantVisible,
    documentNo: "",
    publishDate: parseRocDate(file.publishDate),
    receiveDate: parseRocDate(file.receiveDate),
    receiveNumber: file.receiveNumber ?? "",
    attachments: [],
  };
  showAddItemDrawer.value = true;
};
const handleCancelAddItem = () => {
  if (
    !addItemUnsavedDialog.requestUnsavedConfirmation(addItemUnsavedCheck.hasUnsavedChanges.value, () => {
      showAddItemDrawer.value = false;
      resetAddItemForm();
    })
  ) {
    return;
  }
};
const handleAddItemDrawerClose = () => {
  handleCancelAddItem();
};
const formatDateDisplay = (value: string | Date | null | undefined) => {
  if (!value) return "-";
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return "-";
    const year = value.getFullYear() - 1911;
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  return value.toString();
};
const getUploadStatusClasses = (status: "uploaded" | "pending") => {
  if (status === "uploaded") {
    return "bg-green-100 text-green-800";
  }
  return "bg-blue-50 text-[#A4CAFE]";
};
const handleSaveAddItem = () => {
  if (isEditMode.value) {
    reviewFiles.value = reviewFiles.value.map((item) =>
      item.id === editTargetId.value
        ? {
            ...item,
            name: addItemForm.value.name.trim(),
            category: addItemForm.value.category,
            uploadDeadline: formatDateDisplay(addItemForm.value.deadline),
            staffVisible: addItemForm.value.staffVisible,
            applicantVisible: addItemForm.value.applicantVisible,
            publishDate: isRevisionCategory.value ? formatDateDisplay(addItemForm.value.publishDate) : "-",
            receiveDate: formatDateDisplay(addItemForm.value.receiveDate),
            receiveNumber: addItemForm.value.receiveNumber.trim(),
          }
        : item
    );
    showAddItemDrawer.value = false;
    showSaveToast.value = true;
    resetAddItemForm();
    addItemUnsavedCheck.captureInitial();
    return;
  }
  const name = addItemForm.value.name.trim() || addItemForm.value.category;
  const uploadItems = isRevisionCategory.value
    ? [{ label: "公文", status: "pending" as const }]
    : uploadOptions
        .filter((option) => addItemForm.value.uploadSelections.includes(option.value))
        .map((option) => ({
          label: option.label.replace("上傳", ""),
          status: "pending" as const,
        }));
  reviewFiles.value = [
    ...reviewFiles.value,
    {
      id: Date.now(),
      name,
      category: addItemForm.value.category,
      uploadDeadline: formatDateDisplay(addItemForm.value.deadline),
      staffVisible: addItemForm.value.staffVisible,
      applicantVisible: addItemForm.value.applicantVisible,
      publishDate: formatDateDisplay(addItemForm.value.publishDate),
      receiveDate: "",
      receiveNumber: "",
      uploadItems,
      isExpanded: false,
    },
  ];
  showAddItemDrawer.value = false;
  if (isRevisionCategory.value) {
    showCreateReportGuideModal.value = true;
  } else {
    showAddItemToast.value = true;
  }
  resetAddItemForm();
  addItemUnsavedCheck.captureInitial();
};
const handleConfirmCreateReportGuide = () => {
  resetAddItemForm();
  addItemForm.value.name = "都市更新事業計畫書(補正版)";
  addItemForm.value.category = "報告書/審查簡報";
  showCreateReportGuideModal.value = false;
  showAddItemDrawer.value = true;
};
const handleCloseCreateReportGuide = () => {
  showCreateReportGuideModal.value = false;
};
const openDeleteModal = (file: ReviewFileItem) => {
  deleteTargetId.value = file.id;
  showDeleteModal.value = true;
};
const handleConfirmDelete = () => {
  if (deleteTargetId.value !== null) {
    reviewFiles.value = reviewFiles.value.filter((item) => item.id !== deleteTargetId.value);
  }
  showDeleteModal.value = false;
  deleteTargetId.value = null;
};
const handleCancelDelete = () => {
  showDeleteModal.value = false;
  deleteTargetId.value = null;
};
const handleSaveAndCloseAddItem = () => {
  if (isAddItemSaveDisabled.value) return;
  addItemUnsavedDialog.closeUnsavedChangesModal();
  handleSaveAddItem();
};
const handleExitAddItemEdit = () => {
  addItemUnsavedDialog.runPendingAction();
};
const handleFileError = (payload: { type: "size" | "format"; maxSize?: number }) => {
  if (payload.type === "size") {
    uploadWarningMessage.value = `檔案大小需限 ${payload.maxSize ?? 10}MB，請重新確認`;
  } else {
    uploadWarningMessage.value = "檔案格式不符合規定，請重新確認";
  }
  showUploadWarningModal.value = true;
};
syncFromStorage();
</script>

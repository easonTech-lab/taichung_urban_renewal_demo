<template>
  <div class="min-h-screen bg-indigo-50">
  <SidebarSection :backdrop-closable="!showUnsavedToast" @item-select="handleSidebarItemSelect" />
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
            <div class="flex flex-1 items-center justify-between gap-4 rounded-lg bg-gray-50 p-4">
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
          <div v-if="reviewFiles.length === 0" class="py-6">
            <Empty type="search" message="尚無審查檔案相關項目" :show-button="false" />
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
                <button class="flex items-center justify-center" aria-label="編輯項目">
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
                      <button class="text-left text-lg text-blue-500 underline">新增</button>
                    </div>
                  </div>
                </div>
                <div class="h-px w-full bg-neutral-300"></div>
                <div class="flex flex-col gap-5 px-10">
                  <div v-for="item in file.uploadItems" :key="item.label" class="flex items-center justify-between px-5 py-3">
                    <div class="flex items-center gap-5">
                      <span
                        class="rounded-md px-3 py-0.5 text-sm font-medium"
                        :class="item.status === 'uploaded' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-900'"
                      >
                        {{ item.status === 'uploaded' ? '已上傳' : '未上傳' }}
                      </span>
                      <p class="text-lg text-gray-900">{{ item.label }}</p>
                    </div>
                    <button class="text-sm font-medium text-primary-700 underline">查看</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="reviewFiles.length === 0" class="flex justify-center pb-2">
            <ButtonDropdown
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
                  <Switch :model-value="item.enabled" :show-text="true" on-text="顯示" off-text="關閉" @update:modelValue="(value) => handleToggleProgressItem(item.label, value)" />
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
  <Drawer v-model="showAddItemDrawer" title="新增項目" width="xl" :static="showUnsavedToast">
    <template #default>
      <div class="flex flex-col gap-6">
        <Input v-model="addItemForm.name" label="項目名稱" placeholder="輸入項目名稱" size="lg" required />
        <InputDropdown
          label="項目類別"
          required
          :button-text="addItemForm.category"
          placeholder="請選擇"
          :items="addFileOptions"
          @item-click="handleCategorySelect"
        />
        <div v-if="!isRevisionCategory" class="flex flex-col gap-4">
          <p class="text-base font-medium text-gray-900">申請端上傳項目設定</p>
          <div class="flex flex-col gap-3">
            <label v-for="item in uploadOptions" :key="item.value" class="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
              <input v-model="addItemForm.uploadSelections" :value="item.value" type="checkbox" class="h-4 w-4 rounded border border-gray-500 bg-gray-50 text-primary-600 focus:ring-2 focus:ring-primary-200" />
              {{ item.label }}
            </label>
          </div>
        </div>
        <DatePicker v-if="!isRevisionCategory" v-model="addItemForm.deadline" label="上傳截止日期" placeholder="設定上傳截止日期" containerClass="w-full" />
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
        <div v-if="isRevisionCategory" class="h-px w-full bg-gray-300"></div>
        <Input v-if="isRevisionCategory" v-model="addItemForm.documentNo" label="發文字號" placeholder="輸入發文字號" size="lg" required />
        <DatePicker v-if="isRevisionCategory" v-model="addItemForm.publishDate" label="發文日期" placeholder="選擇發文日期" containerClass="w-full" />
        <FileUpload v-if="isRevisionCategory" v-model="addItemForm.attachments" label="公文及修正意見上傳" :max-size="10" />
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelAddItem">取消</ButtonCTA>
        <ButtonCTA variant="primary" size="xl" class="w-[124px]" :disabled="isAddItemSaveDisabled" @click="handleSaveAddItem">儲存</ButtonCTA>
      </div>
    </template>
  </Drawer>
  <div class="fixed bottom-6 z-[90]" :style="toastPositionStyle">
    <Toast v-model="showSaveToast" message="儲存成功" :show-actions="false" :show-close="false" :auto-close="true" />
  </div>
  <div class="fixed bottom-6 z-[90]" :style="toastPositionStyle">
    <Toast v-model="showAddItemToast" message="已新增" :show-actions="false" :show-close="true" :auto-close="true">
      <template #icon>
        <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
      </template>
    </Toast>
  </div>
  <div class="fixed bottom-6 z-[90]" :style="toastPositionStyle">
    <Toast
      v-model="showUnsavedToast"
      message="有尚未儲存的修改"
      :show-actions="true"
      :show-close="true"
      :auto-close="false"
      primary-label="暫存"
      secondary-label="退出編輯"
      @primary="handleTempSave"
      @secondary="handleExitEdit"
    />
  </div>
  <ConfirmDeleteModal
    v-model="showDeleteModal"
    message="確認刪除此項目"
    description="內容將完全刪除無法復原"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import Radio from "@/components/atoms/Radio.vue";
import Toast from "@/components/atoms/Toast.vue";
import Input from "@/components/atoms/Input.vue";
import Switch from "@/components/atoms/Switch.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import DatePicker from "@/components/atoms/DatePicker.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import FileUpload from "@/components/atoms/FileUpload.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import ButtonDropdown, { type ButtonDropdownItem } from "@/components/atoms/ButtonDropdown.vue";
const route = useRoute();
const stageTitle = computed(() => (route.query?.stage as string | undefined) || "都更幹事會");
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
const STORAGE_KEY = "caseStageStatusOverrides";
const savedStatus = ref("in-progress");
const selectedStatus = ref("in-progress");
const showSaveToast = ref(false);
const showUnsavedToast = ref(false);
const showAddItemToast = ref(false);
const showEditResultDrawer = ref(false);
const statusOptions = [
  { label: "未開始", value: "not-started" },
  { label: "進行中", value: "in-progress" },
  { label: "已完成", value: "completed" },
  { label: "已撤案", value: "withdrawn" },
  { label: "案件廢止", value: "terminated" },
];

const progressItems = ref([
  { label: "階段開放", enabled: true },
  { label: "審查中", enabled: true },
  { label: "依意見修正補件", enabled: true },
  { label: "召開會議", enabled: true },
  { label: "函發會議記錄", enabled: true },
  { label: "依會議記錄修正補件", enabled: true },
]);

const addFileOptions: ButtonDropdownItem[] = [
  { label: "報告書/審查簡報", value: "report" },
  { label: "修正意見/會議記錄", value: "revision" },
];

type ReviewFileItem = {
  id: number;
  name: string;
  uploadDeadline: string;
  staffVisible: boolean;
  applicantVisible: boolean;
  publishDate: string;
  receiveDate?: string;
  uploadItems: { label: string; status: "uploaded" | "pending" }[];
  isExpanded: boolean;
};

const uploadOptions = [
  { label: "上傳公文", value: "upload-official" },
  { label: "上傳報告書", value: "upload-report" },
  { label: "上傳審查簡報", value: "upload-presentation" },
];

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
const showDeleteModal = ref(false);
const deleteTargetId = ref<number | null>(null);
const showAddItemDrawer = ref(false);
const addItemForm = ref({
  name: "",
  category: "報告書/審查簡報",
  uploadSelections: ["upload-official", "upload-report", "upload-presentation"],
  deadline: "",
  staffVisible: false,
  applicantVisible: true,
  documentNo: "",
  publishDate: "",
  attachments: [],
});

const isRevisionCategory = computed(() => addItemForm.value.category === "修正意見/會議記錄");
const initialAddItemSnapshot = ref("");
const isAddItemSaveDisabled = computed(() => {
  if (!addItemForm.value.name.trim()) return true;
  if (!addItemForm.value.category) return true;
  if (isRevisionCategory.value) {
    if (!addItemForm.value.documentNo.trim()) return true;
    if (!addItemForm.value.publishDate) return true;
    return addItemForm.value.attachments.length === 0;
  }
  if (!addItemForm.value.deadline) return true;
  return addItemForm.value.uploadSelections.length === 0;
});
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
    attachmentsCount: addItemForm.value.attachments.length,
  });
const isAddItemDirty = computed(() => getAddItemSnapshot() !== initialAddItemSnapshot.value);

const drawerWidthPx = 460;
const toastPositionStyle = computed(() => {
  if (!showAddItemDrawer.value) {
    return {
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(900px, calc(100vw - 2rem))",
      maxWidth: "min(900px, calc(100vw - 2rem))",
      minWidth: "min(900px, calc(100vw - 2rem))",
    };
  }
  const width = `min(900px, calc(100vw - ${drawerWidthPx}px - 2rem))`;
  return {
    left: `max(1rem, calc((100vw - ${drawerWidthPx}px) / 2))`,
    transform: "translateX(-50%)",
    width,
    maxWidth: width,
    minWidth: width,
  };
});

const resetProgressItems = () => {
  progressItems.value = progressItems.value.map((item) => ({
    ...item,
    enabled: false,
  }));
};

const handleToggleProgressItem = (label: string, value: boolean) => {
  progressItems.value = progressItems.value.map((item) => ({
    ...item,
    enabled: item.label === label ? value : value ? false : item.enabled,
  }));
};

const statusDisplay = computed(() => {
  const status = savedStatus.value;
  if (status === "completed") {
    return { icon: "stepCheck", statusText: "已完成", description: "階段已完成" };
  }
  if (status === "in-progress") {
    return { icon: "setpUncheck", statusText: "進行中", description: "階段進行中" };
  }
  if (status === "withdrawn") {
    return { icon: "stepUncheckGray", statusText: "已撤案", description: "已撤案" };
  }
  if (status === "terminated") {
    return { icon: "stepUncheckGray", statusText: "案件廢止", description: "案件廢止" };
  }
  return { icon: "stepUncheckGray", statusText: "未開始", description: "階段未開放" };
});

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
  if (item.value === "report") {
    addItemForm.value.category = item.label;
    showAddItemDrawer.value = true;
  }
  if (item.value === "revision") {
    addItemForm.value.category = item.label;
    showAddItemDrawer.value = true;
  }
};

const handleCategorySelect = (item: InputDropdownItem) => {
  addItemForm.value.category = item.label;
};

const handleCancelAddItem = () => {
  if (isAddItemDirty.value) {
    showUnsavedToast.value = true;
  } else {
    showAddItemDrawer.value = false;
  }
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

const handleSaveAddItem = () => {
  const name = addItemForm.value.name.trim() || addItemForm.value.category;
  const uploadItems = isRevisionCategory.value
    ? [
        { label: "公文", status: "pending" as const },
        { label: "修正意見", status: "pending" as const },
      ]
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
      uploadDeadline: "114/10/20",
      staffVisible: addItemForm.value.staffVisible,
      applicantVisible: addItemForm.value.applicantVisible,
      publishDate: formatDateDisplay(addItemForm.value.publishDate),
      receiveDate: "",
      uploadItems,
      isExpanded: false,
    },
  ];
  showAddItemDrawer.value = false;
  showAddItemToast.value = true;
  addItemForm.value = {
    name: "",
    category: "報告書/審查簡報",
    uploadSelections: ["upload-official", "upload-report", "upload-presentation"],
    deadline: "",
    staffVisible: false,
    applicantVisible: true,
    documentNo: "",
    publishDate: "",
    attachments: [],
  };
  initialAddItemSnapshot.value = getAddItemSnapshot();
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

const handleTempSave = () => {
  showUnsavedToast.value = false;
  showAddItemDrawer.value = false;
  showSaveToast.value = true;
};

const handleExitEdit = () => {
  showUnsavedToast.value = false;
  showAddItemDrawer.value = false;
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
      initialAddItemSnapshot.value = getAddItemSnapshot();
    }
  }
);

syncFromStorage();
</script>

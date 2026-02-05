<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
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
          <div class="py-6">
            <Empty type="search" message="尚無審查檔案相關項目" :show-button="false" />
          </div>
          <div class="flex justify-center pb-2">
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
  <Drawer v-model="showAddItemDrawer" title="新增項目" width="xl">
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
        <div class="flex flex-col gap-4">
          <p class="text-base font-medium text-gray-900">申請端上傳項目設定</p>
          <div class="flex flex-col gap-3">
            <label v-for="item in uploadOptions" :key="item.value" class="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
              <input v-model="addItemForm.uploadSelections" :value="item.value" type="checkbox" class="h-4 w-4 rounded border border-gray-500 bg-gray-50 text-primary-600 focus:ring-2 focus:ring-primary-200" />
              {{ item.label }}
            </label>
          </div>
        </div>
        <DatePicker v-model="addItemForm.deadline" label="上傳截止日期" placeholder="設定上傳截止日期" />
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
        <div class="h-px w-full bg-gray-300"></div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-4">
        <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancelAddItem">取消</ButtonCTA>
        <ButtonCTA variant="gray" size="xl" class="w-[124px]" :disabled="true">儲存</ButtonCTA>
      </div>
    </template>
  </Drawer>
  <div class="fixed bottom-6 left-1/2 z-[90] w-[min(900px,calc(100vw-2rem))] -translate-x-1/2">
    <Toast v-model="showSaveToast" message="儲存成功" :show-actions="false" :show-close="false" :auto-close="true" />
  </div>
  <div v-if="showUnsavedToast" class="fixed bottom-6 left-0 z-[90] w-full px-10">
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
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
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

const uploadOptions = [
  { label: "上傳公文", value: "upload-official" },
  { label: "上傳報告書", value: "upload-report" },
  { label: "上傳審查簡報", value: "upload-presentation" },
];

const showAddItemDrawer = ref(false);
const addItemForm = ref({
  name: "",
  category: "報告書/審查簡報",
  uploadSelections: ["upload-official", "upload-report", "upload-presentation"],
  deadline: "",
  staffVisible: false,
  applicantVisible: true,
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
  showUnsavedToast.value = true;
};

const handleTempSave = () => {
  showUnsavedToast.value = false;
};

const handleExitEdit = () => {
  showUnsavedToast.value = false;
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

syncFromStorage();
</script>

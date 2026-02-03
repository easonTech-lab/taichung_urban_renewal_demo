<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center gap-3">
          <h1 class="max-w-[400px] truncate text-3xl font-bold leading-[30px] text-gray-900">擬訂臺中市豐原區三村段三小段20地號(等)3筆土地重建計畫案</h1>
          <div
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary-500 bg-white hover:bg-gray-50"
            @click="isDrawerOpen = true"
            title="編輯幹事名單"
          >
            <Icon name="pencil" :size="24" color="#1C64F2" class="m-auto" />
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex items-center overflow-hidden rounded-t-lg">
        <button v-for="(tab, index) in tabs" :key="index" :class="getTabClass(index)" @click="handleTabClick(index)">
          <span :class="getTabTextClass(index)">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div :class="activeTab !== 0 ? 'rounded-lg bg-white p-6 shadow-sm' : ''">
        <!-- Case Information Tab -->
        <div v-if="activeTab === 0" class="flex flex-col gap-10">
          <!-- Case Basic Information Section -->
          <div class="flex flex-col gap-10 rounded-lg bg-white p-6">
            <!-- Section Title -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="h-7 w-1 rounded bg-primary-600"></div>
                <h2 class="text-2xl font-medium leading-6 text-gray-900">案件基本資訊</h2>
              </div>
              <div>
                <ButtonCTA v-if="isAdminUser" variant="outline" left-icon="editOutline" class="flex items-center gap-2" @click="openEditInfoDrawer">編輯內容</ButtonCTA>
              </div>
            </div>

            <!-- Information Grid -->
            <div class="flex flex-wrap gap-10">
              <!-- Case Name -->
              <div class="flex min-w-[840px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">案件名稱</p>
                <p class="text-lg text-gray-900">臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案</p>
              </div>

              <!-- Case Number -->
              <div class="flex min-w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">案件編號</p>
                <p class="text-lg text-gray-900">abc13456788999</p>
              </div>

              <!-- Application Date -->
              <div class="flex min-w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">申請日期</p>
                <p class="text-lg text-gray-900">114/10/20</p>
              </div>

              <!-- Applicant Name -->
              <div class="flex min-w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">申請者姓名</p>
                <p class="text-lg text-gray-900">陳傑瑞</p>
              </div>

              <!-- Contact Phone -->
              <div class="flex min-w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">聯絡電話</p>
                <p class="text-lg text-gray-900">0933123123</p>
              </div>

              <!-- Email -->
              <div class="flex min-w-[280px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">E-mail</p>
                <p class="text-lg text-gray-900">abc@gmail.com</p>
              </div>

              <!-- Contact Address -->
              <div class="flex min-w-[840px] flex-col gap-2 pl-5">
                <p class="text-base font-medium text-gray-500">聯絡地址</p>
                <p class="text-lg text-gray-900">台中市文心路二段588號</p>
              </div>
            </div>

            <!-- Action Cards -->
            <div class="flex gap-5" v-if="!isAdminUser">
              <!-- Application Basic Information Card -->
              <button
                type="button"
                class="flex h-[66px] flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                @click="handleCardClick('application-basic')"
              >
                <span class="text-lg font-bold leading-[1.3] text-gray-500">申請基本資料</span>
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                  <Icon name="arrowRightOutline" :size="24" color="#1C64F2" class="relative z-10" />
                </div>
              </button>

              <!-- Urban Renewal Review Data Form Card -->
              <button
                type="button"
                class="flex h-[66px] flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                @click="handleCardClick('review-data')"
              >
                <span class="text-lg font-bold leading-[1.3] text-gray-500">都市更新審議資料表</span>
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                  <Icon name="arrowRightOutline" :size="24" color="#1C64F2" class="relative z-10" />
                </div>
              </button>

              <!-- Floor Area Ratio Incentive Card -->
              <button
                type="button"
                class="flex h-[66px] flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                @click="handleCardClick('floor-area-ratio')"
              >
                <span class="text-lg font-bold leading-[1.3] text-gray-500">容積獎勵項目及額度</span>
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                  <Icon name="arrowRightOutline" :size="24" color="#1C64F2" class="relative z-10" />
                </div>
              </button>
            </div>
          </div>

          <!-- Review Officer List Section -->
          <div class="flex flex-col gap-10 rounded-lg bg-white p-6" v-if="isAdminUser">
            <!-- Section Title -->
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">審查幹事列表</h2>
            </div>

            <!-- Empty State -->
            <div class="rounded-lg bg-white p-6">
              <Empty type="case" message="尚未導入審查幹事名單" button-text="導入幹事名單" :show-button="true" @button-click="handleImportOfficerList" />
            </div>
          </div>
        </div>

        <!-- Case Progress Tab -->
        <div v-if="activeTab === 1" class="flex flex-col gap-10">
          <!-- Section Title -->
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">案件各階段進度</h2>
          </div>

          <!-- Progress Table -->
          <div class="rounded-lg border border-gray-300 bg-white shadow-sm">
            <Table :columns="progressTableColumns" :rows="progressTableRows" :show-checkbox="false">
              <!-- Stage Name with Stepper Icon -->
              <template #cell-stageName="{ row }">
                <div class="flex items-center gap-4">
                  <div class="flex h-20 w-[120px] items-center justify-center">
                    <div :class="['flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white', getStageIconClass(row.status)]">
                      <Icon v-if="row.status === 'completed'" name="check" :size="20" color="#ffffff" />
                      <div v-else-if="row.status === 'current'" class="h-4 w-4 rounded-full bg-primary-500"></div>
                      <div v-else class="h-4 w-4 rounded-full border-2 border-primary-500 bg-white"></div>
                    </div>
                  </div>
                  <div>
                    <p class="text-base font-medium text-gray-800">{{ row.name }}</p>
                  </div>
                </div>
              </template>

              <!-- Stage Status Badge -->
              <template #cell-status="{ row }">
                <Badge :variant="getStatusBadgeVariant(row.status)" :text="row.statusText" />
              </template>

              <!-- Action Buttons -->
              <template #cell-action="{ row, rowIndex }">
                <div class="flex items-center gap-4">
                  <button v-if="row.hasDetails" class="text-base text-primary-600 hover:text-primary-700" @click.stop="handleViewDetails(rowIndex)">查看詳細資料</button>
                  <button v-if="row.hasSubStages" class="flex items-center justify-center" @click.stop="toggleStageExpand(rowIndex)">
                    <Icon :name="row.isExpanded ? 'chevronUp' : 'chevronDown'" :size="24" color="#1A56DB" />
                  </button>
                </div>
              </template>

              <!-- Expanded Sub-stages Row -->
              <template #row-after="{ row, rowIndex }">
                <tr v-if="row.isExpanded && row.subStages && row.subStages.length > 0" class="bg-blue-50">
                  <td colspan="5" class="px-4 py-6">
                    <div class="flex gap-4">
                      <!-- Sub-stages Stepper -->
                      <div class="flex w-[120px] flex-col items-center">
                        <div class="relative flex flex-col items-center">
                          <div
                            v-for="(subStage, subIndex) in row.subStages"
                            :key="subIndex"
                            class="flex flex-col items-center"
                            :class="Number(subIndex) < (row.subStages?.length || 0) - 1 ? 'mb-[52px]' : ''"
                          >
                            <div :class="['flex h-[18px] w-[18px] items-center justify-center rounded-full', getSubStageIconClass(subStage.status)]">
                              <Icon v-if="subStage.status === 'completed'" name="check" :size="14" color="#ffffff" />
                              <div v-else-if="subStage.status === 'current'" class="h-2 w-2 rounded-full bg-primary-500"></div>
                              <div v-else class="h-[18px] w-[18px] rounded-full border-2 border-primary-500 bg-white"></div>
                            </div>
                            <div v-if="Number(subIndex) < (row.subStages?.length || 0) - 1" class="h-[52px] w-0.5 bg-primary-500"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Sub-stages Content -->
                      <div class="flex-1 space-y-8">
                        <div v-for="(subStage, subIndex) in row.subStages" :key="subIndex" class="flex items-center">
                          <div class="flex-1">
                            <p :class="['text-base font-medium', subStage.status === 'current' ? 'text-gray-900' : 'text-gray-500']">
                              {{ subStage.title }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </Table>
          </div>
        </div>

        <!-- Project Files Tab -->
        <div v-if="activeTab === 2" class="flex flex-col gap-10">
          <!-- Section Title -->
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">專案檔案</h2>
          </div>

          <!-- Filter and Table -->
          <div class="flex flex-col gap-6">
            <!-- Filter Dropdown -->
            <div class="flex items-center gap-4">
              <Dropdown :button-text="selectedFileStage" :items="fileStageOptions" variant="outline" @item-click="handleFileStageChange" />
            </div>

            <!-- File Table -->
            <div class="rounded-lg border border-gray-300 bg-white shadow-sm">
              <Table :columns="fileTableColumns" :rows="paginatedFiles" :pagination="filePagination" @page-change="handleFilePageChange">
                <!-- Action -->
                <template #cell-action="{ row }">
                  <button
                    class="flex items-center justify-center text-primary-600 transition-colors hover:text-primary-700"
                    @click.stop="handleFileDownload(row)"
                    aria-label="下載檔案"
                  >
                    <Icon name="download" :size="24" color="#1C64F2" />
                  </button>
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Drawer v-model="isDrawerOpen" :title="drawerTitle" :width="drawerWidth" @close="handleDrawerClose">
        <template #default>
          <div v-if="drawerMode === 'officerList'" class="flex flex-col gap-0">
            <div v-for="(officer, index) in officerList" :key="index" class="flex items-center justify-between border-b border-gray-300 py-5">
              <div class="flex flex-1 items-center gap-2">
                <div class="flex w-5 items-center justify-center">
                  <span class="text-base font-normal leading-[1.25] text-gray-500">{{ index + 1 }}</span>
                </div>
                <InputDropdown
                  :button-text="officer.selectedOfficer || ''"
                  placeholder="選擇"
                  :items="getAvailableOfficersForIndex(index)"
                  required
                  :show-label="false"
                  @item-click="(item) => handleOfficerSelect(index, item)"
                />
              </div>
              <div class="flex items-center px-3 py-4">
                <ButtonCTA variant="textPlain" size="base" class="p-0" @click="handleRemoveOfficer(index)"> 移除 </ButtonCTA>
              </div>
            </div>
            <div class="flex items-center justify-start border-b border-gray-300 py-5">
              <ButtonCTA variant="outline" size="xl" class="w-full" left-icon="plus" @click="handleAddNewOfficer"> 新增委員 </ButtonCTA>
            </div>
          </div>
          <div v-else class="flex flex-col gap-6">
            <Input v-model="editForm.caseNumber" label="案件編號" required size="lg" />
            <Input v-model="editForm.applyDate" label="申請日期" required size="lg" />
            <Input v-model="editForm.applicantName" label="申請者姓名" required size="lg" />
            <Input v-model="editForm.phone" label="聯絡電話" required size="lg" />
            <Input v-model="editForm.address" label="聯絡地址" required size="lg" />
            <Input v-model="editForm.email" label="E-mail" required size="lg" />
          </div>
        </template>
        <template #footer>
          <div v-if="drawerMode === 'officerList'" class="flex gap-4">
            <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleCancel"> 取消 </ButtonCTA>
            <ButtonCTA variant="primary" size="xl" class="w-[124px]" @click="handleSave"> 儲存 </ButtonCTA>
          </div>
          <div v-else class="flex gap-4">
            <ButtonCTA variant="outline" size="xl" class="w-[124px]" @click="handleEditCancel"> 取消 </ButtonCTA>
            <ButtonCTA variant="primary" size="xl" class="w-[124px]" @click="handleEditSave"> 儲存 </ButtonCTA>
          </div>
        </template>
      </Drawer>
    </div>

    <div class="fixed bottom-6 z-[90]" :style="toastPositionStyle">
      <Toast
        v-model="showCancelToast"
        message="有尚未儲存的修改"
        :show-actions="true"
        primary-label="暫存"
        secondary-label="退出編輯"
        :auto-close="false"
        close-label="關閉提示"
        @primary="handleToastDraft"
        @secondary="handleToastExit"
        @close="handleCloseToast"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Stepper, { type StepperStep } from "@/components/atoms/Stepper.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import Input from "@/components/atoms/Input.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Empty from "@/components/atoms/Empty.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Toast from "@/components/atoms/Toast.vue";
import { useTablePagination } from "@/composables/useTablePagination";

interface ProgressStage {
  name: string;
  status: "completed" | "current" | "pending";
  statusText: string;
  reviewDate: string;
  reviewTime: string;
  hasDetails: boolean;
  hasSubStages: boolean;
  isExpanded: boolean;
  subStages?: StepperStep[];
}

const tabs = [
  { label: "案件資訊", value: "info" },
  { label: "案件進度", value: "progress" },
  { label: "專案檔案", value: "files" },
];

const activeTab = ref(0);
const isDrawerOpen = ref(false);
type DrawerMode = "officerList" | "editInfo";
const drawerMode = ref<DrawerMode>("officerList");
const drawerTitle = computed(() => (drawerMode.value === "officerList" ? "編輯幹事名單" : "編輯案件資訊"));
const isAdminUser = computed(() => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return false;
  try {
    const user = JSON.parse(userInfo);
    return user.role === "admin";
  } catch {
    return false;
  }
});

const getTabClass = (index: number): string => {
  const isActive = index === activeTab.value;
  const baseClasses = ["flex flex-1 flex-col items-center justify-center p-4 transition-colors"];

  if (isActive) {
    baseClasses.push("bg-indigo-50 border-l border-r border-t border-primary-500 rounded-tl-lg rounded-tr-lg");
  } else {
    baseClasses.push("bg-gray-50 border-b border-primary-600");
  }

  return baseClasses.join(" ");
};

const getTabTextClass = (index: number): string => {
  const isActive = index === activeTab.value;
  return isActive ? "text-base font-medium text-primary-500" : "text-base font-medium text-gray-500";
};

const handleTabClick = (index: number) => {
  activeTab.value = index;
};

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleCardClick = (cardType: string) => {
  console.log("Card clicked:", cardType);
  // TODO: Navigate to respective pages
};

// Progress Stages Data
const progressStages = ref<ProgressStage[]>([
  {
    name: "最終核定",
    status: "pending",
    statusText: "未開始",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: false,
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
    subStages: [
      {
        title: "階段開放",
        status: "completed",
      },
      {
        title: "審查中",
        status: "current",
      },
      {
        title: "召開會議",
        status: "pending",
      },
      {
        title: "函發會議記錄",
        status: "pending",
      },
      {
        title: "已完成",
        status: "pending",
      },
    ] as StepperStep[],
  },
  {
    name: "專案小組",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: false,
    isExpanded: false,
  },
  {
    name: "都更幹事會",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: false,
    isExpanded: false,
  },
  {
    name: "公辦公聽會",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: false,
    isExpanded: false,
  },
  {
    name: "案件申請",
    status: "completed",
    statusText: "已完成",
    reviewDate: "114/10/01",
    reviewTime: "16:00",
    hasDetails: true,
    hasSubStages: false,
    isExpanded: false,
  },
]);

const getStageIconClass = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-primary-500";
    case "current":
      return "bg-primary-500";
    case "pending":
    default:
      return "border-2 border-primary-500 bg-white";
  }
};

const getSubStageIconClass = (status?: string): string => {
  switch (status) {
    case "completed":
      return "bg-primary-500";
    case "current":
      return "bg-primary-500";
    case "pending":
    default:
      return "border-2 border-primary-500 bg-white";
  }
};

const getStatusBadgeVariant = (status: string): "success" | "primary" | "gray" => {
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

const handleViewDetails = (index: number) => {
  console.log("View details for stage:", index);
  // TODO: Navigate to details page or show modal
};

// Progress Table Columns
const progressTableColumns: TableColumn[] = [
  { key: "stageName", label: "案件階段" },
  { key: "status", label: "階段狀態" },
  { key: "reviewDate", label: "審議日期" },
  { key: "reviewTime", label: "審議時間" },
  { key: "action", label: "操作" },
];

// Convert progressStages to table rows format
const progressTableRows = computed(() => {
  return progressStages.value.map((stage) => ({
    ...stage,
    stageName: stage.name, // Map name to stageName for the column key
  }));
});

// Project Files Tab Data
interface ProjectFile {
  fileName: string;
  uploadTime: string;
  caseStage: string;
  fileSize: string;
}

const selectedFileStage = ref<string>("全部案件階段");
const fileStageOptions: DropdownItem[] = [
  { label: "全部案件階段", value: "全部案件階段" },
  { label: "案件申請", value: "案件申請" },
  { label: "公辦公聽會", value: "公辦公聽會" },
  { label: "都更幹事會", value: "都更幹事會" },
  { label: "專案小組", value: "專案小組" },
  { label: "都更大會", value: "都更大會" },
  { label: "最終核定", value: "最終核定" },
];

const allFiles = ref<ProjectFile[]>([
  {
    fileName: "小組審查文件.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileSize: "967 KB",
  },
  {
    fileName: "專家小組審查文檔內部研討第一期專案會議.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileSize: "967 KB",
  },
  {
    fileName: "專家小組審查文檔內部研討第一期專案會議.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileSize: "967 KB",
  },
  {
    fileName: "都更幹事會開會通知單.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更幹事會",
    fileSize: "25 KB",
  },
  {
    fileName: "公辦公聽會會議記錄.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "公辦公聽會",
    fileSize: "107 KB",
  },
  {
    fileName: "公辦公聽會開會通知單.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "公辦公聽會",
    fileSize: "107 KB",
  },
]);

const fileTableColumns: TableColumn[] = [
  {
    key: "fileName",
    label: "檔案名稱",
    headerClass: "w-auto",
    sortable: true,
  },
  {
    key: "uploadTime",
    label: "上傳時間",
    headerClass: "w-[200px]",
    sortable: true,
  },
  {
    key: "caseStage",
    label: "案件階段",
    headerClass: "w-[140px]",
    sortable: true,
  },
  {
    key: "fileSize",
    label: "檔案大小",
    headerClass: "w-[100px]",
    sortable: true,
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[60px]",
  },
];

const filePageSize = ref(10);

const filteredFiles = computed(() => {
  let files = [...allFiles.value];
  if (selectedFileStage.value && selectedFileStage.value !== "全部案件階段") {
    files = files.filter((file) => file.caseStage === selectedFileStage.value);
  }
  return files;
});

const {
  paginatedRows: paginatedFiles,
  pagination: filePagination,
  handlePageChange: handleFilePageChange,
  resetPage: resetFilePage,
} = useTablePagination({
  rows: filteredFiles,
  pageSize: filePageSize,
});

const handleFileStageChange = (item: DropdownItem) => {
  selectedFileStage.value = item.value || "全部案件階段";
  resetFilePage(); // Reset to first page when filter changes
};

const handleFileDownload = (file: Record<string, any>) => {
  console.log("Download file:", file);
  // TODO: Implement file download logic
};

const editForm = ref({
  caseNumber: "abc13456788999",
  applyDate: "114/10/20",
  applicantName: "陳傑瑞",
  phone: "0933123123",
  address: "台中市文心路二段588號",
  email: "abc@gmail.com",
});
const showCancelToast = ref(false);
const drawerWidth = ref<"sm" | "md" | "lg" | "xl">("xl");
const drawerWidthPx = computed(() => {
  const widths: Record<"sm" | "md" | "lg" | "xl", number> = {
    sm: 256,
    md: 320,
    lg: 384,
    xl: 460,
  };
  return widths[drawerWidth.value];
});
const toastPositionStyle = computed(() => {
  if (!isDrawerOpen.value) {
    return {
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(900px, calc(100vw - 2rem))",
      maxWidth: "min(900px, calc(100vw - 2rem))",
      minWidth: "min(900px, calc(100vw - 2rem))",
    };
  }
  const width = `min(900px, calc(100vw - ${drawerWidthPx.value}px - 2rem))`;
  return {
    left: `max(1rem, calc((100vw - ${drawerWidthPx.value}px) / 2))`,
    transform: "translateX(-50%)",
    width,
    maxWidth: width,
    minWidth: width,
  };
});

interface OfficerItem {
  selectedOfficer: string;
}

const officerList = ref<OfficerItem[]>(
  Array.from({ length: 5 }, () => ({
    selectedOfficer: "",
  }))
);

const allAvailableOfficers: InputDropdownItem[] = [{ label: "陳傑瑞" }, { label: "張森" }, { label: "吳偉翔" }, { label: "林美華" }, { label: "王小明" }, { label: "李大同" }];

const getAvailableOfficersForIndex = (index: number) => {
  const selectedOfficers = officerList.value.map((o, i) => (i !== index ? o.selectedOfficer : "")).filter((o) => o !== "");
  return allAvailableOfficers.filter((officer) => !selectedOfficers.includes(officer.label));
};

const handleImportOfficerList = () => {
  drawerMode.value = "officerList";
  isDrawerOpen.value = true;
};

const handleDrawerClose = () => {
  isDrawerOpen.value = false;
};

const openEditInfoDrawer = () => {
  drawerMode.value = "editInfo";
  isDrawerOpen.value = true;
};

const handleOfficerSelect = (index: number, item: InputDropdownItem) => {
  officerList.value[index].selectedOfficer = item.label;
};

const handleRemoveOfficer = (index: number) => {
  officerList.value[index].selectedOfficer = "";
};

const handleAddNewOfficer = () => {
  officerList.value.push({
    selectedOfficer: "",
  });
};

const handleCancel = () => {
  isDrawerOpen.value = false;
};

const handleSave = () => {
  console.log("Save officer list:", officerList.value);
  isDrawerOpen.value = false;
};

const handleEditCancel = () => {
  showCancelToast.value = true;
};

const handleEditSave = () => {
  console.log("Save case info:", editForm.value);
  isDrawerOpen.value = false;
};

const handleCloseToast = () => {
  showCancelToast.value = false;
};

const handleToastExit = () => {
  handleCloseToast();
  isDrawerOpen.value = false;
};

const handleToastDraft = () => {
  handleCloseToast();
  handleEditSave();
};
</script>

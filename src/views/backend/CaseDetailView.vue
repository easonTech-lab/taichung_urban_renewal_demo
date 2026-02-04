<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <div class="flex items-center justify-between gap-6">
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
          <ButtonCTA v-if="isAdminUser" variant="red-outline" size="l" class="flex items-center gap-2 !min-w-0" @click="handleDeleteCase">刪除案件</ButtonCTA>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex items-center overflow-hidden rounded-t-lg">
        <button v-for="(tab, index) in tabs" :key="index" :class="getTabClass(index)" @click="handleTabClick(index)">
          <span :class="getTabTextClass(index)">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div :class="activeTab === 'files' ? 'rounded-lg bg-white p-6 shadow-sm' : ''">
        <!-- Case Information Tab -->
        <div v-if="activeTab === 'info'" class="flex flex-col gap-10">
          <!-- Case Basic Information Section -->
          <div class="flex flex-col gap-10 rounded-lg bg-white p-6">
            <!-- Section Title -->
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">案件基本資訊</h2>
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
            <div class="flex gap-5">
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

            <div class="rounded-lg border border-gray-300 bg-white">
              <Table :columns="officerTableColumns" :rows="paginatedOfficerRows" :pagination="officerPagination" @page-change="handleOfficerPageChange">
                <template #cell-index="{ rowIndex }">
                  <p class="text-base text-gray-500">{{ rowIndex + 1 }}</p>
                </template>
                <template #cell-name="{ row }">
                  <div class="flex flex-col gap-1">
                    <p class="text-base text-gray-900">{{ row.name }}</p>
                    <p class="text-base text-gray-500">{{ row.gender }}</p>
                  </div>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center gap-2">
                    <ButtonCTA variant="textPlain" size="sm" left-icon="profileCard" class="p-0" @click.stop="handleOfficerProfile(row)" aria-label="查看委員資料"> </ButtonCTA>
                    <ButtonCTA variant="textPlain" size="sm" class="p-0 text-primary-600" @click.stop="handleOfficerRemove(row)">移除</ButtonCTA>
                  </div>
                </template>
              </Table>
            </div>
          </div>
        </div>

        <!-- Complaints Tab -->
        <div v-if="activeTab === 'complaints'" class="flex flex-col gap-6">
          <div v-for="(section, index) in complaintSections" :key="`${section.title}-${index}`" class="rounded-lg bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-6">
              <div class="flex items-center gap-3">
                <div class="h-7 w-1 rounded bg-primary-600"></div>
                <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ section.title }}</h2>
              </div>
              <ButtonCTA
                variant="outline"
                size="xs"
                left-icon="plus"
                class="!h-9 !min-w-[96px] px-3 py-2 text-sm"
                @click="handleComplaintUpload(section)"
              >
                上傳檔案
              </ButtonCTA>
            </div>
            <div class="mt-6">
              <Table :columns="complaintTableColumns" :rows="section.rows" :show-checkbox="false" :borderless="true" class="shadow-none">
                <template #cell-title="{ row }">
                  <p class="line-clamp-2 text-base text-gray-800">
                    {{ row.title }}
                  </p>
                </template>
                <template #cell-uploadedAt="{ row }">
                  <p class="text-base text-gray-500">
                    {{ row.uploadedAt }}
                  </p>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center gap-4">
                    <button class="flex items-center justify-center text-primary-600" @click.stop="handleComplaintDownload(row)" aria-label="下載檔案">
                      <Icon name="download" :size="24" color="#1C64F2" />
                    </button>
                    <button class="flex items-center justify-center text-primary-600" @click.stop="handleComplaintDelete(row)" aria-label="刪除檔案">
                      <Icon name="trashCan" :size="24" color="#1C64F2" />
                    </button>
                  </div>
                </template>
              </Table>
            </div>
          </div>
        </div>

        <!-- Case Progress Tab -->
        <div v-if="activeTab === 'progress'" class="flex flex-col gap-10">
          <div class="flex items-center justify-between gap-6">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">案件各階段進度</h2>
            </div>
            <ButtonCTA v-if="isAdminUser" variant="outline" size="xs" left-icon="editOutline" class="!h-9 !min-w-[96px] px-3 py-2 text-sm">
              編輯階段
            </ButtonCTA>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div class="grid grid-cols-[80px_minmax(200px,1fr)_140px_140px_120px_150px_56px] items-center border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
              <div class="h-[54px]"></div>
              <div class="px-4">案件階段</div>
              <div class="px-4">階段狀態</div>
              <div class="px-4">審議日期</div>
              <div class="px-4">審議時間</div>
              <div class="px-4">操作</div>
              <div class="px-4"></div>
            </div>
            <div class="relative">
              <div class="absolute left-[40px] top-0 h-full w-px bg-gray-200"></div>
              <div v-for="(stage, index) in progressStages" :key="`${stage.name}-${index}`" class="border-b border-gray-200">
                <div class="grid h-20 grid-cols-[80px_minmax(200px,1fr)_140px_140px_120px_150px_56px] items-center">
                  <div class="flex items-center justify-center">
                    <div :class="['relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2', getStageIconClass(stage.status)]">
                      <Icon v-if="stage.status === 'completed'" name="check" :size="16" color="#ffffff" />
                      <div v-else-if="stage.status === 'current'" class="h-3 w-3 rounded-full bg-primary-500"></div>
                    </div>
                  </div>
                  <div class="px-4 text-base font-medium text-gray-900">
                    {{ stage.name }}
                  </div>
                  <div class="px-4">
                    <Badge :variant="getStatusBadgeVariant(stage.status)" :text="stage.statusText" />
                  </div>
                  <div class="px-4 text-base text-gray-500">{{ stage.reviewDate }}</div>
                  <div class="px-4 text-base text-gray-500">{{ stage.reviewTime }}</div>
                  <div class="px-4">
                    <button v-if="stage.hasDetails" class="text-base text-primary-600 hover:text-primary-700" @click.stop="handleViewDetails(index)">查看詳細資料</button>
                  </div>
                  <div class="px-4">
                    <button v-if="stage.hasSubStages" class="flex items-center justify-center" @click.stop="toggleStageExpand(index)">
                      <Icon :name="stage.isExpanded ? 'chevronUp' : 'chevronDown'" :size="24" color="#1A56DB" />
                    </button>
                  </div>
                </div>
                <div v-if="stage.isExpanded && stage.subStages && stage.subStages.length > 0" class="bg-blue-50 px-10 py-6">
                  <div class="max-w-[560px]">
                    <Stepper :steps="stage.subStages" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Files Tab -->
        <div v-if="activeTab === 'files'" class="flex flex-col gap-10">
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">專案檔案</h2>
            </div>

            <div class="mt-6 flex flex-col gap-4">
              <Tabs :items="fileTabItems" :model-value="activeFileTab" @tab-click="handleFileTabClick" />
              <div class="flex flex-wrap items-center gap-3">
                <Dropdown :button-text="selectedFileStage" placeholder="全部案件階段" :items="fileStageOptions" @item-click="handleFileStageChange" />
                <Dropdown :button-text="selectedFileCategory" placeholder="檔案類別" :items="fileCategoryOptions" @item-click="handleFileCategoryChange" />
              </div>
            </div>

            <div class="mt-6">
              <Table
                :columns="fileTableColumns"
                :rows="paginatedFiles"
                :pagination="filePagination"
                :borderless="true"
                class="shadow-none"
                @page-change="handleFilePageChange"
              >
                <template #cell-action="{ row }">
                  <div class="flex items-center gap-4">
                    <button class="flex items-center justify-center text-primary-600" @click.stop="handleFileDownload(row)" aria-label="下載檔案">
                      <Icon name="download" :size="24" color="#1C64F2" />
                    </button>
                    <button class="flex items-center justify-center text-primary-600" @click.stop="handleFileDelete(row)" aria-label="刪除檔案">
                      <Icon name="trashCan" :size="24" color="#1C64F2" />
                    </button>
                  </div>
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

    <Modal v-model="showComplaintDeleteModal" size="md" :static="false" :show-close-button="false" close-action="emit" backdrop-class="bg-gray-600/80">
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pt-4">
          <button type="button" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500" @click="handleCloseComplaintDeleteModal" aria-label="關閉">
            <Icon name="close" :size="20" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
          <div class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
            <p class="mb-0">確認刪除檔案</p>
            <p>內容將完全刪除無法復原</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA
            variant="white"
            size="xs"
            class="h-8 w-[120px] border-gray-200 px-3 py-2 text-xs font-medium leading-[1.5] text-gray-800 hover:bg-gray-50"
            @click="handleCloseComplaintDeleteModal"
          >
            取消
          </ButtonCTA>
          <ButtonCTA
            variant="red"
            size="xs"
            class="h-8 w-[120px] bg-red-700 px-3 py-2 text-sm font-medium leading-[1.5] text-white hover:bg-red-800"
            @click="handleConfirmComplaintDelete"
          >
            刪除
          </ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Stepper, { type StepperStep } from "@/components/atoms/Stepper.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";
import Input from "@/components/atoms/Input.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Drawer from "@/components/atoms/Drawer.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Toast from "@/components/atoms/Toast.vue";
import Modal from "@/components/atoms/Modal.vue";
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

const tabs = computed(() => {
  if (isAdminUser.value) {
    return [
      { label: "案件資訊", value: "info" },
      { label: "人民陳情", value: "complaints" },
      { label: "案件進度", value: "progress" },
      { label: "專案檔案", value: "files" },
    ];
  }
  return [
    { label: "案件資訊", value: "info" },
    { label: "案件進度", value: "progress" },
    { label: "專案檔案", value: "files" },
  ];
});

const activeTab = ref<string>("info");
const activeTabIndex = computed(() => {
  const index = tabs.value.findIndex((tab) => tab.value === activeTab.value);
  return index === -1 ? 0 : index;
});
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
  const isActive = index === activeTabIndex.value;
  const baseClasses = ["flex flex-1 flex-col items-center justify-center p-4 transition-colors"];

  if (isActive) {
    baseClasses.push("bg-indigo-50 border-l border-r border-t border-primary-500 rounded-tl-lg rounded-tr-lg");
  } else {
    baseClasses.push("bg-gray-50 border-b border-primary-600");
  }

  return baseClasses.join(" ");
};

const getTabTextClass = (index: number): string => {
  const isActive = index === activeTabIndex.value;
  return isActive ? "text-base font-medium text-primary-500" : "text-base font-medium text-gray-500";
};

const handleTabClick = (index: number) => {
  activeTab.value = tabs.value[index]?.value || "info";
};

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleCardClick = (cardType: string) => {
  console.log("Card clicked:", cardType);
  // TODO: Navigate to respective pages
};

const handleDeleteCase = () => {
  console.log("Delete case");
  // TODO: Implement delete case logic
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
        title: "申請送出",
        status: "completed",
        description: "已提出申請審查",
        icon: "check",
      },
      {
        title: "審查中",
        status: "completed",
        description: "審核中",
        icon: "check",
      },
      {
        title: "依意見修正補件",
        status: "current",
        description: "申請人上傳意見修正檔件",
        descriptionClass: "text-red-500",
      },
      {
        title: "召開會議",
        status: "pending",
        description: "會議時間 114.10.25",
      },
      {
        title: "函發會議記錄",
        status: "pending",
        description: "會議紀錄",
      },
      {
        title: "已完成",
        status: "pending",
        description: "進入下階段 都更事審會",
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
      return "border-primary-500 bg-primary-500";
    case "current":
      return "border-primary-500 bg-white";
    case "pending":
    default:
      return "border-gray-300 bg-white";
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

interface ComplaintRow {
  title: string;
  uploadedAt: string;
}

interface ComplaintSection {
  title: string;
  rows: ComplaintRow[];
}

const complaintSections = ref<ComplaintSection[]>([
  {
    title: "書面受理資料",
    rows: [
      {
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
  {
    title: "委員會審議紀錄",
    rows: [
      {
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
  {
    title: "人民或團體陳情意見紀錄表",
    rows: [
      {
        title: "台中市行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案-第一次專案意見回饋",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "台中市捷運路線地區申請開發許可細部計畫案",
        uploadedAt: "114/10/12 17:50",
      },
      {
        title: "變更部分細部土地使用分區管制計畫",
        uploadedAt: "114/10/12 17:50",
      },
    ],
  },
]);

const complaintTableColumns: TableColumn[] = [
  {
    key: "title",
    label: "案件名稱",
    headerClass: "w-auto",
    sortable: true,
  },
  {
    key: "uploadedAt",
    label: "上傳時間",
    headerClass: "w-[170px]",
    sortable: true,
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[96px]",
  },
];

// Project Files Tab Data
interface ProjectFile {
  fileName: string;
  uploadTime: string;
  caseStage: string;
  fileCategory: string;
  uploaderType: "全部" | "申請人" | "幹事" | "承辦";
  fileSize: string;
}

const fileTabItems: TabItem[] = [{ label: "全部" }, { label: "申請人" }, { label: "幹事" }, { label: "承辦" }];
const activeFileTab = ref(0);

const selectedFileStage = ref<string>("全部案件階段");
const selectedFileCategory = ref<string>("檔案類別");
const fileStageOptions: DropdownItem[] = [
  { label: "全部案件階段", value: "全部案件階段" },
  { label: "案件申請", value: "案件申請" },
  { label: "公辦公聽會", value: "公辦公聽會" },
  { label: "都更幹事會", value: "都更幹事會" },
  { label: "專案小組", value: "專案小組" },
  { label: "都更大會", value: "都更大會" },
  { label: "最終核定", value: "最終核定" },
];
const fileCategoryOptions: DropdownItem[] = [
  { label: "檔案類別", value: "檔案類別" },
  { label: "申請人上傳", value: "申請人上傳" },
  { label: "幹事上傳", value: "幹事上傳" },
  { label: "承辦上傳", value: "承辦上傳" },
];

const allFiles = ref<ProjectFile[]>([
  {
    fileName: "小組審查文件.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileCategory: "申請人上傳",
    uploaderType: "申請人",
    fileSize: "967 KB",
  },
  {
    fileName: "專家小組審查文檔內部研討第一期專案會議.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileCategory: "幹事上傳",
    uploaderType: "幹事",
    fileSize: "967 KB",
  },
  {
    fileName: "專家小組審查文檔內部研討第一期專案會議.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更大會",
    fileCategory: "幹事上傳",
    uploaderType: "幹事",
    fileSize: "967 KB",
  },
  {
    fileName: "都更幹事會開會通知單.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "都更幹事會",
    fileCategory: "承辦上傳",
    uploaderType: "承辦",
    fileSize: "25 KB",
  },
  {
    fileName: "公辦公聽會會議記錄.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "公辦公聽會",
    fileCategory: "承辦上傳",
    uploaderType: "承辦",
    fileSize: "107 KB",
  },
  {
    fileName: "公辦公聽會開會通知單.pdf",
    uploadTime: "114/10/12 17:50",
    caseStage: "公辦公聽會",
    fileCategory: "承辦上傳",
    uploaderType: "承辦",
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
    headerClass: "w-[115px]",
    sortable: true,
  },
  {
    key: "fileCategory",
    label: "檔案類別",
    headerClass: "w-[125px]",
  },
  {
    key: "fileSize",
    label: "檔案大小",
    headerClass: "w-[108px]",
    sortable: true,
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[80px]",
  },
];

const filePageSize = ref(10);

const filteredFiles = computed(() => {
  let files = [...allFiles.value];
  const activeUploader = fileTabItems[activeFileTab.value]?.label;
  if (activeUploader && activeUploader !== "全部") {
    files = files.filter((file) => file.uploaderType === activeUploader);
  }
  if (selectedFileStage.value && selectedFileStage.value !== "全部案件階段") {
    files = files.filter((file) => file.caseStage === selectedFileStage.value);
  }
  if (selectedFileCategory.value && selectedFileCategory.value !== "檔案類別") {
    files = files.filter((file) => file.fileCategory === selectedFileCategory.value);
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

const handleFileCategoryChange = (item: DropdownItem) => {
  selectedFileCategory.value = item.value || "檔案類別";
  resetFilePage();
};

const handleFileTabClick = (index: number) => {
  activeFileTab.value = index;
  resetFilePage();
};

const handleFileDownload = (file: Record<string, any>) => {
  console.log("Download file:", file);
  // TODO: Implement file download logic
};

const handleFileDelete = (file: Record<string, any>) => {
  console.log("Delete file:", file);
  // TODO: Implement delete logic
};

const handleComplaintUpload = (section: ComplaintSection) => {
  console.log("Upload complaint file for:", section.title);
  // TODO: Implement upload handler
};

const handleComplaintDownload = (row: Record<string, any>) => {
  const item = row as ComplaintRow;
  console.log("Download complaint file:", item);
  // TODO: Implement download handler
};

const handleComplaintDelete = (row: Record<string, any>) => {
  const item = row as ComplaintRow;
  console.log("Delete complaint file:", item);
  selectedComplaintRow.value = item;
  showComplaintDeleteModal.value = true;
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

interface OfficerTableRow {
  name: string;
  gender: string;
  title: string;
  background: string;
}

const officerList = ref<OfficerItem[]>(
  Array.from({ length: 5 }, () => ({
    selectedOfficer: "",
  }))
);

const officerTableColumns: TableColumn[] = [
  { key: "index", label: "項次", headerClass: "w-[60px]", cellClass: "w-[60px]" },
  { key: "name", label: "委員姓名", headerClass: "w-[140px]", cellClass: "w-[140px]" },
  { key: "title", label: "現職", headerClass: "w-[220px]", cellClass: "w-[220px]" },
  { key: "background", label: "學經歷" },
  { key: "action", label: "動作", headerClass: "w-[120px]", cellClass: "w-[120px]" },
];

const officerTableRows = ref<OfficerTableRow[]>([
  {
    name: "張泓明",
    gender: "男",
    title: "內政部地政司代理司長",
    background: "日本東京大學地震研究所 博士；銘傳大學都市規劃與防災學 碩士",
  },
  {
    name: "林靖君",
    gender: "女",
    title: "專家委員",
    background: "元智大學化學工程學系；美國奧克拉荷馬州州立大學環境工程碩士",
  },
  {
    name: "郭依佳",
    gender: "女",
    title: "專家委員",
    background: "元智大學化學工程學系；美國奧克拉荷馬州州立大學環境工程碩士",
  },
  {
    name: "朱秀秋",
    gender: "女",
    title: "中山大學公共事務管理研究所教授兼管理學院副院長",
    background: "美國北卡羅萊納州立大學景觀規劃博士",
  },
  {
    name: "曾彰豪",
    gender: "男",
    title: "逢甲大學土地管理學系副教授",
    background: "國立臺北大學都市計劃研究所博士",
  },
]);

const {
  paginatedRows: paginatedOfficerRows,
  pagination: officerPagination,
  handlePageChange: handleOfficerPageChange,
} = useTablePagination({
  rows: officerTableRows,
  pageSize: 10,
});

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

const handleOfficerProfile = (row: Record<string, any>) => {
  const officerRow = row as OfficerTableRow;
  console.log("Open officer profile:", officerRow);
};

const handleOfficerRemove = (row: Record<string, any>) => {
  const officerRow = row as OfficerTableRow;
  console.log("Remove officer:", officerRow);
};

const showComplaintDeleteModal = ref(false);
const selectedComplaintRow = ref<ComplaintRow | null>(null);

const handleCloseComplaintDeleteModal = () => {
  showComplaintDeleteModal.value = false;
  selectedComplaintRow.value = null;
};

const handleConfirmComplaintDelete = () => {
  if (selectedComplaintRow.value) {
    const targetTitle = selectedComplaintRow.value.title;
    complaintSections.value.forEach((section) => {
      section.rows = section.rows.filter((row) => row.title !== targetTitle);
    });
  }
  handleCloseComplaintDeleteModal();
};
</script>

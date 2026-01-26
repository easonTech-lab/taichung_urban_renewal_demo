<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb :items="breadcrumbItems" />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">都市更新案件</h1>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex items-center overflow-hidden rounded-t-lg">
        <button v-for="(tab, index) in tabs" :key="index" :class="getTabClass(index)" @click="handleTabClick(index)">
          <span :class="getTabTextClass(index)">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <!-- Case Information Tab -->
        <div v-if="activeTab === 0" class="flex flex-col gap-10">
          <!-- Case Basic Information Section -->
          <div class="flex flex-col gap-10">
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
              <button type="button"
                class="flex flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white h-[66px] p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                @click="handleCardClick('application-basic')">
                <span class="text-lg font-bold text-gray-500 leading-[1.3]">申請基本資料</span>
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                  <Icon name="arrowRightOutline" :size="24" color="#6B7280" class="relative z-10" />
                </div>
              </button>

              <!-- Urban Renewal Review Data Form Card -->
              <button type="button"
                class="flex flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white h-[66px] p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                @click="handleCardClick('review-data')">
                <span class="text-lg font-bold text-gray-500 leading-[1.3]">都市更新審議資料表</span>
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                  <Icon name="arrowRightOutline" :size="24" color="#6B7280" class="relative z-10" />
                </div>
              </button>

              <!-- Floor Area Ratio Incentive Card -->
              <button type="button"
                class="flex flex-1 items-center justify-between gap-5 rounded-lg border border-gray-400 bg-white h-[66px] p-5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                @click="handleCardClick('floor-area-ratio')">
                <span class="text-lg font-bold text-gray-500 leading-[1.3]">容積獎勵項目及額度</span>
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                  <Icon name="arrowRightOutline" :size="24" color="#6B7280" class="relative z-10" />
                </div>
              </button>
            </div>
          </div>

          <!-- Review Officer List Section -->
          <div class="flex flex-col gap-10">
            <!-- Section Title -->
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">審查幹事列表</h2>
            </div>

            <!-- Empty State -->
            <div class="rounded-lg bg-white p-6 shadow-sm">
              <Empty type="case" message="尚未導入審查幹事名單" button-text="導入幹事名單" :show-button="true"
                @button-click="handleImportOfficerList" />
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
          <div class="overflow-hidden rounded-lg border border-gray-300 bg-white">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-300 bg-gray-50">
                  <th class="px-4 py-4 text-left text-sm font-medium uppercase text-gray-500">案件階段</th>
                  <th class="px-4 py-4 text-left text-sm font-medium uppercase text-gray-500">階段狀態</th>
                  <th class="px-4 py-4 text-left text-sm font-medium uppercase text-gray-500">審議日期</th>
                  <th class="px-4 py-4 text-left text-sm font-medium uppercase text-gray-500">審議時間</th>
                  <th class="px-4 py-4 text-left text-sm font-medium uppercase text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(stage, index) in progressStages" :key="index">
                  <tr :class="['border-b border-gray-300', stage.isExpanded ? 'bg-blue-50' : 'bg-white']">
                    <!-- Stage Name Column -->
                    <td class="px-4 py-4">
                      <div class="flex items-center gap-4">
                        <!-- Stepper Icon -->
                        <div class="flex h-20 w-[120px] items-center justify-center">
                          <div
                            :class="['flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white', getStageIconClass(stage.status)]">
                            <Icon v-if="stage.status === 'completed'" name="check" :size="20" color="#ffffff" />
                            <div v-else-if="stage.status === 'current'" class="h-4 w-4 rounded-full bg-primary-500">
                            </div>
                            <div v-else class="h-4 w-4 rounded-full border-2 border-primary-500 bg-white"></div>
                          </div>
                        </div>
                        <div>
                          <p class="text-base font-medium text-gray-800">{{ stage.name }}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Stage Status Column -->
                    <td class="px-4 py-4">
                      <Badge :variant="getStatusBadgeVariant(stage.status)" :text="stage.statusText" />
                    </td>

                    <!-- Review Date Column -->
                    <td class="px-4 py-4">
                      <p class="text-base text-gray-500">{{ stage.reviewDate }}</p>
                    </td>

                    <!-- Review Time Column -->
                    <td class="px-4 py-4">
                      <p class="text-base text-gray-500">{{ stage.reviewTime }}</p>
                    </td>

                    <!-- Action Column -->
                    <td class="px-4 py-4">
                      <div class="flex items-center gap-4">
                        <button v-if="stage.hasDetails" class="text-base text-primary-600 hover:text-primary-700"
                          @click="handleViewDetails(index)">
                          查看詳細資料
                        </button>
                        <button v-if="stage.hasSubStages" class="flex items-center justify-center"
                          @click="toggleStageExpand(index)">
                          <Icon :name="stage.isExpanded ? 'chevronUp' : 'chevronDown'" :size="24" color="#1A56DB" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Expanded Sub-stages Row -->
                  <tr v-if="stage.isExpanded && stage.subStages && stage.subStages.length > 0" class="bg-blue-50">
                    <td colspan="5" class="px-4 py-6">
                      <div class="flex gap-4">
                        <!-- Sub-stages Stepper (Vertical Line with Icons) -->
                        <div class="flex w-[120px] flex-col items-center">
                          <div class="relative flex flex-col items-center">
                            <!-- Sub-stage Icons -->
                            <div v-for="(subStage, subIndex) in stage.subStages" :key="subIndex"
                              class="flex flex-col items-center"
                              :class="subIndex < stage.subStages.length - 1 ? 'mb-[52px]' : ''">
                              <!-- Sub-stage Icon -->
                              <div
                                :class="['flex h-[18px] w-[18px] items-center justify-center rounded-full', getSubStageIconClass(subStage.status)]">
                                <Icon v-if="subStage.status === 'completed'" name="check" :size="14" color="#ffffff" />
                                <div v-else-if="subStage.status === 'current'"
                                  class="h-2 w-2 rounded-full bg-primary-500"></div>
                                <div v-else class="h-[18px] w-[18px] rounded-full border-2 border-primary-500 bg-white">
                                </div>
                              </div>
                              <!-- Connecting Line -->
                              <div v-if="subIndex < stage.subStages.length - 1" class="h-[52px] w-0.5 bg-primary-500">
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Sub-stages Content -->
                        <div class="flex-1 space-y-8">
                          <div v-for="(subStage, subIndex) in stage.subStages" :key="subIndex"
                            class="flex items-center">
                            <div class="flex-1">
                              <p
                                :class="['text-base font-medium', subStage.status === 'current' ? 'text-gray-900' : 'text-gray-500']">
                                {{ subStage.title }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
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
              <Dropdown :button-text="selectedFileStage || '案件階段'" :items="fileStageOptions" variant="outline"
                @item-click="handleFileStageChange" />
            </div>

            <!-- File Table -->
            <div class="rounded-lg border border-gray-300 bg-white shadow-sm">
              <Table :columns="fileTableColumns" :rows="paginatedFiles" :pagination="filePagination"
                @page-change="handleFilePageChange">
                <!-- Action -->
                <template #cell-action="{ row }">
                  <button
                    class="flex items-center justify-center text-primary-600 transition-colors hover:text-primary-700"
                    @click.stop="handleFileDownload(row)" aria-label="下載檔案">
                    <Icon name="download" :size="24" color="#1C64F2" />
                  </button>
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb, { type BreadcrumbItem } from "@/components/atoms/Breadcrumb.vue";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Stepper, { type StepperStep } from "@/components/atoms/Stepper.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Empty from "@/components/atoms/Empty.vue";

const route = useRoute();

// 動態麵包屑：根據來源路由或用戶角色判斷
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [{ label: "首頁", to: "/" }];

  // 檢查是否為管理員（從 localStorage 或查詢參數）
  const userInfo = localStorage.getItem("userInfo");
  const isAdmin = userInfo ? JSON.parse(userInfo).role === "admin" : false;

  // 檢查查詢參數中的來源路由
  const fromRoute = route.query.from as string | undefined;
  const isFromAdmin = fromRoute?.includes("-admin") || route.query.admin === "true" || isAdmin;

  if (isFromAdmin) {
    // 管理員版本：案件管理 > 都市更新案件管理 > 案件詳情
    items.push({ label: "案件管理" });
    items.push({ label: "都市更新案件管理", to: "/case-management-admin" });
  } else {
    // 用戶版本：我的案件 > 都市更新案件 > 案件詳情
    items.push({ label: "我的案件" });
    items.push({ label: "都市更新案件", to: "/case-management" });
  }

  items.push({ label: "案件詳情" });
  return items;
});

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

// Project Files Tab Data
interface ProjectFile {
  fileName: string;
  uploadTime: string;
  caseStage: string;
  fileSize: string;
}

const selectedFileStage = ref<string>("");
const fileStageOptions: DropdownItem[] = [
  { label: "全部案件階段", value: "" },
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

const fileCurrentPage = ref(1);
const filePageSize = ref(10);

const filteredFiles = computed(() => {
  let files = [...allFiles.value];
  if (selectedFileStage.value) {
    files = files.filter((file) => file.caseStage === selectedFileStage.value);
  }
  return files;
});

const paginatedFiles = computed(() => {
  const start = (fileCurrentPage.value - 1) * filePageSize.value;
  const end = start + filePageSize.value;
  return filteredFiles.value.slice(start, end);
});

const filePagination = computed<TablePagination>(() => ({
  currentPage: fileCurrentPage.value,
  total: filteredFiles.value.length,
  pageSize: filePageSize.value,
}));

const handleFileStageChange = (item: DropdownItem) => {
  selectedFileStage.value = item.value || "";
  fileCurrentPage.value = 1; // Reset to first page when filter changes
};

const handleFilePageChange = (page: number) => {
  fileCurrentPage.value = page;
};

const handleFileDownload = (file: Record<string, any>) => {
  console.log("Download file:", file);
  // TODO: Implement file download logic
};

const handleImportOfficerList = () => {
  console.log("Import officer list");
  // TODO: Implement import officer list logic
};
</script>

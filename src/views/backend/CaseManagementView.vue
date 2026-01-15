<template>
  <div class="flex min-h-screen flex-col bg-indigo-50">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <SidebarSection @item-select="handleSidebarItemSelect" />

      <!-- Main Content -->
      <div class="flex flex-1 flex-col gap-10 p-10">
        <!-- Breadcrumb and Title -->
        <div class="flex flex-col gap-6">
          <Breadcrumb />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">都市更新案件案件</h1>
        </div>

        <!-- Case List Card -->
        <div class="rounded-lg bg-white px-6 py-6 shadow-sm">
          <!-- Header Section -->
          <div class="mb-6 flex flex-col gap-6">
            <!-- Title and Add Button -->
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div class="h-7 w-1 rounded bg-primary-600"></div>
                  <h2 class="text-2xl font-medium leading-6 text-gray-900">案件列表</h2>
                </div>
                <p class="pl-4 text-xl font-normal leading-5 text-gray-400">都市更新案件列表</p>
              </div>
              <ButtonCTA variant="outline" size="sm" left-icon="plus" type="button" @click="handleAddCase">新增案件</ButtonCTA>
            </div>

            <!-- Filters -->
            <div class="flex items-center gap-4">
              <div class="w-40">
                <Dropdown :button-text="selectedStage || '全部案件階段'" :items="stageOptions" variant="outline" @item-click="handleStageChange" />
              </div>
              <div class="w-40">
                <Dropdown :button-text="selectedStatus || '全部案件狀態'" :items="statusOptions" variant="outline" @item-click="handleStatusChange" />
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-lg border border-gray-300 bg-white">
            <Table :columns="tableColumns" :rows="paginatedCases" :pagination="pagination" @page-change="handlePageChange">
              <!-- Case Number -->
              <template #cell-caseNumber="{ row }">
                <p class="text-base font-normal leading-normal text-gray-900">{{ row.caseNumber }}</p>
              </template>

              <!-- Case Name -->
              <template #cell-caseName="{ row }">
                <p class="text-base font-normal leading-normal text-gray-900">{{ row.caseName }}</p>
              </template>

              <!-- Case Category -->
              <template #cell-caseCategory="{ row }">
                <p class="text-base font-normal leading-normal text-gray-500">{{ row.caseCategory }}</p>
              </template>

              <!-- Case Stage -->
              <template #cell-caseStage="{ row }">
                <p class="text-base font-normal leading-normal text-gray-500">{{ row.caseStage }}</p>
              </template>

              <!-- Case Status -->
              <template #cell-caseStatus="{ row }">
                <Badge :variant="getStatusVariant(row.caseStatus)" :text="row.caseStatus" />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Badge from "@/components/atoms/Badge.vue";

interface CaseItem {
  caseNumber: string;
  caseName: string;
  caseCategory: string;
  caseStage: string;
  caseStatus: "進行中" | "已中斷" | "已完成";
}

// Filter Options
const stageOptions: DropdownItem[] = [
  { label: "全部案件階段" },
  { label: "案件申請" },
  { label: "公辦公聽會" },
  { label: "專案小組" },
  { label: "都更大會" },
];

const statusOptions: DropdownItem[] = [{ label: "全部案件狀態" }, { label: "進行中" }, { label: "已中斷" }, { label: "已完成" }];

// State
const selectedStage = ref<string>("");
const selectedStatus = ref<string>("");
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

// Mock Data
const allCases: CaseItem[] = [
  {
    caseNumber: "B202308220001",
    caseName: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    caseCategory: "都市更新",
    caseStage: "案件申請",
    caseStatus: "進行中",
  },
  {
    caseNumber: "B202308220001",
    caseName: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    caseCategory: "都市更新",
    caseStage: "公辦公聽會",
    caseStatus: "進行中",
  },
  {
    caseNumber: "B202308220001",
    caseName: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    caseCategory: "都市更新",
    caseStage: "專案小組",
    caseStatus: "已中斷",
  },
  {
    caseNumber: "B202308220001",
    caseName: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    caseCategory: "都市更新",
    caseStage: "都更大會",
    caseStatus: "已完成",
  },
  {
    caseNumber: "B202308220001",
    caseName: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    caseCategory: "都市更新",
    caseStage: "都更大會",
    caseStatus: "進行中",
  },
  {
    caseNumber: "B202308220001",
    caseName: "臺中市東區行政段645地號等21筆土地 都市更新事業計畫及權利變換計畫案",
    caseCategory: "都市更新",
    caseStage: "公辦公聽會",
    caseStatus: "進行中",
  },
];

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "caseNumber",
    label: "案件編號",
    headerClass: "bg-gray-50 px-4 py-4 rounded-tl-lg w-[196px]",
    cellClass: "px-4 py-4 w-[196px]",
  },
  {
    key: "caseName",
    label: "案件名稱",
    headerClass: "bg-gray-50 px-4 py-4 w-[375px]",
    cellClass: "px-4 py-4 w-[375px]",
  },
  {
    key: "caseCategory",
    label: "案件類別",
    headerClass: "bg-gray-50 px-4 py-4 w-[140px]",
    cellClass: "px-4 py-4 w-[140px]",
  },
  {
    key: "caseStage",
    label: "案件階段",
    headerClass: "bg-gray-50 px-4 py-4 w-[160px]",
    cellClass: "px-4 py-4 w-[160px]",
  },
  {
    key: "caseStatus",
    label: "案件狀態",
    headerClass: "bg-gray-50 px-4 py-4 rounded-tr-lg",
    cellClass: "px-4 py-4",
  },
];

// Filtered Cases
const filteredCases = computed(() => {
  let cases = [...allCases];

  if (selectedStage.value && selectedStage.value !== "全部案件階段") {
    cases = cases.filter((item) => item.caseStage === selectedStage.value);
  }

  if (selectedStatus.value && selectedStatus.value !== "全部案件狀態") {
    cases = cases.filter((item) => item.caseStatus === selectedStatus.value);
  }

  return cases;
});

// Paginated Cases
const paginatedCases = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCases.value.slice(start, end);
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: filteredCases.value.length,
  pageSize: pageSize.value,
}));

// Status Variant Mapping
const getStatusVariant = (status: string): "primary" | "success" | "danger" => {
  const mapping: Record<string, "primary" | "success" | "danger"> = {
    進行中: "primary",
    已完成: "success",
    已中斷: "danger",
  };
  return mapping[status] || "primary";
};

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleStageChange = (item: DropdownItem) => {
  selectedStage.value = item.label;
  currentPage.value = 1;
};

const handleStatusChange = (item: DropdownItem) => {
  selectedStatus.value = item.label;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleAddCase = () => {
  console.log("Add new case");
  // TODO: Implement add case logic
};
</script>

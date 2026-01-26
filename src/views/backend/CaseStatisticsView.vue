<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
        <!-- Breadcrumb and Title -->
        <div class="flex flex-col gap-6">
          <Breadcrumb />
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">案件統計維護</h1>
        </div>

        <!-- Statistics Table Card -->
        <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
          <!-- Header Section -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">歷年案件統計</h2>
            </div>
            <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddYear">
              新增年度
            </ButtonCTA>
          </div>

          <!-- Tabs and Filters -->
          <div class="flex flex-col gap-6">
            <!-- Tabs -->
            <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />

            <!-- Year Range Filter -->
            <div class="flex items-center gap-2">
              <div class="w-40">
                <Dropdown
                  :button-text="selectedStartYear || '選擇年度區間'"
                  :items="yearOptions"
                  variant="outline"
                  @item-click="handleStartYearChange"
                />
              </div>
              <span class="text-xl font-normal leading-5 text-gray-500">-</span>
              <div class="w-40">
                <Dropdown :button-text="selectedEndYear || '選擇年度區間'" :items="yearOptions" variant="outline" @item-click="handleEndYearChange" />
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-lg border border-gray-300 bg-white">
            <Table :columns="tableColumns" :rows="paginatedStatistics" :pagination="pagination" @page-change="handlePageChange">
              <!-- Index -->
              <template #cell-index="{ row }">
                <p class="text-base text-gray-500">{{ row.index }}</p>
              </template>

              <!-- Year -->
              <template #header-year="{ column }">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium text-gray-500">{{ column.label }}</span>
                  <div class="flex h-3 w-1.5 flex-col items-center justify-center">
                    <svg class="h-1.5 w-1.5" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#9CA3AF" />
                      <path d="M3 12L0.401924 7.5H5.59808L3 12Z" fill="#9CA3AF" />
                    </svg>
                  </div>
                </div>
              </template>
              <template #cell-year="{ row }">
                <p class="text-base text-gray-500">{{ row.year }}</p>
              </template>

              <!-- Case Category -->
              <template #cell-caseCategory="{ row }">
                <p class="text-base text-gray-500">{{ row.caseCategory }}</p>
              </template>

              <!-- Annual Count -->
              <template #cell-annualCount="{ row }">
                <p class="text-base text-gray-900">{{ row.annualCount }}</p>
              </template>

              <!-- Cumulative Count -->
              <template #cell-cumulativeCount="{ row }">
                <p class="text-base text-gray-900">{{ row.cumulativeCount }}</p>
              </template>

              <!-- Growth Rate -->
              <template #cell-growthRate="{ row }">
                <Badge :variant="getGrowthRateVariant(row.growthRate)" :text="row.growthRate" />
              </template>

              <!-- Action -->
              <template #cell-action="{ row }">
                <ButtonCTA variant="text" size="sm" icon-only left-icon="editOutline" @click.stop="handleEdit(row)" aria-label="編輯" />
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Tabs from "@/components/atoms/Tabs.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Badge from "@/components/atoms/Badge.vue";
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

const router = useRouter();

interface StatisticsItem {
  index: number;
  year: string;
  caseCategory: string;
  annualCount: number;
  cumulativeCount: number;
  growthRate: "成長" | "降低" | "持平";
}

// Tabs
const tabItems = [
  { label: "全部", value: "all" },
  { label: "都更案件", value: "urban-renewal" },
  { label: "危老案件", value: "dangerous-building" },
];

const activeTab = ref<number>(0);

// Year Options
const yearOptions: DropdownItem[] = Array.from({ length: 20 }, (_, i) => {
  const year = 114 - i; // 從 114 開始往前推
  return { label: year.toString(), value: year.toString() };
});

// State
const selectedStartYear = ref<string>("");
const selectedEndYear = ref<string>("");
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

// Mock Data
const allStatistics: StatisticsItem[] = [
  { index: 1, year: "114", caseCategory: "都更案件", annualCount: 103, cumulativeCount: 455, growthRate: "降低" },
  { index: 2, year: "114", caseCategory: "危老案件", annualCount: 55, cumulativeCount: 103, growthRate: "降低" },
  { index: 3, year: "113", caseCategory: "都更案件", annualCount: 98, cumulativeCount: 322, growthRate: "成長" },
  { index: 4, year: "113", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 55, growthRate: "成長" },
  { index: 5, year: "112", caseCategory: "都更案件", annualCount: 75, cumulativeCount: 178, growthRate: "降低" },
  { index: 6, year: "112", caseCategory: "都更案件", annualCount: 75, cumulativeCount: 178, growthRate: "持平" },
  { index: 7, year: "112", caseCategory: "都更案件", annualCount: 75, cumulativeCount: 178, growthRate: "持平" },
  { index: 8, year: "112", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 22, growthRate: "成長" },
  { index: 9, year: "112", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 22, growthRate: "持平" },
  { index: 10, year: "112", caseCategory: "危老案件", annualCount: 22, cumulativeCount: 22, growthRate: "持平" },
];

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    headerClass: "w-[60px]",
    cellClass: "w-[60px]",
  },
  {
    key: "year",
    label: "年度",
    headerClass: "w-[100px]",
    cellClass: "w-[100px]",
  },
  {
    key: "caseCategory",
    label: "案件類別",
  },
  {
    key: "annualCount",
    label: "年件數",
    headerClass: "w-[160px]",
    cellClass: "w-[160px]",
  },
  {
    key: "cumulativeCount",
    label: "歷年已累計件數",
    headerClass: "w-[160px]",
    cellClass: "w-[160px]",
  },
  {
    key: "growthRate",
    label: "年成長率",
    headerClass: "w-[160px]",
    cellClass: "w-[160px]",
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[60px]",
    cellClass: "w-[60px]",
  },
];

// Filtered Statistics
const filteredStatistics = computed(() => {
  let stats = [...allStatistics];

  // Filter by tab
  if (activeTab.value === 1) {
    // 都更案件
    stats = stats.filter((item) => item.caseCategory === "都更案件");
  } else if (activeTab.value === 2) {
    // 危老案件
    stats = stats.filter((item) => item.caseCategory === "危老案件");
  }

  // Filter by year range
  if (selectedStartYear.value) {
    stats = stats.filter((item) => parseInt(item.year) >= parseInt(selectedStartYear.value));
  }
  if (selectedEndYear.value) {
    stats = stats.filter((item) => parseInt(item.year) <= parseInt(selectedEndYear.value));
  }

  return stats;
});

// Paginated Statistics
const paginatedStatistics = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredStatistics.value.slice(start, end);
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: filteredStatistics.value.length,
  pageSize: pageSize.value,
}));

// Growth Rate Variant Mapping
const getGrowthRateVariant = (rate: string): "primary" | "success" | "danger" => {
  const mapping: Record<string, "primary" | "success" | "danger"> = {
    成長: "success",
    降低: "danger",
    持平: "primary",
  };
  return mapping[rate] || "primary";
};

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleTabClick = (index: number, item: any, event?: Event) => {
  activeTab.value = index;
  currentPage.value = 1;
};

const handleStartYearChange = (item: DropdownItem) => {
  selectedStartYear.value = item.label;
  currentPage.value = 1;
};

const handleEndYearChange = (item: DropdownItem) => {
  selectedEndYear.value = item.label;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleAddYear = () => {
  router.push("/case-statistics/add");
};

const handleEdit = (row: Record<string, any>) => {
  const item = row as StatisticsItem;
  // 導航到編輯頁面，傳遞案件數據
  router.push({
    path: "/case-statistics/edit",
    query: {
      category: item.caseCategory,
      year: item.year,
      annualCount: item.annualCount.toString(),
    },
  });
};
</script>

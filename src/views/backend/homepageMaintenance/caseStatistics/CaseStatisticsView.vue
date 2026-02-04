<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">案件統計維護</h1>
      </div>
      <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">歷年案件統計</h2>
          </div>
          <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddYear"> 新增年度 </ButtonCTA>
        </div>
        <div class="flex flex-col gap-6">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
          <div class="flex items-center gap-2">
            <Dropdown :button-text="selectedStartYear" placeholder="選擇年度區間" :items="yearOptions" @item-click="handleStartYearChange" />
            <span class="text-xl font-normal leading-5 text-gray-500">-</span>
            <Dropdown :button-text="selectedEndYear" placeholder="選擇年度區間" :items="yearOptions" @item-click="handleEndYearChange" />
          </div>
        </div>
        <div class="rounded-lg border border-gray-300 bg-white">
          <Table :columns="tableColumns" :rows="paginatedStatistics" :pagination="pagination" @page-change="handlePageChange">
            <template #cell-growthRate="{ row }">
              <Badge :variant="getGrowthRateVariant(row.growthRate)" :text="row.growthRate" />
            </template>
            <template #cell-action="{ row }">
              <div class="flex items-center gap-2">
                <ButtonCTA variant="text" size="sm" icon-only left-icon="editOutline" @click.stop="handleEdit(row)" aria-label="編輯" />
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      message="確認刪除此項目"
      description="內容將完全刪除無法復原"
      @confirm="handleConfirmDelete"
      @cancel="handleCloseDeleteModal"
    />

    <div class="fixed bottom-6 z-[90]" :style="deleteToastStyle">
      <Toast v-model="showDeleteToast" :message="toastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Tabs from "@/components/atoms/Tabs.vue";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import Toast from "@/components/atoms/Toast.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import { useTablePagination } from "@/composables/useTablePagination";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import type { CaseStatisticsItem } from "@/types/backend/homepageMaintenance/caseStatistics.d";
const router = useRouter();

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
const pageSize = ref<number>(10);
const showDeleteModal = ref(false);
const pendingDeleteItem = ref<CaseStatisticsItem | null>(null);
const showDeleteToast = ref(false);
const toastMessage = ref("刪除成功");
const deleteToastStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};

// Mock Data
const allStatistics: CaseStatisticsItem[] = [
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
    sortable: true,
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
    headerClass: "w-[96px]",
    cellClass: "w-[96px]",
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

const {
  paginatedRows: paginatedStatistics,
  pagination,
  handlePageChange,
  resetPage,
} = useTablePagination({
  rows: filteredStatistics,
  pageSize,
});

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
  resetPage();
};

const handleStartYearChange = (item: DropdownItem) => {
  selectedStartYear.value = item.label;
  resetPage();
};

const handleEndYearChange = (item: DropdownItem) => {
  selectedEndYear.value = item.label;
  resetPage();
};

const handleAddYear = () => {
  router.push("/case-statistics/add");
};

const handleEdit = (row: Record<string, any>) => {
  const item = row as CaseStatisticsItem;
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

const handleDelete = (row: Record<string, any>) => {
  const item = row as CaseStatisticsItem;
  pendingDeleteItem.value = item;
  showDeleteModal.value = true;
};

const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  pendingDeleteItem.value = null;
};

const handleConfirmDelete = () => {
  if (!pendingDeleteItem.value) return;
  // TODO: Implement delete logic
  console.log("Deleting:", pendingDeleteItem.value);
  handleCloseDeleteModal();
  showDeleteToast.value = true;
};
</script>

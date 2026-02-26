<template>
  <div class="min-h-screen bg-[#f3f5fa]">
    <div class="px-[60px] pb-0 pt-[40px]">
      <Breadcrumb />
    </div>
    <div class="px-[60px] py-[40px]">
      <h1 class="mb-6 text-[30px] font-bold leading-[30px] text-gray-900">審查會議</h1>
      <div class="mb-6 flex flex-col gap-6">
        <Tabs :items="tabItems" v-model="activeTab" @tab-change="handleTabChange" />
        <div class="flex flex-wrap items-center gap-4">
          <Dropdown :items="stageOptions" :button-text="selectedStageText" placeholder="全部案件階段" @item-click="handleStageChange" />
          <DateRangePicker
            v-model="dateRange"
            start-placeholder="選擇起始日期"
            end-placeholder="選擇結束日期"
            separator-text="-"
            :container-class="'flex gap-2 items-center'"
            @range-change="handleDateRangeChange"
          />
          <ButtonCTA variant="primary" @click="handleSearch" class="h-[40px] px-5 py-2.5"> 搜尋 </ButtonCTA>
        </div>
      </div>
      <div v-if="filteredDataAll.length === 0" class="flex items-center justify-center py-16">
        <Empty type="search" message="查無符合條件的會議資料" />
      </div>
      <div v-else class="rounded-lg bg-white p-6 shadow-sm">
        <Table :columns="tableColumns" :rows="filteredData" :pagination="pagination" @page-change="handlePageChange">
          <template #cell-index="{ rowIndex }">
            <p class="font-sans text-base font-normal text-[#6b7280]">
              {{ rowIndex + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
            </p>
          </template>
          <template #cell-agenda="{ row }">
            <p class="line-clamp-2 font-sans text-base font-normal text-[#1f2a37]">
              {{ row.agenda }}
            </p>
          </template>
          <template #cell-action="{ row }">
            <button
              @click="handleDownload(row)"
              class="flex h-10 items-center gap-2 rounded-lg px-0 py-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :aria-label="`下載檔案：${row.agenda}`"
            >
              <span class="font-sans text-sm font-medium text-[#1a56db] underline"> 下載檔案 </span>
              <Icon name="download" class="h-6 w-6" color="#1a56db" aria-hidden="true" />
            </button>
          </template>
        </Table>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import DateRangePicker, { type DateRange } from "@/components/atoms/DateRangePicker.vue";
import type { MeetingItem } from "@/types/frontend/frontend.d";

// Props
const props = withDefaults(
  defineProps<{
    pageSize?: 10 | 20 | 50;
  }>(),
  {
    pageSize: 10,
  }
);

// Tabs
const activeTab = ref(0);
const tabItems: TabItem[] = [{ label: "全部" }, { label: "都更案件" }, { label: "危老案件" }];

// Stage Dropdown
const selectedStage = ref<string>("all");
const stageOptions: DropdownItem[] = [
  { label: "全部案件階段", value: "all" },
  { label: "都更大會", value: "urban-renewal-meeting" },
  { label: "專案小組", value: "project-team" },
  { label: "案件申請", value: "case-application" },
  { label: "公辦公聽會", value: "public-hearing" },
];

const selectedStageText = computed(() => {
  const option = stageOptions.find((opt) => opt.value === selectedStage.value);
  return option?.label || "全部案件階段";
});

// Date Range
const dateRange = ref<DateRange | null>(null);
const appliedDateRange = ref<DateRange | null>(null); // 應用於過濾的日期範圍（點擊搜尋後才應用）

// Table Data
const allData: MeetingItem[] = [
  {
    id: 1,
    agenda: "第657次會議議程",
    stage: "都更大會",
    date: "114/10/30",
    fileUrl: "/files/meeting-657.pdf",
    category: "urban-renewal",
  },
  {
    id: 2,
    agenda: "第76次專案小組會議議程",
    stage: "專案小組",
    date: "114/10/30",
    fileUrl: "/files/meeting-76.pdf",
    category: "all",
  },
  {
    id: 3,
    agenda: "第658次會議議程",
    stage: "都更大會",
    date: "114/10/12",
    fileUrl: "/files/meeting-658.pdf",
    category: "urban-renewal",
  },
  {
    id: 4,
    agenda: "第831次案件申請會議議程",
    stage: "案件申請",
    date: "114/10/12",
    fileUrl: "/files/meeting-831.pdf",
    category: "all",
  },
  {
    id: 5,
    agenda: "第1099次公辦公聽會議議程",
    stage: "公辦公聽會",
    date: "114/10/12",
    fileUrl: "/files/meeting-1099.pdf",
    category: "all",
  },
  {
    id: 6,
    agenda: "第81次專案小組會議議程",
    stage: "專案小組",
    date: "114/10/12",
    fileUrl: "/files/meeting-81.pdf",
    category: "dangerous",
  },
  {
    id: 7,
    agenda: "第622次案件申請會議議程",
    stage: "案件申請",
    date: "114/10/12",
    fileUrl: "/files/meeting-622.pdf",
    category: "urban-renewal",
  },
  {
    id: 8,
    agenda: "第34次專案小組會議議程",
    stage: "專案小組",
    date: "114/10/12",
    fileUrl: "/files/meeting-34.pdf",
    category: "dangerous",
  },
  {
    id: 9,
    agenda: "第73次案件申請會議議程",
    stage: "案件申請",
    date: "114/10/12",
    fileUrl: "/files/meeting-73.pdf",
    category: "all",
  },
  {
    id: 10,
    agenda: "第81次專案小組會議議程",
    stage: "專案小組",
    date: "114/10/12",
    fileUrl: "/files/meeting-81-2.pdf",
    category: "dangerous",
  },
];

// Table Columns（項次 5% / 議程 40% / 案件階段 15% / 會議日期 15% / 動作 10%）
const tableColumns: TableColumn[] = [
  { key: "index", label: "項次", width: "5%" },
  { key: "agenda", label: "議程", width: "40%" },
  { key: "stage", label: "案件階段", width: "15%" },
  { key: "date", label: "會議日期", width: "15%" },
  { key: "action", label: "動作", width: "10%" },
];

// Pagination
const pageSize = computed(() => props.pageSize);

// Filtered Data (before pagination)
const filteredDataAll = computed(() => {
  let data = [...allData];
  // Filter by tab (category)
  if (activeTab.value === 1) {
    // 都更案件
    data = data.filter((item) => item.category === "urban-renewal");
  } else if (activeTab.value === 2) {
    // 危老案件
    data = data.filter((item) => item.category === "dangerous");
  }
  // activeTab.value === 0 means "全部", no filter needed

  // Filter by stage
  if (selectedStage.value !== "all") {
    const stageMap: Record<string, string> = {
      "urban-renewal-meeting": "都更大會",
      "project-team": "專案小組",
      "case-application": "案件申請",
      "public-hearing": "公辦公聽會",
    };
    const stageLabel = stageMap[selectedStage.value];
    if (stageLabel) {
      data = data.filter((item) => item.stage === stageLabel);
    }
  }

  // Filter by date range (only apply when search button is clicked)
  if (appliedDateRange.value && appliedDateRange.value.start && appliedDateRange.value.end) {
    const startDate = new Date(appliedDateRange.value.start);
    const endDate = new Date(appliedDateRange.value.end);
    // 設置結束日期為當天結束時間（23:59:59）
    endDate.setHours(23, 59, 59, 999);

    data = data.filter((item) => {
      // 將日期字串轉換為 Date 對象（格式：114/10/30 -> 2025/10/30）
      const itemDateStr = item.date;
      if (!itemDateStr) return false;

      // 解析民國年格式（114/MM/DD）
      const [year, month, day] = itemDateStr.split("/").map(Number);
      if (!year || !month || !day) return false;

      // 轉換為西元年（民國年 + 1911）
      const adYear = year + 1911;
      const itemDate = new Date(adYear, month - 1, day);

      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  return data;
});

const { currentPage, paginatedRows: filteredData, pagination, handlePageChange: setPage, resetPage } = useTablePagination({
  rows: filteredDataAll,
  pageSize,
});

// Event Handlers
const handleTabChange = (index: number, item: TabItem) => {
  activeTab.value = index;
  resetPage(); // Reset to first page when filter changes
};

const handleStageChange = (item: DropdownItem, index: number) => {
  selectedStage.value = item.value as string;
  resetPage(); // Reset to first page when filter changes
};

const handleDateRangeChange = (range: DateRange | null) => {
  dateRange.value = range;
  resetPage(); // Reset to first page when filter changes
};

const handleSearch = () => {
  // 將當前選擇的日期範圍應用到過濾
  appliedDateRange.value = dateRange.value ? { ...dateRange.value } : null;
  // 重置到第一頁
  resetPage();
  // 滾動到表格頂部
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handlePageChange = (page: number) => {
  setPage(page);
};

const handleDownload = (row: any) => {
  console.log("Download:", row);
  if (row.fileUrl) {
    window.open(row.fileUrl, "_blank");
  }
};
</script>

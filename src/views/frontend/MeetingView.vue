<template>
  <div class="min-h-screen bg-[#f3f5fa]">
    <div class="mx-auto max-w-[1440px] px-4 pt-[88px] pb-[40px] sm:px-6 lg:px-[60px]">
      <!-- Breadcrumb and Title -->
      <div class="mb-10">
        <div class="flex flex-col gap-6">
          <Breadcrumb />
          <h1 class="font-['Noto_Sans_TC:Bold',sans-serif] text-[30px] font-bold leading-[30px] text-[#111928]">審查會議</h1>
        </div>
      </div>

      <!-- Filters and Table -->
      <div class="flex flex-col gap-6">
        <!-- Tabs and Filters -->
        <div class="flex flex-col gap-6">
          <!-- Tabs -->
          <Tabs :items="tabItems" v-model="activeTab" @tab-change="handleTabChange" />

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-4">
            <!-- Stage Dropdown -->
            <Dropdown :items="stageOptions" :button-text="selectedStageText" variant="outline" @item-click="handleStageChange" />

            <!-- Date Range Picker -->
            <DateRangePicker
              v-model="dateRange"
              start-placeholder="選擇起始日期"
              end-placeholder="選擇結束日期"
              separator-text="-"
              :container-class="'flex gap-2 items-center'"
              @range-change="handleDateRangeChange"
            />

            <!-- Search Button -->
            <ButtonCTA variant="primary" @click="handleSearch" class="h-[40px] px-5 py-2.5"> 搜尋 </ButtonCTA>
          </div>
        </div>

        <!-- Table -->
        <div class="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <Table :columns="tableColumns" :rows="filteredData" :pagination="pagination" @page-change="handlePageChange">
            <!-- Index Column -->
            <template #cell-index="{ rowIndex }">
              <p class="font-['Noto_Sans_TC:Regular',sans-serif] text-base font-normal text-[#6b7280]">
                {{ rowIndex + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
              </p>
            </template>

            <!-- Agenda Column -->
            <template #cell-agenda="{ row }">
              <p class="line-clamp-2 font-['Noto_Sans_TC:Regular',sans-serif] text-base font-normal text-[#1f2a37]">
                {{ row.agenda }}
              </p>
            </template>

            <!-- Action Column -->
            <template #cell-action="{ row }">
              <button
                @click="handleDownload(row)"
                class="flex h-10 items-center gap-2 rounded-lg px-0 py-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                :aria-label="`下載檔案：${row.agenda}`"
              >
                <span class="font-['Noto_Sans_TC:Medium',sans-serif] text-sm font-medium text-[#1a56db] underline"> 下載檔案 </span>
                <Icon name="download" class="h-6 w-6" color="#1a56db" aria-hidden="true" />
              </button>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import Tabs, { type TabItem } from "@/components/atoms/Tabs.vue";
import Dropdown from "@/components/atoms/Dropdown.vue";
import type { DropdownItem } from "@/components/atoms/Dropdown.vue";
import DateRangePicker, { type DateRange } from "@/components/atoms/DateRangePicker.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Icon from "@/components/atoms/Icon.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";

// Types
interface MeetingItem {
  id: number;
  agenda: string;
  stage: string;
  date: string;
  fileUrl: string;
  category: "all" | "urban-renewal" | "dangerous";
}

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

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    headerClass: "w-[60px]",
    cellClass: "w-[60px]",
  },
  {
    key: "agenda",
    label: "議程",
  },
  {
    key: "stage",
    label: "案件階段",
    headerClass: "w-[200px]",
    cellClass: "w-[200px]",
  },
  {
    key: "date",
    label: "會議日期",
    headerClass: "w-[200px]",
    cellClass: "w-[200px]",
  },
  {
    key: "action",
    label: "動作",
  },
];

// Pagination
const currentPage = ref(1);
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

  // Filter by date range (if implemented)
  // TODO: Implement date range filtering

  return data;
});

// Paginated Data
const filteredData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredDataAll.value.slice(start, end);
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: filteredDataAll.value.length,
  pageSize: pageSize.value,
}));

// Event Handlers
const handleTabChange = (index: number, item: TabItem) => {
  activeTab.value = index;
  currentPage.value = 1; // Reset to first page when filter changes
};

const handleStageChange = (item: DropdownItem, index: number) => {
  selectedStage.value = item.value as string;
  currentPage.value = 1; // Reset to first page when filter changes
};

const handleDateRangeChange = (range: DateRange | null) => {
  dateRange.value = range;
  currentPage.value = 1; // Reset to first page when filter changes
};

const handleSearch = () => {
  // Trigger search - filters are already applied in computed property
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleDownload = (row: any) => {
  console.log("Download:", row);
  if (row.fileUrl) {
    window.open(row.fileUrl, "_blank");
  }
};
</script>

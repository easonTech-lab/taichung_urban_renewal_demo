<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <!-- Breadcrumb and Title -->
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">下載專區維護</h1>
      </div>

      <!-- Downloads List Card -->
      <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <!-- Header Section -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">下載專區列表</h2>
          </div>
          <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddDownload">
            新增資料下載
          </ButtonCTA>
        </div>

        <!-- Tabs -->
        <div class="flex flex-col gap-4">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        </div>

        <!-- Category Filter -->
        <div class="w-[160px]">
          <Dropdown :button-text="selectedCategory || '全部案件類別'" :items="categoryOptions" variant="outline"
            @item-click="handleCategoryChange" />
        </div>

        <!-- Table -->
        <div class="rounded-lg border border-gray-300 bg-white">
          <Table :columns="tableColumns" :rows="paginatedDownloads" :pagination="pagination"
            @page-change="handlePageChange">
            <!-- Index -->
            <template #cell-index="{ rowIndex }">
              <p class="text-base text-gray-500">{{ (currentPage - 1) * pageSize + rowIndex + 1 }}</p>
            </template>
            <!-- Status -->
            <template #cell-status="{ row }">
              <Switch :model-value="row.status" :show-text="true" on-text="上架" off-text="下架"
                @update:model-value="(value) => handleStatusChange(row, value)" />
            </template>

            <!-- Action -->
            <template #cell-action="{ row }">
              <div class="flex items-center">
                <ButtonCTA variant="textPlain" size="sm" @click.stop="handlePreview(row)">預覽</ButtonCTA>
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)"
                  aria-label="刪除" />
              </div>
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
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Switch from "@/components/atoms/Switch.vue";
import Dropdown from "@/components/atoms/Dropdown.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

interface DownloadItem {
  fileName: string;
  category: string;
  publishDate: string;
  status: boolean; // true = 上架, false = 下架
  tabStatus: "all" | "published" | "draft" | "unpublished";
}

// Tabs
const tabItems = [{ label: "全部" }, { label: "已上架" }, { label: "暫存中" }, { label: "已下架" }];

const activeTab = ref<number>(0);

// State
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const selectedCategory = ref<string>("");

// Category Options
const categoryOptions = [
  { label: "全部案件類別", value: "" },
  { label: "都市更新類", value: "都市更新類" },
  { label: "危老類", value: "危老類" },
  { label: "老舊街區", value: "老舊街區" },
  { label: "整建維護", value: "整建維護" },
];

const handleCategoryChange = (item: { label: string; value?: string }) => {
  selectedCategory.value = item.value || "";
  currentPage.value = 1;
};

// Mock Data (使用 ref 使其響應式)
const allDownloads = ref<DownloadItem[]>([
  {
    fileName: "都市更新申請書範本（含事業計畫書、概要書）",
    category: "都市更新類",
    publishDate: "114/11/09",
    status: true,
    tabStatus: "published",
  },
  {
    fileName: "結構安全性初評申請表",
    category: "危老類",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "老街區認定與補助條件說明文件",
    category: "老舊街區",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "整建維護補助申請表",
    category: "整建維護",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "同意書格式範例（住戶簽署用）",
    category: "都市更新類",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    fileName: "全體同意書格式（危老專用）",
    category: "危老類",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
]);

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    headerClass: "w-[60px]",
    cellClass: "w-[60px]",
  },
  {
    key: "fileName",
    label: "問題",
  },
  {
    key: "category",
    label: "案件類別",
    headerClass: "w-[200px]",
    cellClass: "w-[200px]",
  },
  {
    key: "publishDate",
    label: "發布日期",
    headerClass: "w-[140px]",
    cellClass: "w-[140px]",
    sortable: true,
  },
  {
    key: "status",
    label: "狀態",
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[96px]",
    cellClass: "w-[96px]",
  },
];

// Filtered Downloads
const filteredDownloads = computed(() => {
  let downloads = [...allDownloads.value];

  // Filter by category
  if (selectedCategory.value) {
    downloads = downloads.filter((item) => item.category === selectedCategory.value);
  }

  // Filter by tab
  if (activeTab.value === 1) {
    // 已上架
    downloads = downloads.filter((item) => item.status === true);
  } else if (activeTab.value === 2) {
    // 暫存中
    downloads = downloads.filter((item) => item.tabStatus === "draft");
  } else if (activeTab.value === 3) {
    // 已下架
    downloads = downloads.filter((item) => item.status === false && item.tabStatus === "unpublished");
  }

  return downloads;
});

// 注意：分頁現在由 Table 組件內部處理，所以這裡直接傳遞所有過濾後的數據
const paginatedDownloads = computed(() => {
  return filteredDownloads.value;
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: filteredDownloads.value.length,
  pageSize: pageSize.value,
}));

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleTabClick = (index: number, item: any, event?: Event) => {
  activeTab.value = index;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const router = useRouter();

const handleAddDownload = () => {
  router.push("/downloads-management/add");
};

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as DownloadItem;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // TODO: Implement status change logic
};

const handlePreview = (row: Record<string, any>) => {
  const item = row as DownloadItem;
  console.log("Preview clicked for:", item);
  // TODO: Implement preview logic
};

const handleDelete = (row: Record<string, any>) => {
  const item = row as DownloadItem;
  console.log("Delete clicked for:", item);
  // TODO: Implement delete logic
};
</script>

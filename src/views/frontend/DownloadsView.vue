<template>
  <div class="min-h-screen bg-[#f3f5fa]">
    <div class="px-[60px] pb-0 pt-[40px]">
      <Breadcrumb />
    </div>
    <div class="px-[60px] py-[40px]">
      <h1 class="mb-6 text-[30px] font-bold leading-[30px] text-gray-900">下載專區</h1>
      <div class="mb-6 flex items-center gap-4">
        <div class="w-[160px]">
          <Dropdown :button-text="selectedCategory" placeholder="全部案件類別" :items="categoryItems" @item-click="handleCategoryChange" />
        </div>
        <div class="w-[364px]">
          <SearchInput v-model="searchQuery" placeholder="搜尋" button-text="搜尋" input-variant="gray" container-class="mb-0" @submit="handleSearch" />
        </div>
      </div>
      <div v-if="filteredData.length === 0" class="flex items-center justify-center py-16">
        <Empty type="search" message="查無符合條件的檔案資料" />
      </div>
      <div v-else class="rounded-lg bg-white p-6 shadow-sm">
        <Table :columns="tableColumns" :rows="paginatedRows" :pagination="pagination" @page-change="handlePageChange">
          <!-- 項次欄位 -->
          <template #cell-index="{ rowIndex }">
            {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
          </template>
          <!-- 動作欄位 -->
          <template #cell-action="{ row }">
            <button
              class="flex items-center justify-center text-primary-600 transition-colors hover:text-primary-700"
              :aria-label="`下載檔案：${row.fileName}`"
              @click="handleDownload(row)"
            >
              <span>下載檔案</span>
              <Icon name="download" class="h-6 w-6" aria-hidden="true" />
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
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SearchInput from "@/components/atoms/SearchInput.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import type { DownloadItem } from "@/types/frontend/frontend.d";
// Props
const props = withDefaults(
  defineProps<{
    pageSize?: 10 | 20 | 50;
  }>(),
  {
    pageSize: 10,
  }
);

// 模擬資料
const mockData: DownloadItem[] = [
  {
    fileName: "修正臺中市都市更新事業計畫及權利變換計畫核定後申請變更之審議層級簡化處理方式",
    category: "都市更新類",
    publishDate: "114/11/09",
  },
  {
    fileName: "公告修訂臺中市都市危險及老舊建築物加速重建計畫協議書格式",
    category: "危老類",
    publishDate: "114/10/30",
  },
  {
    fileName: "都市危險及老舊建築物加速重建條例第10條第2款資格認定申請書",
    category: "老舊街區",
    publishDate: "114/10/30",
  },
  {
    fileName: "修正「都市危險及老舊建築物加速重建計畫」申請容積獎勵項目額度及臺中市容積獎勵審查表格式(109.11.12適用)",
    category: "危老類",
    publishDate: "114/10/12",
  },
  {
    fileName: "變更起造人權利聲明書及已核准重建計畫變更起造人申報書",
    category: "危老類",
    publishDate: "114/10/12",
  },
  {
    fileName: "都市更新實施者自行檢核申請容積獎勵值及委員評分表(109.11.5版)",
    category: "都市更新類",
    publishDate: "114/09/26",
  },
  {
    fileName: "臺中市都市更新案件審議收費標準-發布令及條文",
    category: "危老類",
    publishDate: "114/09/23",
  },
  {
    fileName: "都市更新及危老重建資訊公開基本資料同意書",
    category: "整建維護",
    publishDate: "114/08/10",
  },
  {
    fileName: "臺中市都市更新事業概要、事業計畫、權利變換計畫檢核表(110年01月01日)",
    category: "危老類",
    publishDate: "114/08/08",
  },
  {
    fileName: "臺中市都市更新事業概要、事業計畫、權利變換計畫檢核表(108年1月30日起報核)",
    category: "危老類",
    publishDate: "114/08/01",
  },
];

// 重複資料以達到 1000 筆
const allData = Array.from({ length: 100 }, () => mockData).flat();

// Category Dropdown
const categoryItems: DropdownItem[] = [{ label: "全部案件類別" }, { label: "都市更新類" }, { label: "危老類" }, { label: "老舊街區" }, { label: "整建維護" }];

// State
const selectedCategory = ref<string>("");
const searchQuery = ref<string>("");
const appliedSearchQuery = ref<string>(""); // 應用於過濾的搜尋關鍵字（點擊搜尋後才應用）
const pageSize = computed(() => props.pageSize);

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
    label: "文件名稱",
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
  },
  {
    key: "action",
    label: "動作",
  },
];

// 搜索資料
const filteredData = computed(() => {
  let data = [...allData];
  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== "全部案件類別") {
    data = data.filter((item) => item.category === selectedCategory.value);
  }
  // Filter by search query (only apply when search button is clicked)
  if (appliedSearchQuery.value.trim()) {
    const query = appliedSearchQuery.value.toLowerCase();
    data = data.filter((item) => item.fileName.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
  }
  return data;
});

const { currentPage, paginatedRows, pagination, resetPage, handlePageChange: setPage } = useTablePagination({
  rows: filteredData,
  pageSize,
});

// Handlers
const handleCategoryChange = (item: DropdownItem) => {
  selectedCategory.value = item.label;
  resetPage(); // Reset to first page when filter changes
};

const handleSearch = () => {
  // 將當前輸入的搜尋關鍵字應用到過濾
  appliedSearchQuery.value = searchQuery.value;
  resetPage(); // Reset to first page when search
};

// 處理分頁變更
const handlePageChange = (page: number) => {
  setPage(page);
  // Scroll to top of table
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 處理下載動作
const handleDownload = (row: Record<string, any>) => {
  // TODO: Implement actual download logic
  const item = row as DownloadItem;
  console.log("Download:", item);
  // You can use item.fileUrl if available
  if (item.fileUrl) {
    window.open(item.fileUrl, "_blank");
  } else {
    alert(`下載檔案: ${item.fileName}`);
  }
};
</script>

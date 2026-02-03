<template>
  <div class="min-h-screen bg-[#f3f5fa]">
    <div class="px-[60px] pb-0 pt-[40px]">
      <Breadcrumb />
    </div>
    <div class="px-[60px] py-[40px]">
      <h1 class="mb-6 text-[30px] font-bold leading-[30px] text-gray-900">公開消息</h1>
      <div class="mb-6 flex items-center gap-4">
        <div class="w-[364px]">
          <InputDropdown
            :button-text="selectedCategoryText"
            :items="categoryItems"
            placeholder="全部類別"
            variant="outline"
            container-class="w-full"
            :show-label="false"
            @item-click="handleCategoryChange"
          />
        </div>
        <div class="relative w-[364px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
            <Icon name="search" :size="16" class="text-gray-500" aria-hidden="true" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pl-10 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-500 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            @keydown.enter="handleSearch"
          />
        </div>
        <ButtonCTA variant="primary" @click="handleSearch" class="h-[40px] px-5 py-2.5"> 搜尋 </ButtonCTA>
      </div>
      <div v-if="filteredData.length === 0" class="flex items-center justify-center py-16">
        <Empty type="search" message="查無符合條件的公開消息" />
      </div>
      <div v-else class="rounded-lg bg-white p-6 shadow-sm">
        <Table :columns="tableColumns" :rows="paginatedRows" :pagination="pagination" row-clickable @page-change="handlePageChange" @row-click="handleRowClick">
          <template #cell-index="{ rowIndex }">
            {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
          </template>
          <template #cell-title="{ row }">
            <p class="line-clamp-2 text-left text-base text-gray-800">
              {{ row.title }}
            </p>
          </template>
        </Table>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import InputDropdown, { type InputDropdownItem } from "@/components/atoms/InputDropdown.vue";


const router = useRouter();

// 模擬資料
interface NewsItem {
  id: number;
  title: string;
  category: string;
  publishDate: string;
}

const mockData: NewsItem[] = [
  {
    id: 1,
    title: "本處辦理「114年度老屋新用計畫2.0」潭子區老屋第2次進駐者徵選，入選結果公告",
    category: "最新消息",
    publishDate: "114/11/09",
  },
  {
    id: 2,
    title: "臺中市率先完成全市老屋大規模重建計劃領先全台",
    category: "新聞快訊",
    publishDate: "114/10/30",
  },
  {
    id: 3,
    title: "東區分館「台中都市更新大小事」講座",
    category: "活動訊息",
    publishDate: "114/10/30",
  },
  {
    id: 4,
    title: "公告訂定「臺中市免辦建築執照處理原則」，並自即日起生效",
    category: "活動訊息",
    publishDate: "114/10/12",
  },
  {
    id: 5,
    title: "公開閱覽「豐原車站東側豐原區翁明段659地號等12筆土地都市更新事業」公開評選文件",
    category: "最新消息",
    publishDate: "114/10/12",
  },
  {
    id: 6,
    title: "「臺中市新建建築工程工地地下水資源再利用名冊」(114年12月更新)",
    category: "最新消息",
    publishDate: "114/09/26",
  },
  {
    id: 7,
    title: "修正「臺中市政府政策提案景觀提升計畫(第一批)」優先認養標的計畫書",
    category: "活動訊息",
    publishDate: "114/09/23",
  },
  {
    id: 8,
    title: "呼籲本市第四季各類場所應按時辦理建築物公共安全檢查簽證及申報",
    category: "最新消息",
    publishDate: "114/08/10",
  },
  {
    id: 9,
    title: "受理114年度「臺中市都市危險及老舊建築物結構安全性能評估費用」補助申請",
    category: "新聞快訊",
    publishDate: "114/08/08",
  },
  {
    id: 10,
    title: "核定麗嘉建設擔任實施者擬具「臺中市豐原區南村段447地號等20筆土地都市更新事業計畫案」",
    category: "新聞快訊",
    publishDate: "114/08/01",
  },
];

// 重複資料以達到 1000 筆
const allData = Array.from({ length: 100 }, () => mockData).flat();

// Category Dropdown
const categoryItems: InputDropdownItem[] = [{ label: "全部類別" }, { label: "最新消息" }, { label: "新聞快訊" }, { label: "活動訊息" }];

// State
const selectedCategory = ref<string>("");
const selectedCategoryText = ref<string>("全部類別");
const searchQuery = ref<string>("");
const appliedSearchQuery = ref<string>(""); // 應用於過濾的搜尋關鍵字（點擊搜尋後才應用）

// Table Columns
const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "項次",
    headerClass: "w-[60px]",
    cellClass: "w-[60px]",
  },
  {
    key: "title",
    label: "標題",
  },
  {
    key: "category",
    label: "類別",
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
];

// Filtered Data
const filteredData = computed(() => {
  let data = [...allData];
  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== "全部類別") {
    data = data.filter((item) => item.category === selectedCategory.value);
  }
  // Filter by search query (only apply when search button is clicked)
  if (appliedSearchQuery.value.trim()) {
    const query = appliedSearchQuery.value.toLowerCase();
    data = data.filter((item) => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
  }
  return data;
});

const { currentPage, pageSize, paginatedRows, pagination, handlePageChange: setPage, resetPage } = useTablePagination({
  rows: filteredData,
  pageSize: 10,
});

// Handlers
const handleCategoryChange = (item: InputDropdownItem) => {
  selectedCategory.value = item.label === "全部類別" ? "" : item.label;
  selectedCategoryText.value = item.label;
  resetPage(); // Reset to first page when filter changes
};

const handleSearch = () => {
  // 將當前輸入的搜尋關鍵字應用到過濾
  appliedSearchQuery.value = searchQuery.value;
  resetPage(); // Reset to first page when search
};

const handlePageChange = (page: number) => {
  setPage(page);
  // Scroll to top of table
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleTitleClick = (row: Record<string, any>) => {
  // TODO: Navigate to news detail page
  console.log("View news:", row);
  router.push(`/news/${row.id}`);
};

const handleRowClick = (row: Record<string, any>) => {
  handleTitleClick(row);
};
</script>

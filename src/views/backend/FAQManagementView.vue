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
          <h1 class="text-3xl font-bold leading-[30px] text-gray-900">常見問題維護</h1>
        </div>

        <!-- FAQ List Card -->
        <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
          <!-- Header Section -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="h-7 w-1 rounded bg-primary-600"></div>
              <h2 class="text-2xl font-medium leading-6 text-gray-900">常見問題列表</h2>
            </div>
            <button
              class="flex items-center gap-2 rounded-lg border border-primary-700 bg-white px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
              @click="handleAddQuestion"
            >
              <Icon name="plus" :size="16" color="#1A56DB" />
              新增問題
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex flex-col gap-4">
            <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
          </div>

          <!-- Table -->
          <div class="rounded-lg border border-gray-300 bg-white">
            <Table :columns="tableColumns" :rows="paginatedFAQs" :pagination="pagination" @page-change="handlePageChange">
              <!-- Index -->
              <template #cell-index="{ row }">
                <p class="text-base text-gray-500">{{ row.index }}</p>
              </template>

              <!-- Question -->
              <template #cell-question="{ row }">
                <p class="text-base text-gray-900">{{ row.question }}</p>
              </template>

              <!-- Category -->
              <template #cell-category="{ row }">
                <p class="text-base text-gray-500">{{ row.category }}</p>
              </template>

              <!-- Publish Date -->
              <template #header-publishDate="{ column }">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium uppercase text-gray-500">{{ column.label }}</span>
                  <div class="flex h-3 w-1.5 flex-col items-center justify-center">
                    <svg class="h-1.5 w-1.5" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#9CA3AF" />
                      <path d="M3 12L0.401924 7.5H5.59808L3 12Z" fill="#9CA3AF" />
                    </svg>
                  </div>
                </div>
              </template>
              <template #cell-publishDate="{ row }">
                <p class="text-base text-gray-500">{{ row.publishDate }}</p>
              </template>

              <!-- Status -->
              <template #cell-status="{ row }">
                <Switch
                  :model-value="row.status"
                  :show-text="true"
                  on-text="上架"
                  off-text="下架"
                  @update:model-value="(value) => handleStatusChange(row, value)"
                />
              </template>

              <!-- Action -->
              <template #cell-action="{ row }">
                <div class="flex items-center gap-4">
                  <button
                    class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                    @click.stop="handlePreview(row)"
                  >
                    預覽
                  </button>
                  <button
                    class="flex items-center justify-center text-primary-600 transition-colors hover:text-primary-700"
                    @click.stop="handleDelete(row)"
                    aria-label="刪除"
                  >
                    <Icon name="link" :size="24" color="#1C64F2" />
                  </button>
                </div>
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
import Tabs from "@/components/atoms/Tabs.vue";
import Table, { type TableColumn, type TablePagination } from "@/components/atoms/Table.vue";
import Switch from "@/components/atoms/Switch.vue";
import Icon from "@/components/atoms/Icon.vue";

interface FAQItem {
  index: number;
  question: string;
  category: string;
  publishDate: string;
  status: boolean; // true = 上架, false = 下架
  tabStatus: "all" | "published" | "draft" | "unpublished";
}

// Tabs
const tabItems = [
  { label: "全部" },
  { label: "已上架" },
  { label: "暫存中" },
  { label: "已下架" },
];

const activeTab = ref<number>(0);

// State
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

// Mock Data (使用 ref 使其響應式)
const allFAQs = ref<FAQItem[]>([
  {
    index: 1,
    question: "都更、危老、整建維護差在哪？",
    category: "我適合哪種重建方式？",
    publishDate: "114/11/09",
    status: true,
    tabStatus: "published",
  },
  {
    index: 2,
    question: "房子幾歲了才算老？該選哪一種方式？",
    category: "我適合哪種重建方式？",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 3,
    question: "需要準備什麼資料、文件？",
    category: "要怎麼申請？需要準備什麼？",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 4,
    question: "同意比例要多少才可以啟動？",
    category: "要怎麼申請？需要準備什麼？",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 5,
    question: "危老可以拿到多少容積獎勵？",
    category: "有什麼補助或政府協助？",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 6,
    question: "有沒有免費顧問或推動師可協助？",
    category: "有什麼補助或政府協助？",
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
    key: "question",
    label: "問題",
  },
  {
    key: "category",
    label: "類別",
    headerClass: "w-[240px]",
    cellClass: "w-[240px]",
  },
  {
    key: "publishDate",
    label: "發布日期",
    headerClass: "w-[140px]",
    cellClass: "w-[140px]",
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

// Filtered FAQs
const filteredFAQs = computed(() => {
  let faqs = [...allFAQs.value];

  // Filter by tab
  if (activeTab.value === 1) {
    // 已上架
    faqs = faqs.filter((item) => item.status === true);
  } else if (activeTab.value === 2) {
    // 暫存中
    faqs = faqs.filter((item) => item.tabStatus === "draft");
  } else if (activeTab.value === 3) {
    // 已下架
    faqs = faqs.filter((item) => item.status === false && item.tabStatus === "unpublished");
  }

  return faqs;
});

// Paginated FAQs
const paginatedFAQs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFAQs.value.slice(start, end);
});

// Pagination
const pagination = computed<TablePagination>(() => ({
  currentPage: currentPage.value,
  total: filteredFAQs.value.length,
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

const handleAddQuestion = () => {
  console.log("Add question clicked");
  // TODO: Implement add question logic
};

const handleStatusChange = (row: FAQItem, value: boolean) => {
  row.status = value;
  console.log("Status changed for:", row, "New status:", value);
  // TODO: Implement status change logic
};

const handlePreview = (row: FAQItem) => {
  console.log("Preview clicked for:", row);
  // TODO: Implement preview logic
};

const handleDelete = (row: FAQItem) => {
  console.log("Delete clicked for:", row);
  // TODO: Implement delete logic
};
</script>

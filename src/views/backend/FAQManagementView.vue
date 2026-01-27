<template>
  <div class="min-h-screen bg-indigo-50">
    <!-- Sidebar -->
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <!-- Main Content -->
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
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
          <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddQuestion"> 新增問題 </ButtonCTA>
        </div>

        <!-- Tabs -->
        <div class="flex flex-col gap-4">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        </div>

        <!-- Table -->
        <div class="rounded-lg border border-gray-300 bg-white">
          <Table :columns="tableColumns" :rows="paginatedFAQs" :pagination="pagination" @page-change="handlePageChange">
            <!-- Status -->
            <template #cell-status="{ row }">
              <Switch :model-value="row.status" :show-text="true" on-text="上架" off-text="下架" @update:model-value="(value) => handleStatusChange(row, value)" />
            </template>

            <!-- Action -->
            <template #cell-action="{ row }">
              <div class="flex items-center">
                <ButtonCTA variant="textPlain" size="sm" @click.stop="handlePreview(row)"> 預覽 </ButtonCTA>
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
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
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";

interface FAQItem {
  index: number;
  question: string;
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

const router = useRouter();

const handleAddQuestion = () => {
  router.push("/faq-management/add");
};

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as FAQItem;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // TODO: Implement status change logic
};

const handlePreview = (row: Record<string, any>) => {
  const item = row as FAQItem;
  console.log("Preview clicked for:", item);
  // TODO: Implement preview logic
};

const handleDelete = (row: Record<string, any>) => {
  const item = row as FAQItem;
  console.log("Delete clicked for:", item);
  // TODO: Implement delete logic
};
</script>

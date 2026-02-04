<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">常見問題維護</h1>
      </div>
      <div class="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-7 w-1 rounded bg-primary-600"></div>
            <h2 class="text-2xl font-medium leading-6 text-gray-900">常見問題列表</h2>
          </div>
          <ButtonCTA variant="outline" size="sm" left-icon="plus" @click="handleAddQuestion"> 新增問題 </ButtonCTA>
        </div>
        <div class="flex flex-col gap-4">
          <Tabs :items="tabItems" :model-value="activeTab" @tab-click="handleTabClick" />
        </div>
        <div class="rounded-lg border border-gray-300 bg-white">
          <Table
            :columns="tableColumns"
            :rows="paginatedFAQs"
            :pagination="pagination"
            :row-clickable="true"
            @row-click="handleRowClick"
            @page-change="handlePageChange"
          >
            <template #cell-status="{ row }">
              <Switch :model-value="row.status" :show-text="true" on-text="上架" off-text="下架" @update:model-value="(value) => handleStatusChange(row, value)" />
            </template>
            <template #cell-action="{ row }">
              <div class="flex items-center gap-2">
                <ButtonCTA variant="textPlain" size="sm" @click.stop="handlePreview(row)"> 預覽 </ButtonCTA>
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <Modal
      v-model="showDeleteModal"
      size="md"
      :static="false"
      :show-close-button="false"
      close-action="emit"
      backdrop-class="bg-gray-600/80"
    >
      <template #header>
        <div class="flex w-full items-center justify-end px-4 pt-4">
          <button type="button" class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500" @click="handleCloseDeleteModal" aria-label="關閉">
            <Icon name="close" :size="20" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex w-full flex-col items-center gap-4 px-6 py-5">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">!</div>
          <div class="w-[311px] text-center text-base font-normal leading-[1.5] text-gray-600">
            <p class="mb-0">確認刪除此項目</p>
            <p>內容將完全刪除無法復原</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-center gap-4 px-6 pb-6 pt-0">
          <ButtonCTA
            variant="white"
            size="xs"
            class="h-8 w-[120px] border-gray-200 px-3 py-2 text-xs font-medium leading-[1.5] text-gray-800 hover:bg-gray-50"
            @click="handleCloseDeleteModal"
          >
            取消
          </ButtonCTA>
          <ButtonCTA
            variant="red"
            size="xs"
            class="h-8 w-[120px] bg-red-700 px-3 py-2 text-sm font-medium leading-[1.5] text-white hover:bg-red-800"
            @click="handleConfirmDelete"
          >
            確認
          </ButtonCTA>
        </div>
      </template>
    </Modal>

    <div class="fixed bottom-6 z-[90]" :style="toastStyle">
      <Toast v-model="showSuccessToast" :message="toastMessage" :show-actions="false" :show-close="false" :auto-close="true">
        <template #icon>
          <Icon name="check" :size="24" class="text-gray-50" aria-hidden="true" />
        </template>
      </Toast>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import Tabs from "@/components/atoms/Tabs.vue";
import Icon from "@/components/atoms/Icon.vue";
import Modal from "@/components/atoms/Modal.vue";
import Toast from "@/components/atoms/Toast.vue";
import Switch from "@/components/atoms/Switch.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import type { FaqItem } from "@/types/backend/homepageMaintenance/faqManagement.d";

// Tabs
const tabItems = [{ label: "全部" }, { label: "已上架" }, { label: "暫存中" }, { label: "已下架" }];

const activeTab = ref<number>(0);

// State
const pageSize = ref<number>(10);
const showSuccessToast = ref(false);
const toastMessage = ref("新增成功");
const toastStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(1420px, calc(100vw - 2rem))",
  maxWidth: "min(1420px, calc(100vw - 2rem))",
  minWidth: "min(1420px, calc(100vw - 2rem))",
};

// Mock Data (使用 ref 使其響應式)
const allFAQs = ref<FaqItem[]>([
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

const { paginatedRows: paginatedFAQs, pagination, handlePageChange, resetPage } = useTablePagination({
  rows: filteredFAQs,
  pageSize,
});

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};

const handleTabClick = (index: number, item: any, event?: Event) => {
  activeTab.value = index;
  resetPage();
};

const router = useRouter();
const route = useRoute();
const showDeleteModal = ref(false);
const deleteTarget = ref<FaqItem | null>(null);

const handleAddQuestion = () => {
  router.push("/faq-management/add");
};

const handleStatusChange = (row: Record<string, any>, value: boolean) => {
  const item = row as FaqItem;
  item.status = value;
  console.log("Status changed for:", item, "New status:", value);
  // TODO: Implement status change logic
};

const handlePreview = (row: Record<string, any>) => {
  const item = row as FaqItem;
  console.log("Preview clicked for:", item);
  // TODO: Implement preview logic
};

const handleRowClick = (row: Record<string, any>) => {
  const item = row as FaqItem;
  router.push({
    path: "/faq-management/add",
    query: {
      edit: "true",
      title: item.question,
      category: item.category,
      answer: "",
    },
  });
};

const handleDelete = (row: Record<string, any>) => {
  const item = row as FaqItem;
  console.log("Delete clicked for:", item);
  deleteTarget.value = item;
  showDeleteModal.value = true;
};

const handleCloseDeleteModal = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};

const handleConfirmDelete = () => {
  if (deleteTarget.value) {
    allFAQs.value = allFAQs.value.filter((item) => item.index !== deleteTarget.value?.index);
  }
  handleCloseDeleteModal();
  toastMessage.value = "刪除成功";
  showSuccessToast.value = true;
};

const maybeShowReturnToast = () => {
  const toastType = route.query.toast as string | undefined;
  if (toastType !== "success") return;
  const msg = (route.query.msg as string | undefined) || "新增成功";
  toastMessage.value = msg;
  showSuccessToast.value = true;
  router.replace({ path: route.path, query: { ...route.query, toast: undefined, msg: undefined } });
};

onMounted(maybeShowReturnToast);

watch(
  () => route.query.toast,
  () => {
    maybeShowReturnToast();
  }
);
</script>

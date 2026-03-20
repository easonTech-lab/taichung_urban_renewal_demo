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
          <ButtonCTA v-if="hasAnyFAQs" variant="outline" size="sm" left-icon="plus" @click="handleAddQuestion"> 新增問題 </ButtonCTA>
        </div>
        <div v-if="hasAnyFAQs" class="rounded-lg border border-gray-300 bg-white">
          <Table
            v-if="filteredFAQs.length > 0"
            :columns="tableColumns"
            :rows="paginatedFAQs"
            :pagination="pagination"
            row-key="index"
            :row-clickable="true"
            @row-click="handleRowClick"
            @page-change="handlePageChange"
          >
            <template #cell-index="{ rowIndex }">
              <p class="text-base text-gray-500">{{ (pagination.currentPage - 1) * pageSize + rowIndex + 1 }}</p>
            </template>
            <template #cell-status="{ row }">
              <div @click.stop @mousedown.prevent>
                <Badge v-if="row.tabStatus === 'draft'" variant="gray" text="暫存中" />
                <Switch v-else :model-value="row.status" :show-text="true" on-text="上架" off-text="下架" @update:model-value="(value) => handleStatusChange(row, value)" />
              </div>
            </template>
            <template #cell-action="{ row }">
              <div class="flex items-center gap-4">
                <ButtonCTA variant="text" size="sm" icon-only left-icon="editOutline" @click.stop="handleEdit(row)" aria-label="編輯" />
                <ButtonCTA variant="text" size="sm" icon-only left-icon="trashCan" @click.stop="handleDelete(row)" aria-label="刪除" />
              </div>
            </template>
          </Table>
          <Empty v-else type="search" :show-button="false" class="py-12" />
        </div>
        <div v-else class="rounded-lg border border-gray-300 bg-white">
          <Empty type="case-management" message="尚未新增常見問題" button-text="新增問題" @button-click="handleAddQuestion" />
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      v-model="showDeleteModal"
      message="確認刪除此項目"
      description="內容將完全刪除無法復原"
      confirm-label="確認"
      @confirm="handleConfirmDelete"
      @cancel="handleCloseDeleteModal"
    />

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
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Badge from "@/components/atoms/Badge.vue";
import Toast from "@/components/atoms/Toast.vue";
import Switch from "@/components/atoms/Switch.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Empty from "@/components/atoms/Empty.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import type { FaqItem } from "@/types/backend/homepageMaintenance/faqManagement.d";

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
    category: "",
    publishDate: "",
    status: false,
    tabStatus: "draft",
    isExpanded: true,
  },
  {
    index: 2,
    question: "都更、危老、整建維護差在哪？",
    category: "我適合哪種重建方式？",
    publishDate: "114/11/09",
    status: true,
    tabStatus: "published",
  },
  {
    index: 3,
    question: "房子幾歲了才算老？該選哪一種方式？",
    category: "我適合哪種重建方式？",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 4,
    question: "需要準備什麼資料、文件？",
    category: "要怎麼申請？需要準備什麼？",
    publishDate: "114/10/30",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 5,
    question: "同意比例要多少才可以啟動？",
    category: "要怎麼申請？需要準備什麼？",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 6,
    question: "危老可以拿到多少容積獎勵？",
    category: "有什麼補助或政府協助？",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
  {
    index: 7,
    question: "有沒有免費顧問或推動師可協助？",
    category: "有什麼補助或政府協助？",
    publishDate: "114/10/12",
    status: false,
    tabStatus: "unpublished",
  },
]);

const hasAnyFAQs = computed(() => allFAQs.value.length > 0);

// Table Columns（比例：項次 5% / 問題 35% / 類別 18% / 發布日期 12% / 狀態 10% / 動作 20%）
const tableColumns: TableColumn[] = [
  { key: "index", label: "項次", width: "5%" },
  { key: "question", label: "問題", width: "35%" },
  { key: "category", label: "類別", width: "18%" },
  { key: "publishDate", label: "發布日期", width: "12%", sortable: true },
  { key: "status", label: "狀態", width: "10%" },
  { key: "action", label: "動作", width: "20%" },
];

// Filtered FAQs
const filteredFAQs = computed(() => {
  return [...allFAQs.value];
});

const { paginatedRows: paginatedFAQs, pagination, handlePageChange } = useTablePagination({
  rows: filteredFAQs,
  pageSize,
});

// Event Handlers
const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
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
  // 切換後該列可能被過濾掉，主動移除 focus 避免跳到下一列
  requestAnimationFrame(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement?.blur) activeElement.blur();
  });
  // TODO: Implement status change logic
};

const handleRowClick = (row: Record<string, any>) => {
  handleEdit(row);
};

const handleEdit = (row: Record<string, any>) => {
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

<template>
  <div class="flex flex-col gap-10">
    <div class="rounded-lg bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">專案檔案</h2>
        </div>
        <ButtonCTA
          v-if="hasAnyFiles"
          variant="outline"
          size="xs"
          left-icon="plus"
          class="!h-9 !min-w-[96px] px-3 py-2 text-sm"
          @click="handleFileUpload"
        >
          新增檔案
        </ButtonCTA>
      </div>
      <div v-if="hasAnyFiles" class="mt-6 flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <Dropdown :button-text="selectedFileStage" placeholder="全部案件階段" :items="fileStageOptions" @item-click="handleFileStageChange" />
          <Dropdown :button-text="selectedFileCategory" placeholder="檔案類別" :items="fileCategoryOptions" @item-click="handleFileCategoryChange" />
        </div>
      </div>
      <div v-if="hasAnyFiles" class="mt-6">
        <Table
          v-if="filteredFiles.length > 0"
          :columns="fileTableColumns"
          :rows="filePaginationState.paginatedRows"
          :pagination="filePaginationState.pagination"
          :borderless="true"
          class="shadow-none"
          @page-change="filePaginationState.handlePageChange"
        >
          <template #cell-action="{ row }">
            <div class="flex items-center gap-4">
              <button class="flex items-center justify-center text-primary-600" @click.stop="handleFileDownload(row as ProjectFile)" aria-label="下載檔案">
                <Icon name="download" :size="24" color="#1C64F2" />
              </button>
              <button class="flex items-center justify-center text-primary-600" @click.stop="handleFileDelete(row as ProjectFile)" aria-label="刪除檔案">
                <Icon name="trashCan" :size="24" color="#1C64F2" />
              </button>
            </div>
          </template>
        </Table>
        <Empty v-else type="search" :show-button="false" class="py-12" />
      </div>
      <Empty
        v-else
        type="case-management"
        message="尚無專案檔案"
        button-text="新增檔案"
        class="pt-6"
        @button-click="handleFileUpload"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useTablePagination } from "@/composables/useTablePagination";
import Icon from "@/components/atoms/Icon.vue";
import Empty from "@/components/atoms/Empty.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import Dropdown, { type DropdownItem } from "@/components/atoms/Dropdown.vue";
import type { ProjectFile } from "@/types/backend/caseManagement/common/CaseDetailView.d";
const props = defineProps<{ files: ProjectFile[] }>();
const emit = defineEmits<{
  download: [file: ProjectFile];
  "request-delete": [file: ProjectFile];
  upload: [];
}>();
const selectedFileStage = ref<string>("全部案件階段");
const selectedFileCategory = ref<string>("檔案類別");
const filePageSize = ref(10);
const fileStageOptions: DropdownItem[] = [
  { label: "全部案件階段", value: "全部案件階段" },
  { label: "案件申請", value: "案件申請" },
  { label: "公辦公聽會", value: "公辦公聽會" },
  { label: "都更幹事會", value: "都更幹事會" },
  { label: "專案小組", value: "專案小組" },
  { label: "都更大會", value: "都更大會" },
  { label: "最終核定", value: "最終核定" },
];
const fileCategoryOptions: DropdownItem[] = [
  { label: "檔案類別", value: "檔案類別" },
  { label: "申請人上傳", value: "申請人上傳" },
  { label: "幹事上傳", value: "幹事上傳" },
  { label: "承辦上傳", value: "承辦上傳" },
];
const fileTableColumns: TableColumn[] = [
  {
    key: "fileName",
    label: "檔案名稱",
    width: "32%",
    sortable: true,
  },
  {
    key: "uploadTime",
    label: "上傳時間",
    width: "22%",
    sortable: true,
  },
  {
    key: "caseStage",
    label: "案件階段",
    width: "14%",
    sortable: true,
  },
  {
    key: "fileCategory",
    label: "檔案類別",
    width: "14%",
  },
  {
    key: "fileSize",
    label: "檔案大小",
    width: "10%",
    sortable: true,
  },
  {
    key: "action",
    label: "動作",
    width: "8%",
  },
];
const hasAnyFiles = computed(() => props.files.length > 0);
const filteredFiles = computed(() => {
  let files = [...props.files];
  if (selectedFileStage.value && selectedFileStage.value !== "全部案件階段") {
    files = files.filter((file) => file.caseStage === selectedFileStage.value);
  }
  if (selectedFileCategory.value && selectedFileCategory.value !== "檔案類別") {
    files = files.filter((file) => file.fileCategory === selectedFileCategory.value);
  }
  return files;
});
const filePaginationState = reactive(useTablePagination({
  rows: filteredFiles,
  pageSize: filePageSize,
}));
const handleFileStageChange = (item: DropdownItem) => {
  selectedFileStage.value = item.value || "全部案件階段";
  filePaginationState.resetPage();
}
const handleFileCategoryChange = (item: DropdownItem) => {
  selectedFileCategory.value = item.value || "檔案類別";
  filePaginationState.resetPage();
}
const handleFileDownload = (file: ProjectFile) => {
  emit("download", file);
}
const handleFileDelete = (file: ProjectFile) => {
  emit("request-delete", file);
}
const handleFileUpload = () => {
  emit("upload");
}
</script>

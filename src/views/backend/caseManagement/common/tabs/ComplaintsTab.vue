<template>
  <div class="flex flex-col gap-6">
    <div v-for="(section, index) in complaintSections" :key="`${section.title}-${index}`" class="rounded-lg bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="h-7 w-1 rounded bg-primary-600"></div>
          <h2 class="text-2xl font-medium leading-6 text-gray-900">{{ section.title }}</h2>
        </div>
        <ButtonCTA
          variant="outline"
          size="xs"
          left-icon="plus"
          class="!h-9 !min-w-[96px] px-3 py-2 text-sm"
          @click="handleComplaintUpload(section)"
        >
          上傳檔案
        </ButtonCTA>
      </div>
      <div class="mt-6">
        <Table :columns="complaintTableColumns" :rows="section.rows" :show-checkbox="false" :borderless="true" class="shadow-none">
          <template #cell-title="{ row }">
            <p class="line-clamp-2 text-base text-gray-800">
              {{ row.title }}
            </p>
          </template>
          <template #cell-uploadedAt="{ row }">
            <p class="text-base text-gray-500">
              {{ row.uploadedAt }}
            </p>
          </template>
          <template #cell-action="{ row }">
            <div class="flex items-center gap-4">
              <button class="flex items-center justify-center text-primary-600" @click.stop="handleComplaintDownload(row as ComplaintRow)" aria-label="下載檔案">
                <Icon name="download" :size="24" color="#1C64F2" />
              </button>
              <button class="flex items-center justify-center text-primary-600" @click.stop="handleComplaintDelete(row as ComplaintRow)" aria-label="刪除檔案">
                <Icon name="trashCan" :size="24" color="#1C64F2" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/atoms/Icon.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Table, { type TableColumn } from "@/components/atoms/Table.vue";
import type { ComplaintSection, ComplaintRow } from "@/types/backend/caseManagement/common/caseDetail.d";

defineProps<{
  complaintSections: ComplaintSection[];
}>();

const emit = defineEmits<{
  upload: [section: ComplaintSection];
  download: [row: ComplaintRow];
  "request-delete": [row: ComplaintRow];
}>();

const complaintTableColumns: TableColumn[] = [
  {
    key: "title",
    label: "案件名稱",
    headerClass: "w-auto",
    sortable: true,
  },
  {
    key: "uploadedAt",
    label: "上傳時間",
    headerClass: "w-[170px]",
    sortable: true,
  },
  {
    key: "action",
    label: "動作",
    headerClass: "w-[96px]",
  },
];

const handleComplaintUpload = (section: ComplaintSection) => {
  emit("upload", section);
};

const handleComplaintDownload = (row: ComplaintRow) => {
  emit("download", row);
};

const handleComplaintDelete = (row: ComplaintRow) => {
  emit("request-delete", row);
};
</script>

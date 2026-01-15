<template>
  <div class="border-default relative overflow-x-auto rounded-lg border bg-white shadow-sm">
    <table class="text-body w-full text-left text-sm rtl:text-right">
      <thead class="border-default-medium text-body border-b bg-gray-50 text-sm">
        <tr>
          <!-- Checkbox 欄位 -->
          <th v-if="showCheckbox" scope="col" class="p-4">
            <div class="flex items-center">
              <input
                :id="`table-checkbox-all-${tableId}`"
                type="checkbox"
                :checked="isAllSelected"
                class="border-default-medium bg-neutral-secondary-medium focus:ring-brand-soft rounded-xs h-4 w-4 border focus:ring-2"
                @change="handleSelectAll"
              />
              <label :for="`table-checkbox-all-${tableId}`" class="sr-only"> Select all </label>
            </div>
          </th>

          <!-- 欄位標題 -->
          <th
            v-for="(column, index) in columns"
            :key="index"
            scope="col"
            :class="[
              column.headerClass || 'px-6 py-3.5',
              index === 0 ? 'rounded-tl-lg' : '',
              index === columns.length - 1 && !showCheckbox ? 'rounded-tr-lg' : '',
            ]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          class="border-default bg-neutral-primary-soft hover:bg-neutral-secondary-medium border-b"
        >
          <!-- Checkbox 欄位 -->
          <td v-if="showCheckbox" class="w-4 p-4">
            <div class="flex items-center">
              <input
                :id="`table-checkbox-${tableId}-${rowIndex}`"
                type="checkbox"
                :checked="isRowSelected(rowIndex)"
                class="border-default-medium bg-neutral-secondary-medium focus:ring-brand-soft rounded-xs h-4 w-4 border focus:ring-2"
                @change="handleRowSelect(rowIndex, $event)"
              />
              <label :for="`table-checkbox-${tableId}-${rowIndex}`" class="sr-only"> Table checkbox </label>
            </div>
          </td>

          <!-- 資料欄位 -->
          <template v-for="(column, colIndex) in columns" :key="colIndex">
            <th
              v-if="column.isRowHeader"
              :key="`th-${colIndex}`"
              scope="row"
              :class="column.cellClass || 'text-heading whitespace-nowrap px-6 py-4 font-medium'"
            >
              <slot :name="`cell-${column.key}`" :row="row" :column="column" :rowIndex="rowIndex">
                {{ getCellValue(row, column) }}
              </slot>
            </th>
            <td v-else :key="`td-${colIndex}`" :class="column.cellClass || 'px-6 py-4'">
              <slot :name="`cell-${column.key}`" :row="row" :column="column" :rowIndex="rowIndex">
                {{ getCellValue(row, column) }}
              </slot>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- 分頁導航 -->
    <nav
      v-if="pagination"
      class="flex-column flex flex-wrap items-center justify-between p-4 md:flex-row"
      aria-label="Table navigation"
    >
      <span class="text-body mb-4 block w-full text-sm font-normal md:mb-0 md:inline md:w-auto">
        顯示
        <span class="text-heading font-semibold">{{ paginationFrom }}-{{ paginationTo }}</span>
        of
        <span class="text-heading font-semibold">{{ pagination.total }}</span>
      </span>
      <ul class="flex -space-x-px text-sm">
        <li>
          <a
            href="#"
            class="rounded-s-base border-default-medium bg-neutral-secondary-medium text-body hover:bg-neutral-tertiary-medium hover:text-heading flex h-9 items-center justify-center border px-3 text-sm font-medium focus:outline-none"
            @click.prevent="handlePageChange(pagination.currentPage - 1)"
          >
            Previous
          </a>
        </li>
        <li v-for="page in paginationPages" :key="page">
          <a
            v-if="page !== '...'"
            href="#"
            :aria-current="page === pagination.currentPage ? 'page' : undefined"
            :class="[
              'border-default-medium flex h-9 w-9 items-center justify-center border text-sm font-medium focus:outline-none',
              page === pagination.currentPage
                ? 'bg-brand-softer text-fg-brand hover:bg-brand-soft hover:text-fg-brand'
                : 'bg-neutral-secondary-medium text-body hover:bg-neutral-tertiary-medium hover:text-heading',
            ]"
            @click.prevent="handlePageClick(page)"
          >
            {{ page }}
          </a>
          <span
            v-else
            class="border-default-medium bg-neutral-secondary-medium text-body flex h-9 w-9 items-center justify-center border text-sm font-medium"
          >
            ...
          </span>
        </li>
        <li>
          <a
            href="#"
            class="rounded-e-base border-default-medium bg-neutral-secondary-medium text-body hover:bg-neutral-tertiary-medium hover:text-heading flex h-9 items-center justify-center border px-3 text-sm font-medium focus:outline-none"
            @click.prevent="handlePageChange(pagination.currentPage + 1)"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

export interface TableColumn {
  key: string;
  label: string;
  isRowHeader?: boolean; // 是否作為行標題（使用 th）
  headerClass?: string; // 標題欄位的自訂 class
  cellClass?: string; // 資料欄位的自訂 class
}

export interface TablePagination {
  currentPage: number;
  total: number;
  pageSize?: number; // 每頁顯示數量（用於計算分頁）
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    rows: Record<string, any>[];
    showCheckbox?: boolean;
    pagination?: TablePagination;
  }>(),
  {
    showCheckbox: false,
  }
);

const emit = defineEmits<{
  "select-all": [checked: boolean];
  "row-select": [rowIndex: number, checked: boolean];
  "page-change": [page: number];
}>();

const tableId = computed(() => Math.random().toString(36).substring(2, 11));
const selectedRows = ref<Set<number>>(new Set());

const isAllSelected = computed(() => {
  if (props.rows.length === 0) return false;
  return selectedRows.value.size === props.rows.length;
});

const isRowSelected = (rowIndex: number) => {
  return selectedRows.value.has(rowIndex);
};

const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    selectedRows.value = new Set(props.rows.map((_, index) => index));
  } else {
    selectedRows.value.clear();
  }
  emit("select-all", checked);
};

const handleRowSelect = (rowIndex: number, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    selectedRows.value.add(rowIndex);
  } else {
    selectedRows.value.delete(rowIndex);
  }
  emit("row-select", rowIndex, checked);
};

const getCellValue = (row: Record<string, any>, column: TableColumn) => {
  return row[column.key] ?? "";
};

const paginationPages = computed(() => {
  if (!props.pagination) return [];

  const { currentPage, total, pageSize = 10 } = props.pagination;
  const totalPages = Math.ceil(total / pageSize);
  const pages: (number | string)[] = [];

  // 簡單的分頁邏輯：顯示當前頁前後各 2 頁
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push("...");
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
});

const paginationFrom = computed(() => {
  if (!props.pagination) return 0;
  const { currentPage, pageSize = 10 } = props.pagination;
  return (currentPage - 1) * pageSize + 1;
});

const paginationTo = computed(() => {
  if (!props.pagination) return 0;
  const { currentPage, pageSize = 10, total } = props.pagination;
  return Math.min(currentPage * pageSize, total);
});

const handlePageClick = (page: number | string) => {
  if (typeof page === "number") {
    handlePageChange(page);
  }
};

const handlePageChange = (page: number) => {
  if (!props.pagination) return;

  const { pageSize = 10 } = props.pagination;
  const totalPages = Math.ceil(props.pagination.total / pageSize);

  if (page >= 1 && page <= totalPages && page !== props.pagination.currentPage) {
    emit("page-change", page);
  }
};
</script>

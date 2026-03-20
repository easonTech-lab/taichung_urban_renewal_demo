<template>
  <div
    class="relative overflow-x-auto rounded-lg bg-white shadow-sm"
    :class="borderless ? '' : 'border border-gray-300'"
  >
    <table class="w-full table-fixed text-left text-sm text-gray-900 rtl:text-right" :style="{ minWidth: resolvedMinWidth }">
      <colgroup v-if="columns.some((c) => c.width)">
        <col v-if="showCheckbox" />
        <col v-for="(col, i) in columns" :key="i" :style="col.width ? { width: col.width } : undefined" />
      </colgroup>
      <thead class="bg-gray-50 text-sm text-gray-500" :class="borderless ? '' : 'border-b border-gray-300'">
        <tr>
          <!-- Checkbox 欄位 -->
          <th v-if="showCheckbox" scope="col" class="p-4">
            <div class="flex items-center">
              <input
                :id="`table-checkbox-all-${tableId}`"
                type="checkbox"
                :checked="isAllSelected"
                class="h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-primary-500"
                @change="handleSelectAll"
              />
              <label :for="`table-checkbox-all-${tableId}`" class="sr-only"> Select all </label>
            </div>
          </th>

          <!-- 欄位標題 -->
          <th v-for="(column, index) in columns" :key="index" scope="col" :class="getHeaderClass(column, index)">
            <slot :name="`header-${column.key}`" :column="column" :index="index" :sortOrder="getSortOrder(column.key)">
              <div v-if="column.sortable" class="flex items-center" :class="(column.headerClass || '').includes('text-right') ? 'w-full justify-end' : ''">
                {{ column.label }}
                <button type="button" class="ml-1 flex items-center" :aria-label="`依${column.label}排序`" @click="handleSort(column.key)">
                  <Icon name="sort" :size="16" class="h-4 w-4" :class="getSortIconClass(column.key)" />
                </button>
              </div>
              <span v-else class="block w-full" :class="(column.headerClass || '').includes('text-right') ? 'text-right' : ''">{{ column.label }}</span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, rowIndex) in sortedRows" :key="getRowKey(row, rowIndex)">
          <tr
            :class="[
              borderless ? '' : 'border-b border-gray-300',
              'hover:bg-gray-50',
              rowClickable ? 'focus:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset' : '',
              rowClickable ? 'cursor-pointer' : '',
              (row as any).isExpanded ? 'bg-blue-50' : 'bg-white',
            ]"
            :tabindex="rowClickable ? 0 : undefined"
            @click="rowClickable && handleRowClick(row, rowIndex, $event)"
            @keydown.enter.prevent="rowClickable && handleRowKeydown(row, rowIndex, $event)"
            @keydown.space.prevent="rowClickable && handleRowKeydown(row, rowIndex, $event)"
          >
            <!-- Checkbox 欄位 -->
            <td v-if="showCheckbox" class="w-4 p-4">
              <div class="flex items-center">
                <input
                  :id="`table-checkbox-${tableId}-${rowIndex}`"
                  type="checkbox"
                  :checked="isRowSelected(rowIndex)"
                  class="h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-primary-500"
                  @change="handleRowSelect(rowIndex, $event)"
                />
                <label :for="`table-checkbox-${tableId}-${rowIndex}`" class="sr-only"> Table checkbox </label>
              </div>
            </td>

            <!-- 資料欄位 -->
            <template v-for="(column, colIndex) in columns" :key="colIndex">
              <th v-if="column.isRowHeader" :key="`th-${colIndex}`" scope="row" :class="getCellClass(column, true)">
                <slot :name="`cell-${column.key}`" :row="row" :column="column" :rowIndex="rowIndex">
                  <div class="min-w-0 truncate">
                    {{ getCellValue(row, column) }}
                  </div>
                </slot>
              </th>
              <td v-else :key="`td-${colIndex}`" :class="getCellClass(column)">
                <slot :name="`cell-${column.key}`" :row="row" :column="column" :rowIndex="rowIndex">
                  <div class="min-w-0 truncate">
                    {{ getCellValue(row, column) }}
                  </div>
                </slot>
              </td>
            </template>
          </tr>
          <!-- Row after slot for additional content (e.g., expanded rows) -->
          <slot name="row-after" :row="row" :rowIndex="rowIndex"></slot>
        </template>
      </tbody>
    </table>

    <!-- 分頁導航 -->
    <nav v-if="pagination" class="flex flex-wrap items-center justify-between p-4 md:flex-row" aria-label="Table navigation">
      <span class="mb-4 block w-full text-sm font-normal text-gray-900 md:mb-0 md:inline md:w-auto">
        顯示
        <span class="font-semibold text-gray-900">{{ paginationFrom }}-{{ paginationTo }}</span>
        of
        <span class="font-semibold text-gray-900">{{ pagination.total }}</span>
      </span>
      <ul class="flex -space-x-px text-sm">
        <li>
          <button
            type="button"
            class="flex h-9 items-center justify-center rounded-l-lg border border-gray-300 bg-gray-100 px-3 text-sm font-medium text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
            :disabled="pagination.currentPage <= 1"
            :aria-label="'上一頁'"
            @click="handlePageChange(pagination.currentPage - 1)"
          >
            <Icon name="arrowLeft" :size="16" class="h-4 w-4" />
          </button>
        </li>
        <li v-for="page in paginationPages" :key="page">
          <button
            v-if="page !== '...'"
            type="button"
            :aria-current="page === pagination.currentPage ? 'page' : undefined"
            :class="[
              'flex h-9 w-9 items-center justify-center border border-gray-300 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
              page === pagination.currentPage
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 hover:text-primary-800'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:text-gray-900',
            ]"
            :aria-label="`第${page}頁`"
            @click="handlePageClick(page)"
          >
            {{ page }}
          </button>
          <span v-else class="flex h-9 w-9 items-center justify-center border border-gray-300 bg-gray-100 text-sm font-medium text-gray-900"> ... </span>
        </li>
        <li>
          <button
            type="button"
            class="flex h-9 items-center justify-center rounded-r-lg border border-gray-300 bg-gray-100 px-3 text-sm font-medium text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
            :disabled="pagination.currentPage >= Math.ceil(pagination.total / (pagination.pageSize || 10))"
            :aria-label="'下一頁'"
            @click="handlePageChange(pagination.currentPage + 1)"
          >
            <Icon name="arrowRight" :size="16" class="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "@/components/atoms/Icon.vue";

export interface TableColumn {
  key: string;
  label: string;
  isRowHeader?: boolean; // 是否作為行標題（使用 th）
  headerClass?: string; // 標題欄位的自訂 class
  cellClass?: string; // 資料欄位的自訂 class
  sortable?: boolean; // 是否可排序
  width?: string; // 欄位寬度，如 "140px"、"20%"，用 col 鎖定（table-layout: fixed）
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
    rowClickable?: boolean; // 是否啟用整行點擊功能
    borderless?: boolean;
    rowKey?: string | ((row: Record<string, any>, rowIndex: number) => string | number);
    minWidth?: string | number;
  }>(),
  {
    showCheckbox: false,
    rowClickable: false,
    borderless: false,
    rowKey: undefined,
    minWidth: undefined,
  }
);

const emit = defineEmits<{
  "select-all": [checked: boolean];
  "row-select": [rowIndex: number, checked: boolean];
  "page-change": [page: number];
  "row-click": [row: Record<string, any>, rowIndex: number, event: MouseEvent];
}>();

const selectedRows = ref<Set<number>>(new Set());
const tableId = computed(() => Math.random().toString(36).substring(2, 11));
const sortBy = ref<string>("");
const sortOrder = ref<"asc" | "desc">("asc");
const resolvedMinWidth = computed(() => {
  if (typeof props.minWidth === "number") {
    return `${props.minWidth}px`;
  }
  if (typeof props.minWidth === "string" && props.minWidth.trim()) {
    return props.minWidth;
  }
  // 讓後台表格在欄位開始擠壓之前就先出現橫向卷軸
  const columnCount = props.columns.length + (props.showCheckbox ? 1 : 0);
  return `${Math.max(500, columnCount * 140)}px`;
});

const isAllSelected = computed(() => {
  if (props.rows.length === 0) return false;
  return selectedRows.value.size === props.rows.length;
});

const isRowSelected = (rowIndex: number) => {
  return selectedRows.value.has(rowIndex);
}

const getRowKey = (row: Record<string, any>, rowIndex: number): string | number => {
  if (typeof props.rowKey === "function") {
    return props.rowKey(row, rowIndex);
  }
  if (typeof props.rowKey === "string" && row[props.rowKey] !== undefined) {
    return row[props.rowKey] as string | number;
  }
  return rowIndex;
}

const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    selectedRows.value = new Set(props.rows.map((_, index) => index));
  } else {
    selectedRows.value.clear();
  }
  emit("select-all", checked);
}

const handleRowSelect = (rowIndex: number, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    selectedRows.value.add(rowIndex);
  } else {
    selectedRows.value.delete(rowIndex);
  }
  emit("row-select", rowIndex, checked);
}

const getCellValue = (row: Record<string, any>, column: TableColumn) => {
  return row[column.key] ?? "";
}

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

const handleRowClick = (row: Record<string, any>, rowIndex: number, event: MouseEvent) => {
  // 如果點擊的是 checkbox 或 checkbox 內的元素，不觸發行點擊
  const target = event.target as HTMLElement;
  if (target.closest('input[type="checkbox"]') || target.closest("label") || target.closest("button") || target.closest("a")) {
    return;
  }
  emit("row-click", row, rowIndex, event);
};

const handleRowKeydown = (row: Record<string, any>, rowIndex: number, event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("select") || target.closest("textarea")) {
    return;
  }
  emit("row-click", row, rowIndex, event as unknown as MouseEvent);
};

// 排序相關邏輯
const getSortOrder = (columnKey: string): "asc" | "desc" | null => {
  if (sortBy.value === columnKey) {
    return sortOrder.value;
  }
  return null;
};

const handleSort = (columnKey: string) => {
  if (sortBy.value === columnKey) {
    // 如果已經是當前排序欄位，切換排序方向
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // 如果是新欄位，預設為升序
    sortBy.value = columnKey;
    sortOrder.value = "asc";
  }
};

const getSortIconClass = (columnKey: string): string => {
  if (sortBy.value === columnKey) {
    // 當前排序欄位，使用主色調
    return "text-primary-600";
  }
  // 未排序欄位，使用灰色
  return "text-gray-500";
};

// 排序後的 rows
const sortedRows = computed(() => {
  let rows = [...props.rows];

  // 排序
  if (sortBy.value) {
    rows = rows.sort((a, b) => {
      const aValue = (a as Record<string, any>)[sortBy.value];
      const bValue = (b as Record<string, any>)[sortBy.value];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortOrder.value === "asc" ? comparison : -comparison;
    });
  }

  // 分頁
  if (props.pagination) {
    const { currentPage, pageSize = 10 } = props.pagination;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    rows = rows.slice(start, end);
  }

  return rows;
});

// 統一的 header class 處理
const getHeaderClass = (column: TableColumn, index: number): string => {
  const baseClasses = "bg-gray-50 px-4 py-4 text-gray-500";
  const customClasses = column.headerClass || "";

  // 檢查是否已經包含基礎樣式，避免重複
  const hasBgGray = customClasses.includes("bg-gray-50");
  const hasPadding = customClasses.includes("px-") || customClasses.includes("py-");
  const hasTextColor = customClasses.includes("text-gray-") || customClasses.includes("text-");

  // 處理圓角
  const roundedClasses: string[] = [];
  if (index === 0 && !props.showCheckbox) {
    if (!customClasses.includes("rounded-tl")) {
      roundedClasses.push("rounded-tl-lg");
    }
  }
  if (index === props.columns.length - 1 && !props.showCheckbox) {
    if (!customClasses.includes("rounded-tr")) {
      roundedClasses.push("rounded-tr-lg");
    }
  }

  // 將固定寬度（w-[xxx]）轉換為最小寬度（min-w-[xxx]），讓表格可以彈性調整
  let processedClasses = customClasses;
  if (processedClasses) {
    // 將 w-[xxx] 轉換為 min-w-[xxx]
    processedClasses = processedClasses.replace(/\bw-\[([^\]]+)\]/g, "min-w-[$1]");
  }

  // 組合 class
  const classes: string[] = [];
  if (!hasBgGray) classes.push(baseClasses.split(" ")[0]); // bg-gray-50
  if (!hasPadding) classes.push(...baseClasses.split(" ").slice(1, 3)); // px-4 py-4
  if (!hasTextColor) classes.push(baseClasses.split(" ")[3]); // text-gray-500
  if (processedClasses) classes.push(processedClasses);
  classes.push(...roundedClasses);

  return classes.join(" ");
};

// 統一的 cell class 處理
const getCellClass = (column: TableColumn, isRowHeader = false): string => {
  const customClasses = column.cellClass || "";

  // 將固定寬度（w-[xxx]）轉換為最小寬度（min-w-[xxx]），讓表格可以彈性調整
  let processedClasses = customClasses;
  if (processedClasses) {
    // 將 w-[xxx] 轉換為 min-w-[xxx]
    processedClasses = processedClasses.replace(/\bw-\[([^\]]+)\]/g, "min-w-[$1]");
  }

  if (isRowHeader) {
    const baseClasses = "whitespace-nowrap px-4 py-4 font-medium text-gray-900";
    return processedClasses || baseClasses;
  }

  const baseClasses = "px-4 py-4";

  // 檢查是否已經包含 padding，避免重複
  const hasPadding = processedClasses.includes("px-") || processedClasses.includes("py-");

  if (hasPadding) {
    return processedClasses;
  }

  return `${baseClasses} ${processedClasses}`.trim();
};
</script>

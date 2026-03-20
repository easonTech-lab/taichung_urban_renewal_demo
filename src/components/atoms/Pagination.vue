<template>
  <nav :aria-label="ariaLabel">
    <div class="flex items-center overflow-hidden rounded border border-gray-300">
      <!-- 上一頁按鈕 -->
      <component
        :is="previousTo ? 'router-link' : 'a'"
        :to="previousTo"
        :href="previousTo ? undefined : '#'"
        class="flex cursor-pointer items-center justify-center border-r border-gray-300 bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :class="[currentPage === 1 ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:bg-gray-50']"
        :aria-label="previousLabel"
        :aria-disabled="currentPage === 1"
        :tabindex="currentPage === 1 ? -1 : 0"
        @click.prevent="handlePrevious"
      >
        <span class="sr-only">{{ previousLabel }}</span>
        <svg class="h-5 w-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
        </svg>
      </component>

      <!-- 頁碼和省略號 -->
      <template v-for="(item, index) in paginationItems" :key="index">
        <!-- 頁碼按鈕 -->
        <component
          v-if="item.type === 'page'"
          :is="getPageLinkSafe(item.page) ? 'router-link' : 'a'"
          :to="getPageLinkSafe(item.page)"
          :href="getPageLinkSafe(item.page) ? undefined : '#'"
          class="flex cursor-pointer items-center justify-center whitespace-nowrap border-r border-gray-300 bg-white px-3 py-1.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="[item.page === currentPage ? 'bg-blue-100 text-blue-600 hover:text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900']"
          :aria-label="`第 ${item.page} 頁`"
          :aria-current="item.page === currentPage ? 'page' : undefined"
          @click.prevent="handlePageClick(item.page)"
        >
          {{ item.page }}
        </component>

        <!-- 省略號 -->
        <span
          v-else-if="item.type === 'ellipsis'"
          class="flex items-center justify-center whitespace-nowrap border-r border-gray-300 bg-white px-3 py-1.5 text-center text-sm font-medium text-gray-500"
        >
          ...
        </span>
      </template>

      <!-- 下一頁按鈕 -->
      <component
        :is="nextTo ? 'router-link' : 'a'"
        :to="nextTo"
        :href="nextTo ? undefined : '#'"
        class="flex cursor-pointer items-center justify-center bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :class="[currentPage === totalPages ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:bg-gray-50']"
        :aria-label="nextLabel"
        :aria-disabled="currentPage === totalPages"
        :tabindex="currentPage === totalPages ? -1 : 0"
        @click.prevent="handleNext"
      >
        <span class="sr-only">{{ nextLabel }}</span>
        <svg class="h-5 w-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
        </svg>
      </component>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  pageSize?: 3 | 5 | 10; // 頁碼顯示數量：3頁格、5頁格、10頁格
  previousTo?: string; // 上一頁的 router-link 路徑
  nextTo?: string; // 下一頁的 router-link 路徑
  getPageLink?: (page: number) => string | undefined; // 自訂頁碼連結
}

const props = withDefaults(defineProps<PaginationProps>(), {
  ariaLabel: "分頁導航",
  previousLabel: "上一頁",
  nextLabel: "下一頁",
  pageSize: 5,
  getPageLink: (_page: number): string | undefined => undefined,
});

const emit = defineEmits<{
  "update:currentPage": [page: number];
  "page-change": [page: number];
  previous: [];
  next: [];
}>();

type PaginationItem = { type: "page"; page: number } | { type: "ellipsis"; page?: never };

// 計算分頁項目（包括頁碼和省略號）
const paginationItems = computed<PaginationItem[]>(() => {
  const items: PaginationItem[] = [];
  const { currentPage, totalPages, pageSize } = props;
  const maxVisible = pageSize; // 使用 pageSize 作為最大顯示頁碼數

  if (totalPages <= maxVisible + 2) {
    // 如果總頁數不多，顯示所有頁碼
    for (let i = 1; i <= totalPages; i++) {
      items.push({ type: "page", page: i });
    }
  } else {
    // 總是顯示第一頁
    items.push({ type: "page", page: 1 });

    // 計算中間頁碼的起始和結束
    // 確保當前頁在中間區域
    let start = Math.max(2, currentPage - Math.floor((maxVisible - 2) / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 3);

    // 調整範圍，確保不會太靠近邊緣
    if (start <= 2) {
      start = 2;
      end = Math.min(totalPages - 1, start + maxVisible - 2);
    } else if (end >= totalPages - 1) {
      end = totalPages - 1;
      start = Math.max(2, end - maxVisible + 2);
    }

    // 如果第一頁和起始頁之間有間隔，添加省略號
    if (start > 2) {
      items.push({ type: "ellipsis" });
    }

    // 添加中間頁碼
    for (let i = start; i <= end; i++) {
      items.push({ type: "page", page: i });
    }

    // 如果結束頁和最後一頁之間有間隔，添加省略號
    if (end < totalPages - 1) {
      items.push({ type: "ellipsis" });
    }

    // 總是顯示最後一頁
    items.push({ type: "page", page: totalPages });
  }

  return items;
});

const handlePageClick = (page: number | undefined) => {
  if (page !== undefined && page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
    emit("page-change", page);
  }
};

// 輔助函數：安全地獲取頁碼連結
const getPageLinkSafe = (page: number | undefined): string | undefined => {
  if (page === undefined) return undefined;
  return props.getPageLink(page);
};

const handlePrevious = () => {
  if (props.currentPage > 1) {
    const newPage = props.currentPage - 1;
    emit("update:currentPage", newPage);
    emit("page-change", newPage);
    emit("previous");
  }
};

const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    const newPage = props.currentPage + 1;
    emit("update:currentPage", newPage);
    emit("page-change", newPage);
    emit("next");
  }
};
</script>

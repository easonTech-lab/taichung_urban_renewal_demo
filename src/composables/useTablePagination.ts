import { computed, ref, unref, type ComputedRef, type Ref } from "vue";
import type { TablePagination } from "@/components/atoms/Table.vue";

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

interface UseTablePaginationOptions<T> {
  rows: MaybeRef<T[]>;
  pageSize?: MaybeRef<number>;
  total?: MaybeRef<number>;
  slice?: boolean;
}

export const useTablePagination = <T>(options: UseTablePaginationOptions<T>) => {
  const currentPage = ref(1);
  const resolvedPageSize = computed(() => unref(options.pageSize ?? 10));
  const resolvedRows = computed(() => unref(options.rows));
  const resolvedTotal = computed(() => (options.total !== undefined ? unref(options.total) : resolvedRows.value.length));
  const shouldSlice = computed(() => options.slice !== false);

  const paginatedRows = computed(() => {
    if (!shouldSlice.value) {
      return resolvedRows.value;
    }

    const start = (currentPage.value - 1) * resolvedPageSize.value;
    const end = start + resolvedPageSize.value;
    return resolvedRows.value.slice(start, end);
  });

  const pagination = computed<TablePagination>(() => ({
    currentPage: currentPage.value,
    total: resolvedTotal.value,
    pageSize: resolvedPageSize.value,
  }));

  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };

  const resetPage = () => {
    currentPage.value = 1;
  };

  return {
    currentPage,
    pageSize: resolvedPageSize,
    total: resolvedTotal,
    paginatedRows,
    pagination,
    handlePageChange,
    resetPage,
  };
};

import { computed, ref, type Ref } from "vue";

/**
 * 表單未儲存變更比對（與常見問題維護邏輯一致）
 * @param getSnapshot 回傳目前表單內容的比對用字串，例如 JSON.stringify({ ... })
 * @param isEditMode 若傳入，僅在編輯模式時才比對；未傳入則新增/編輯都會比對
 */
export const useFormUnsavedCheck = (getSnapshot: () => string, isEditMode?: Ref<boolean>) => {
  const initialSnapshot = ref("");

  const captureInitial = () => {
    initialSnapshot.value = getSnapshot();
  };

  const hasUnsavedChanges = computed(() => {
    if (isEditMode && !isEditMode.value) return false;
    return getSnapshot() !== initialSnapshot.value;
  });

  return { hasUnsavedChanges, captureInitial };
};


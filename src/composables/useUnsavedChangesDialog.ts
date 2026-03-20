import { ref } from "vue";

export const useUnsavedChangesDialog = () => {
  const showUnsavedChangesModal = ref(false);
  const pendingAction = ref<(() => void) | null>(null);

  const requestUnsavedConfirmation = (hasChanges: boolean, action?: () => void) => {
    if (!hasChanges) {
      action?.();
      return false;
    }
    pendingAction.value = action ?? null;
    showUnsavedChangesModal.value = true;
    return true;
  };

  const closeUnsavedChangesModal = () => {
    showUnsavedChangesModal.value = false;
    pendingAction.value = null;
  };

  const runPendingAction = () => {
    const action = pendingAction.value;
    closeUnsavedChangesModal();
    action?.();
  };

  const takePendingAction = () => {
    const action = pendingAction.value;
    pendingAction.value = null;
    return action;
  };

  return {
    showUnsavedChangesModal,
    requestUnsavedConfirmation,
    closeUnsavedChangesModal,
    runPendingAction,
    takePendingAction,
  };
};

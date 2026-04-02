export const DRAG_HANDLE_CLASS = "drag-handle";

export const createVerticalListDragOptions = (handleClass = DRAG_HANDLE_CLASS) => ({
  handle: `.${handleClass}`,
  ghostClass: "opacity-60",
  chosenClass: "bg-primary-50",
  animation: 200,
});

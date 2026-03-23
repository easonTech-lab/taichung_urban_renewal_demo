<template>
  <div class="relative">
    <!-- 觸發按鈕 -->
    <button
      :id="buttonId"
      ref="buttonRef"
      type="button"
      class="inline-flex items-center focus:outline-none focus:ring-2"
      :class="[buttonClasses, 'w-full justify-between']"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-controls="dropdownId"
      @click="toggle"
      @keydown.enter.prevent="isOpen ? close() : openAndFocusItem(0)"
      @keydown.down.prevent="openAndFocusItem(0)"
      @keydown.space.prevent="toggle"
      @keydown.esc="close"
    >
      <slot name="button">
        <span :class="['flex-1 text-left', buttonTextClasses]">{{ displayText }}</span>
      </slot>
      <Icon name="chevronDown" :size="16" class="-me-0.5 ms-1.5 shrink-0 transition-transform" :class="isOpen ? 'rotate-180' : ''" aria-hidden="true" />
    </button>

    <!-- 下拉選單：Teleport 到 body 避免被父層 overflow 裁切 -->
    <Teleport to="body">
      <div
        v-show="isOpen"
        :id="dropdownId"
        class="fixed z-[9999] w-44 rounded-md border border-gray-200 bg-white shadow-lg"
        role="menu"
        :aria-labelledby="buttonId"
        :style="menuStyle"
      >
        <ul class="max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
          <li v-for="(item, index) in items" :key="index" role="none">
            <component
              :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
              :ref="(el: Element | null) => setItemRef(el, index)"
              :to="item.to"
              :href="item.href || '#'"
              :type="item.to || item.href ? undefined : 'button'"
              class="inline-flex w-full items-center rounded px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
              :class="item.class"
              role="menuitem"
              :aria-label="item.label"
              @click="handleItemClick(item, index, $event)"
              @keydown.enter="handleItemClick(item, index, $event)"
              @keydown.space.prevent="handleItemClick(item, index, $event)"
              @keydown.down.prevent="focusItem(index + 1)"
              @keydown.up.prevent="focusItem(index - 1)"
              @keydown.home.prevent="focusItem(0)"
              @keydown.end.prevent="focusItem(items.length - 1)"
              @keydown.esc.prevent="closeAndFocusButton"
            >
              <slot :name="`item-${index}`" :item="item" :index="index">
                {{ item.label }}
              </slot>
            </component>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import Icon from "@/components/atoms/Icon.vue";
export interface DropdownItem {
  label: string;
  to?: string; // Vue Router 路徑
  href?: string; // 外部連結
  class?: string; // 自訂 class
  [key: string]: any; // 允許其他屬性
};
const props = withDefaults(
  defineProps<{
    buttonText?: string;
    items: DropdownItem[];
    align?: "left" | "right";
    placeholder?: string;
  }>(),
  {
    buttonText: "Dropdown button",
    align: "left",
    placeholder: "",
  }
);
const emit = defineEmits(["item-click", "toggle"]);
const isOpen = ref(false);
const buttonRef = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const menuStyle = ref<Record<string, string>>({});
const instanceId = `dropdown-${Math.random().toString(36).substring(2, 11)}`;
const buttonId = `${instanceId}-button`;
const dropdownId = `${instanceId}-menu`;
const buttonClasses = computed(() => {
  return "bg-gray-50 border border-gray-300 text-gray-500 hover:bg-gray-100 focus:border-primary-500 focus:ring-primary-500 rounded-lg px-4 py-3 text-sm font-normal leading-[1.25]";
});
const displayText = computed(() => {
  if (props.buttonText) return props.buttonText;
  return props.placeholder || "";
});
const buttonTextClasses = computed(() => {
  const isPlaceholder = !props.buttonText || (!!props.placeholder && props.buttonText === props.placeholder);
  return isPlaceholder ? "text-gray-500" : "text-gray-900";
});
const updateMenuPosition = () => {
  if (!buttonRef.value) return;
  const rect = buttonRef.value.getBoundingClientRect();
  const gap = 4;
  const leftPx = props.align === "right" ? rect.right - 176 : rect.left;
  menuStyle.value = {
    top: `${rect.bottom + gap}px`,
    left: `${leftPx}px`,
  };
}
const setItemRef = (el: Element | null, index: number) => {
  if (!el) return;
  itemRefs.value[index] = el as HTMLElement;
}
const focusItem = (index: number) => {
  const itemsCount = props.items.length;
  if (itemsCount === 0) return;

  const normalizedIndex = ((index % itemsCount) + itemsCount) % itemsCount;
  itemRefs.value[normalizedIndex]?.focus();
}
const openAndFocusItem = async (index = 0) => {
  if (!isOpen.value) {
    updateMenuPosition();
    isOpen.value = true;
    emit("toggle", true);
    await nextTick();
  }
  focusItem(index);
}
const toggle = () => {
  const willOpen = !isOpen.value;
  if (willOpen) updateMenuPosition();
  isOpen.value = willOpen;
  emit("toggle", isOpen.value);
}
const close = () => {
  if (isOpen.value) {
    isOpen.value = false;
    emit("toggle", false);
  }
}
const closeAndFocusButton = () => {
  close();
  buttonRef.value?.focus();
}
const handleItemClick = (item: DropdownItem, index: number, event: Event) => {
  if (!item.to && !item.href) {
    event.preventDefault();
  }
  emit("item-click", item, index);
  close();
}
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdownElement = document.getElementById(dropdownId);
  const buttonElement = document.getElementById(buttonId);

  if (isOpen.value && dropdownElement && buttonElement && !dropdownElement.contains(target) && !buttonElement.contains(target)) {
    close();
  }
}
const handleScrollOrResize = () => {
  if (isOpen.value) close();
}
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", handleScrollOrResize, true);
  window.addEventListener("resize", handleScrollOrResize);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleScrollOrResize, true);
  window.removeEventListener("resize", handleScrollOrResize);
});
</script>

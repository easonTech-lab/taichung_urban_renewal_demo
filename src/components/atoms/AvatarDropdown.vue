<template>
  <div class="relative inline-flex">
    <button
      :id="buttonId"
      type="button"
      class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100"
      :class="buttonClass"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
      @keydown.esc="close"
    >
      <span v-if="avatarText" class="text-xs font-medium text-gray-900">{{ avatarText }}</span>
      <img v-else-if="avatarSrc" :src="avatarSrc" alt="User dropdown" class="h-full w-full object-cover" />
    </button>

    <div
      v-show="isOpen"
      :id="dropdownId"
      class="absolute z-10 mt-12 w-56 rounded-md border border-gray-200 bg-white shadow-sm"
      :class="align === 'right' ? 'right-0' : '-left-8'"
      role="menu"
      :aria-labelledby="buttonId"
    >
      <div class="px-4 py-3 text-sm text-gray-900">
        <div class="font-semibold">{{ name }}</div>
        <div class="truncate text-gray-500">{{ email }}</div>
      </div>
      <div class="h-px bg-gray-100"></div>
      <div class="h-px bg-gray-100"></div>
      <ul class="py-1 text-sm font-normal text-gray-500" :aria-labelledby="buttonId">
        <li v-for="(item, index) in items" :key="index">
          <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href || undefined"
            :type="item.href ? undefined : 'button'"
            class="flex w-full items-center gap-1.5 px-4 py-2 text-left"
            :class="itemClass(item)"
            @click="handleItemClick(item, index, $event)"
            @keydown.enter="handleItemClick(item, index, $event)"
            @keydown.space.prevent="handleItemClick(item, index, $event)"
          >
            <Icon v-if="item.icon" :name="item.icon" :size="20" class="text-primary-600" aria-hidden="true" />
            <span class="flex-1">{{ item.label }}</span>
            <Icon v-if="showChevron" name="arrowRight" :size="20" class="text-gray-400" aria-hidden="true" />
          </component>
        </li>
      </ul>
      <div class="h-px bg-gray-100"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Icon from "@/components/atoms/Icon.vue";
export interface AvatarDropdownItem {
  label: string;
  href?: string;
  tone?: "default" | "danger";
  icon?: string;
}
const props = withDefaults(
  defineProps<{
    avatarSrc?: string;
    avatarText?: string;
    name: string;
    email: string;
    items: AvatarDropdownItem[];
    align?: "left" | "right";
    buttonClass?: string;
    showChevron?: boolean;
  }>(),
  {
    align: "left",
    buttonClass: "cursor-pointer",
    showChevron: true,
  }
);
const emit = defineEmits<{
  (e: "item-click", item: AvatarDropdownItem, index: number): void;
  (e: "toggle", isOpen: boolean): void;
}>();
const isOpen = ref(false);
const buttonId = computed(() => `avatar-dropdown-button-${Math.random().toString(36).substring(2, 11)}`);
const dropdownId = computed(() => `avatar-dropdown-${Math.random().toString(36).substring(2, 11)}`);
const toggle = () => {
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
};
const close = () => {
  if (!isOpen.value) return;
  isOpen.value = false;
  emit("toggle", false);
};
const handleItemClick = (item: AvatarDropdownItem, index: number, event: Event) => {
  if (!item.href) {
    event.preventDefault();
  }
  emit("item-click", item, index);
  close();
};
const itemClass = (item: AvatarDropdownItem) => {
  if (item.tone === "danger") return "text-red-600";
  return "text-gray-500";
};
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdownElement = document.getElementById(dropdownId.value);
  const buttonElement = document.getElementById(buttonId.value);
  if (isOpen.value && dropdownElement && buttonElement && !dropdownElement.contains(target) && !buttonElement.contains(target)) {
    close();
  }
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

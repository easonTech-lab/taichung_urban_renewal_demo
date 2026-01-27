<template>
  <div id="accordion-flush" data-accordion="collapse" data-active-classes="bg-gray-100 text-gray-900" data-inactive-classes="text-gray-700">
    <template v-for="(item, index) in items" :key="index">
      <h2 :id="`accordion-flush-heading-${index}`">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 border-b border-gray-300 py-5 font-medium text-gray-700 rtl:text-right"
          :class="isOpen(index) ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
          :data-accordion-target="`#accordion-flush-body-${index}`"
          :aria-expanded="isOpen(index)"
          :aria-controls="`accordion-flush-body-${index}`"
          @click="toggle(index)"
        >
          <span>{{ item.title }}</span>
          <Icon name="arrowDown" :size="20" class="shrink-0 transition-transform" :class="isOpen(index) ? 'rotate-180' : ''" data-accordion-icon aria-hidden="true" />
        </button>
      </h2>
      <div :id="`accordion-flush-body-${index}`" :class="isOpen(index) ? '' : 'hidden'" :aria-labelledby="`accordion-flush-heading-${index}`">
        <div class="py-5 text-gray-700" :class="index < items.length - 1 ? 'border-b border-gray-300' : ''">
          <slot :name="`content-${index}`" :item="item">
            <div v-html="item.content"></div>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Icon from "@/components/atoms/Icon.vue";

export interface AccordionItem {
  title: string;
  content?: string;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[];
    openFirst?: boolean;
    allowMultiple?: boolean;
  }>(),
  {
    openFirst: false,
    allowMultiple: false,
  }
);

const emit = defineEmits<{
  toggle: [index: number, isOpen: boolean];
  "update:openIndex": [index: number | number[]];
}>();

const openIndexes = ref<number[]>(props.openFirst ? [0] : []);

const isOpen = (index: number) => {
  return openIndexes.value.includes(index);
};

const toggle = (index: number) => {
  const wasOpen = isOpen(index);
  if (props.allowMultiple) {
    // 允許多個同時展開
    const currentIndex = openIndexes.value.indexOf(index);
    if (currentIndex > -1) {
      openIndexes.value.splice(currentIndex, 1);
    } else {
      openIndexes.value.push(index);
    }
  } else {
    // 只允許一個展開
    if (openIndexes.value.includes(index)) {
      openIndexes.value = [];
    } else {
      openIndexes.value = [index];
    }
  }
  const isNowOpen = isOpen(index);
  emit("toggle", index, isNowOpen);
  emit("update:openIndex", props.allowMultiple ? openIndexes.value : openIndexes.value[0]);
};
</script>

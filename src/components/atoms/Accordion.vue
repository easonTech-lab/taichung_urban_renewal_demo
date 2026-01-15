<template>
  <div
    id="accordion-flush"
    data-accordion="collapse"
    data-active-classes="bg-neutral-primary text-heading"
    data-inactive-classes="text-body"
  >
    <template v-for="(item, index) in items" :key="index">
      <h2 :id="`accordion-flush-heading-${index}`">
        <button
          type="button"
          class="border-default flex w-full items-center justify-between gap-3 border-b py-5 font-medium rtl:text-right"
          :class="isOpen(index) ? 'bg-neutral-primary text-heading' : 'text-body'"
          :data-accordion-target="`#accordion-flush-body-${index}`"
          :aria-expanded="isOpen(index)"
          :aria-controls="`accordion-flush-body-${index}`"
          @click="toggle(index)"
        >
          <span>{{ item.title }}</span>
          <Icon
            name="arrowDown"
            :size="20"
            class="shrink-0 transition-transform"
            :class="isOpen(index) ? 'rotate-180' : ''"
            data-accordion-icon
            aria-hidden="true"
          />
        </button>
      </h2>
      <div
        :id="`accordion-flush-body-${index}`"
        :class="isOpen(index) ? '' : 'hidden'"
        :aria-labelledby="`accordion-flush-heading-${index}`"
      >
        <div class="text-body py-5" :class="index < items.length - 1 ? 'border-default border-b' : ''">
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

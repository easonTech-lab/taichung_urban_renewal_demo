<template>
  <div class="space-y-4 p-8">
    <!-- Modal toggle button -->
    <ButtonCTA variant="primary" @click="showModal = true">Toggle modal</ButtonCTA>

    <!-- 範例 1: 使用默認結構（title + body + footer） -->
    <Modal v-model="showModal" title="Static modal" :static="isStatic">
      <p class="leading-relaxed text-gray-700">
        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service
        agreements to comply.
      </p>
      <p class="leading-relaxed text-gray-700">
        The European Union's General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It
        requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
      </p>

      <template #footer>
        <ButtonCTA variant="primary" @click="showModal = false">I accept</ButtonCTA>
        <ButtonCTA variant="gray" @click="showModal = false">Decline</ButtonCTA>
      </template>
    </Modal>

    <!-- 範例 2: 完全自定義 header -->
    <ButtonCTA variant="primary" @click="showCustomModal = true">Custom Header Modal</ButtonCTA>
    <Modal v-model="showCustomModal">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="check" :size="24" class="text-green-500" />
          <h3 class="text-lg font-medium text-gray-900">自定義標題</h3>
        </div>
        <button
          type="button"
          class="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          @click="showCustomModal = false"
        >
          <Icon name="close" :size="20" />
        </button>
      </template>

      <template #body>
        <div class="text-center">
          <p class="text-gray-700">這是完全自定義的 body 內容</p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <ButtonCTA variant="gray" @click="showCustomModal = false">取消</ButtonCTA>
          <ButtonCTA variant="primary" @click="showCustomModal = false">確認</ButtonCTA>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "@/components/atoms/Modal.vue";
import ButtonCTA from "@/components/atoms/ButtonCTA.vue";
import Icon from "@/components/atoms/Icon.vue";

const showModal = ref(false);
const showCustomModal = ref(false);
const isStatic = ref(false);
</script>

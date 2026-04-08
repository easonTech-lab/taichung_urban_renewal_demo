<template>
  <div class="min-h-screen bg-[#f3f5fa]">
    <div class="px-[60px] pb-0 pt-[40px]">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <div class="px-[60px] py-[40px]">
      <div class="rounded-lg bg-white px-[40px] py-[32px] shadow-sm">
        <div class="border-b border-gray-300 pb-8">
          <h1 class="text-2xl font-medium leading-none text-gray-900">
            {{ downloadDetail.title }}
          </h1>
          <div class="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-6">
              <p class="text-base text-gray-700">發布日期：{{ downloadDetail.publishDate }}</p>
              <p class="text-base text-gray-700">最後異動日期：{{ downloadDetail.updatedDate }}</p>
              <p class="text-base text-gray-700">發布單位：{{ downloadDetail.department }}</p>
              <Tag variant="category" :text="downloadDetail.category" />
            </div>
            <div class="flex items-center gap-2 text-base text-gray-700">
              <span>瀏覽人次: {{ downloadDetail.views.toLocaleString() }}</span>
              <Icon name="shareNodes" :size="20" class="h-5 w-5" />
            </div>
          </div>
        </div>
        <div class="mt-8">
          <p class="text-lg leading-[1.8] text-gray-900">{{ downloadDetail.description }}</p>
        </div>
        <div class="mt-8">
          <h2 class="text-[20px] font-bold leading-[1.8] text-gray-900">檔案下載</h2>
          <div class="mt-8 flex max-w-[864px] flex-col gap-4">
            <div
              v-for="file in downloadDetail.files"
              :key="file.name"
              class="flex items-center justify-between rounded-lg border border-gray-300 px-5 py-5"
            >
              <div class="flex min-w-0 items-center gap-4 pr-4">
                <p class="truncate text-lg leading-[1.5] text-gray-900">{{ file.name }}</p>
                <Tag :variant="fileTagVariantMap[file.type]" :text="file.type" />
              </div>
              <div class="flex shrink-0 items-center gap-6">
                <span class="text-base text-gray-500">{{ file.size }}</span>
                <button
                  class="text-sm font-medium text-primary-700 underline decoration-solid underline-offset-2"
                  @click="handleFileDownload(file)"
                >
                  下載
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
import Tag from "@/components/atoms/Tag.vue";
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import FooterSection from "@/components/sections/global/FooterSection.vue";
import { frontendDownloads } from "@/mocks/frontend/downloads";
import { getDownloadsDetailBreadcrumbItems } from "@/utils/breadcrumbs";
import type { DownloadDetailItem, DownloadFileItem } from "@/types/frontend/frontend";

const route = useRoute();

const fileTagVariantMap = {
  DOCX: "docx",
  PDF: "pdf",
  ODT: "odt",
  XLS: "xls",
} as const;

const downloadId = computed(() => Number(route.params.id || 1));

const downloadDetail = computed<DownloadDetailItem>(() => {
  return frontendDownloads.find((item) => item.id === downloadId.value) ?? frontendDownloads[0];
});

const breadcrumbItems = computed(() => getDownloadsDetailBreadcrumbItems(downloadDetail.value.title));

const handleFileDownload = (file: DownloadFileItem) => {
  if (file.fileUrl && file.fileUrl !== "#") {
    window.open(file.fileUrl, "_blank");
    return;
  }
  alert(`下載檔案: ${file.name}`);
};
</script>

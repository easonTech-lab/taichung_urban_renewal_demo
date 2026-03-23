<template>
  <section class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-primary-900">即將到來的審查會議</h2>
        <router-link to="/meetings" class="flex items-center gap-1 text-sm font-normal text-gray-800 hover:text-primary-700 focus:outline-none focus-visible:outline-none">
          <span>更多會議內容</span>
          <Icon name="arrowRightOutline" :size="20" color="#374151" class="h-5 w-5" aria-hidden="true" />
        </router-link>
      </div>
      <!-- Meeting List Card -->
      <div class="relative flex w-full shrink-0 flex-col items-start rounded-lg bg-white p-6 shadow-sm">
        <div
          v-for="(meeting, index) in meetings"
          :key="meeting.id"
          :class="[
            'relative flex w-full shrink-0 flex-col items-center px-0 py-4 sm:flex-row sm:justify-between',
            index < meetings.length - 1 ? 'border-b border-solid border-gray-300' : '',
          ]"
        >
          <!-- Date and Title -->
          <div class="relative flex min-w-0 flex-1 shrink items-center gap-4 leading-normal sm:gap-8 md:gap-16">
            <!-- Date -->
            <div class="relative flex w-[72px] shrink-0 flex-col justify-center text-sm font-normal not-italic text-gray-500 sm:text-base">
              {{ meeting.date }}
            </div>
            <!-- Meeting Title -->
            <div :class="['relative flex min-w-0 flex-1 shrink flex-col justify-center text-base text-black sm:text-lg', meeting.isMedium ? 'font-medium' : 'font-normal']">
              {{ meeting.name }}
            </div>
          </div>
          <!-- Download Section -->
          <div class="relative mt-4 flex h-14 w-full shrink-0 flex-col items-start justify-center gap-0 p-4 sm:mt-0 sm:w-[120px] sm:items-end">
            <a
              :href="meeting.fileUrl"
              class="inline-flex h-10 items-center gap-2 rounded-lg px-0 py-2 text-sm font-medium leading-normal text-primary-700 underline hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              下載檔案
              <Icon name="download" :size="24" class="shrink-0" aria-hidden="true" />
            </a>
            <p class="relative shrink-0 text-sm font-normal leading-normal text-gray-400">
              {{ meeting.fileSize }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import Icon from "@/components/atoms/Icon.vue";
interface MeetingItem {
  id: number;
  date: string;
  name: string;
  fileUrl: string;
  fileSize: string;
  isMedium?: boolean;
}
const meetings: MeetingItem[] = [
  {
    id: 1,
    date: "114/08/14",
    name: "第657次會議議程",
    fileUrl: "/files/meeting-657.pdf",
    fileSize: "500MB",
    isMedium: true,
  },
  {
    id: 2,
    date: "114/08/21",
    name: "第76次專案小組會議議程",
    fileUrl: "/files/meeting-676.pdf",
    fileSize: "500MB",
    isMedium: false,
  },
  {
    id: 3,
    date: "114/10/14",
    name: "第658次會議議程",
    fileUrl: "/files/meeting-658.pdf",
    fileSize: "500MB",
    isMedium: true,
  },
];
</script>

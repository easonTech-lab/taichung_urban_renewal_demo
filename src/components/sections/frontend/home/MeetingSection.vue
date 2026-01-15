<template>
  <section class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-primary-900">即將到來的審查會議</h2>
        <router-link
          to="/meetings"
          class="flex items-center gap-1 text-sm font-normal text-gray-800 hover:text-primary-700"
        >
          <span>更多會議內容</span>
          <Icon name="arrowright" :size="16" fill="currentColor" class="shrink-0" aria-hidden="true" />
        </router-link>
      </div>

      <!-- Meeting List Card -->
      <div class="relative flex w-full shrink-0 flex-col items-start rounded-card bg-white p-6 shadow-card">
        <div
          v-for="(meeting, index) in meetings"
          :key="meeting.id"
          :class="[
            'relative flex w-full shrink-0 items-center justify-between px-0 py-4',
            index < meetings.length - 1 ? 'border-b border-solid border-gray-300' : '',
          ]"
        >
          <!-- Date and Title -->
          <div class="relative flex shrink-0 items-center gap-16 leading-normal">
            <!-- Date -->
            <div
              class="relative flex w-20 shrink-0 flex-col justify-center text-base font-normal not-italic text-gray-500"
            >
              {{ meeting.date }}
            </div>
            <!-- Meeting Title -->
            <div
              :class="[
                'relative flex shrink-0 flex-col justify-center whitespace-nowrap text-lg text-black',
                meeting.isMedium ? 'font-medium' : 'font-normal',
              ]"
            >
              {{ meeting.name }}
            </div>
          </div>

          <!-- Download Section -->
          <div class="relative flex h-14 w-[120px] shrink-0 flex-col items-end justify-center gap-0 p-4">
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
  isMedium?: boolean; // 是否使用 medium 字重
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

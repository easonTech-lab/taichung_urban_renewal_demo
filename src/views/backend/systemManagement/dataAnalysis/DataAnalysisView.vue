<template>
  <div class="min-h-screen bg-indigo-50">
    <SidebarSection @item-select="handleSidebarItemSelect" />
    <div class="flex flex-1 flex-col gap-10 p-4 sm:ml-[328px] sm:p-10">
      <div class="flex flex-col gap-6">
        <Breadcrumb />
        <h1 class="text-3xl font-bold leading-[30px] text-gray-900">數據分析</h1>
      </div>
      <div class="flex min-h-[520px] items-center justify-center rounded-lg bg-white p-10 shadow-sm">
        <div class="text-center">
          <p class="mb-2 text-3xl font-bold text-gray-900">施工中</p>
          <p class="text-base text-gray-600">此頁面正在建置中，敬請期待</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/atoms/Breadcrumb.vue";
import SidebarSection from "@/components/sections/backend/SidebarSection.vue";

const handleSidebarItemSelect = (itemName: string) => {
  console.log("Selected sidebar item:", itemName);
};
</script>

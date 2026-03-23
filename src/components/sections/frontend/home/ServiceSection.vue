<template>
  <section class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <h2 class="mb-6 text-2xl font-semibold">快捷服務</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="service in services" :key="service.href" :title="service.title" :icon-name="service.iconName" :href="service.href" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ServiceCard from "@/components/molecules/ServiceCard.vue";
const services = ref([
  { title: "公聽會", iconName: "pubhearing", href: "/events" },
  { title: "公開展覽", iconName: "exhibition", href: "/exhibitions" },
  { title: "聽證會", iconName: "hearing", href: "/hearings" },
]);
</script>

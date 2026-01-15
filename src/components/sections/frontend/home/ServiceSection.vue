<template>
  <section class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <h2 class="mb-6 text-2xl font-semibold">快捷服務</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard title="公聽會" icon-name="pubhearing" href="/events" />
        <ServiceCard title="公開展覽" icon-name="exhibition" href="/exhibitions" />
        <ServiceCard title="聽證會" icon-name="hearing" href="/hearings" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ServiceCard from "@/components/molecules/ServiceCard.vue";
</script>

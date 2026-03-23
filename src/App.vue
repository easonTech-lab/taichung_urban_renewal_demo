<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <NavbarSection />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import NavbarSection from "@/components/sections/global/NavbarSection.vue";
</script>

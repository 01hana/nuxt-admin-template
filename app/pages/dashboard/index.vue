<script setup lang="ts">
import CardInfo from './CardInfo.vue';
import RevenueChart from './RevenueChart.vue';
import GrowthChart from './GrowthChart.vue';

definePageMeta({
  alias: ['/'],
});
</script>

<template>
  <div class="space-y-4">
    <CardInfo />
    <div class="grid grid-cols-2 gap-4">
      <RevenueChart />
      <GrowthChart />
    </div>
  </div>
</template>

<style scoped></style>

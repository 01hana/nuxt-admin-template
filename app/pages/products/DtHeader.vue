<script setup lang="ts">
const groups = ref([
  {
    id: 'fields',
    label: '進階搜尋欄位',
    items: [
      {
        label: 'Benjamin Canac',
      },
      {
        label: 'Sylvain Marroufin',
      },
    ],
  },
]);
</script>

<template>
  <TableHeader :groups />
</template>

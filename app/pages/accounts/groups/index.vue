<script setup lang="ts">
import DtHeader from './DtHeader.vue';
import DtTable from './DtTable.vue';
import FormModal from './FormModal.vue';

provide(useModalKey, useModal());
provide(DtUtils.key, new DtUtils(useGroups()));
</script>

<template>
  <UCard>
    <template #header>
      <DtHeader />
    </template>

    <DtTable />

    <FormModal />
  </UCard>
</template>

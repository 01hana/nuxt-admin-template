<script setup lang="ts">
const { locale } = useI18n();

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
});
</script>

<template>
  <UApp :toaster="{ position: 'bottom-center' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

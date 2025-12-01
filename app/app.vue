<script setup lang="ts">
import { sideMenu } from '~~/constants/nav';

const { t, locale } = useI18n();
const route = useRoute();

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  title: () => {
    const flatMenu = sideMenu.flatMap(item => {
      if (!item.children) return item.name ? [item.name] : [];

      return item.children.map(child => child.name);
    });

    const menu = flatMenu.find(item => item === route.name);

    if (!menu) return '';

    return t(`menu.${menu}`);
  },
  titleTemplate: (title?: string) => (title ? title + ' - ' : '') + t('sitename'),
});
</script>

<template>
  <UApp :toaster="{ position: 'bottom-center' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

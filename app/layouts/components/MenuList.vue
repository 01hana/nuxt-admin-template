<script setup lang="ts">
import { sideMenu } from '../../../constants/nav';

const emits = defineEmits(['changeRoute']);

const isCollapsed = inject('isCollapsed');

const { t, setLocale } = useI18n();
const route = useRoute();

const transSideMenu = computed(() =>
  sideMenu.map(item => ({
    ...item,
    label: t(item.label),
    children:
      item.children?.map(child => ({
        ...child,
        label: t(child.label),
      })) ?? null,
  })),
);
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="transSideMenu"
    :collapsed="isCollapsed"
    @click="emits('changeRoute')"
    :ui="{
      link: isCollapsed ? 'flex justify-center' : '',
    }"
  />

  <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
    <UModal :title="t('chooseLanguage')">
      <UButton
        icon="solar:settings-broken"
        variant="link"
        color="neutral"
        class="flex items-center gap-2"
      >
        <span v-if="!isCollapsed">{{ t('language') }}</span>
      </UButton>

      <template #body>
        <div class="flex items-center justify-around flex-wrap">
          <UButton
            class="h-32 w-50 text-xl flex flex-col items-center justify-center"
            @click="setLocale('en')"
          >
            <Icon name="circle-flags:en" size="36px" /> <span>English</span>
          </UButton>
          <UButton
            class="h-32 w-50 text-xl flex flex-col items-center justify-center"
            @click="setLocale('zh_tw')"
          >
            <Icon name="circle-flags:tw" size="36px" /> <span>繁體中文</span>
          </UButton>
        </div>
      </template>
    </UModal>

    <UButton
      icon="solar:logout-outline"
      variant="link"
      color="neutral"
      class="flex items-center gap-2"
    >
      <span v-if="!isCollapsed">{{ t('auth.logout') }}</span>
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { sideMenu } from '../../../constants/nav';

const isCollapsed = inject('isCollapsed');

const { t, setLocale } = useI18n();
const route = useRoute();

const transSideMenu = computed(() =>
  sideMenu.map(item => ({
    ...item,
    label: t(item.label),
  })),
);

const emits = defineEmits(['changeRoute']);
</script>

<template>
  <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
    <ul class="space-y-1 flex flex-col gap-1">
      <li v-for="item in transSideMenu" :key="item.to">
        <ULink
          :to="item.to"
          class="flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
          :class="[
            route.path === item.to
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
          ]"
          @click="emits('changeRoute')"
        >
          <div class="flex items-center gap-2">
            <UIcon :name="item.icon" />
            <span v-if="!isCollapsed">{{ item.label }}</span>
          </div>
        </ULink>
      </li>
    </ul>
  </nav>

  <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
    <UModal :title="t('chooseLanguage')">
      <UButton
        icon="fluent:settings-24-regular"
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
      icon="fluent:sign-out-24-regular"
      variant="link"
      color="neutral"
      class="flex items-center gap-2"
    >
      <span v-if="!isCollapsed">{{ t('auth.logout') }}</span>
    </UButton>
  </div>
</template>

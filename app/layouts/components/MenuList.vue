<script setup lang="ts">
const isCollapsed = inject('isCollapsed') as boolean;

const router = useRouter();
const { t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const { menu } = useNavigation();

function changeLang(lang: 'zh-TW' | 'en') {
  const path = switchLocalePath(lang);

  router.push(path);
}
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="menu"
    :collapsed="isCollapsed"
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
        <span
          class="transition-all duration-100 overflow-hidden whitespace-nowrap"
          :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
        >
          {{ t('language') }}
        </span>
      </UButton>

      <template #body>
        <div class="flex items-center justify-around flex-wrap">
          <UButton
            class="h-32 w-50 text-xl flex flex-col items-center justify-center"
            @click="changeLang('en')"
          >
            <Icon name="circle-flags:en" size="36px" /> <span>English</span>
          </UButton>
          <UButton
            class="h-32 w-50 text-xl flex flex-col items-center justify-center"
            @click="changeLang('zh-TW')"
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
      <span
        class="transition-all duration-100 whitespace-nowrap overflow-hidden"
        :class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
      >
        {{ t('auth.logout') }}
      </span>
    </UButton>
  </div>
</template>

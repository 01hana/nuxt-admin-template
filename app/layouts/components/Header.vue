<script setup lang="ts">
import MenuList from './MenuList.vue';

const [open, setOpen] = useAppState(false);

const { t } = useI18n();
const route = useRoute();

watch(
  () => route.name,
  newRoute => {
    if (!newRoute) return;

    setOpen(false);
  },
);
</script>

<template>
  <header class="w-full top-0 left-0 z-50 py-4">
    <div class="flex items-center justify-between xl:justify-end">
      <USlideover
        v-model:open="open"
        side="left"
        class="xl:hidden"
        description="sidebar"
        :ui="{ content: 'max-w-sm', header: 'border-none', description: 'hidden' }"
      >
        <UButton icon="i-heroicons-bars-3" variant="ghost" color="neutral" />

        <template #title>
          <img
            src="@/assets/images/logo/logo.png"
            :alt="t('sitename')"
            class="object-contain h-[120px]"
          />
        </template>

        <template #body>
          <div class="flex flex-none flex-col h-full">
            <MenuList />
          </div>
        </template>
      </USlideover>

      <div class="flex items-center">
        <UButton
          icon="fluent:alert-24-regular"
          variant="link"
          class="text-slate-700 hover:text-slate-900 rounded-2xl"
        />

        <UUser
          name="Eva"
          description="開發工程師"
          size="xl"
          class="cursor-pointer gap-1"
          to="/accounts/profile"
        >
          <template #avatar>
            <div class="flex items-center justify-center w-10 h-10">
              <UIcon name="fluent:slide-text-person-24-regular" class="text-slate-700" />
            </div>
          </template>
        </UUser>
      </div>
    </div>
  </header>
</template>

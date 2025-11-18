<script setup lang="ts">
import type { ModalProps } from '@/composables/useModal';

defineOptions({ inheritAttrs: false });

const { show, title, subtitle, setTitle, afterEnter, afterLeave } = inject(
  useModalKey,
) as ModalProps;

const attrs = useAttrs();
const route = useRoute();
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    fullscreen?: boolean;
    size?: string;
    formId?: string;
    dismissible?: boolean;
  }>(),
  {
    fullscreen: false,
    size: 'w-2xl',
    formId: 'create-edit-form',
    dismissible: true,
  },
);

const { fullscreen, size, formId, dismissible } = toRefs(props);

const pageTitle = computed(() => {
  const key = route.name?.toString().replace(/___.*$/, '') || '';

  return t(`menu.${key}`);
});

setTitle(pageTitle.value);
</script>

<template>
  <UModal
    v-model:open="show"
    :title
    :description="subtitle"
    :dismissible
    :fullscreen
    @after:enter="afterEnter"
    @after:leave="afterLeave"
    class="max-w-screen"
    :class="size"
    v-bind="$attrs"
  >
    <template #body>
      <slot name="content" />
    </template>

    <template #footer="{ close }">
      <slot v-if="$slots.footer" name="footer" />

      <template v-else>
        <UButton :label="subtitle" variant="solid" type="submit" :form="formId" />
        <UButton :label="t('actions.close', 2)" color="neutral" variant="outline" @click="close" />
      </template>
    </template>
  </UModal>
</template>

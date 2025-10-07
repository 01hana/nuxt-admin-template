<script setup lang="ts">
import type { ModalProps } from '@/composables/useModal';

const { show, title, subtitle, setTitle, afterEnter, afterLeave } = inject(
  useModalKey,
) as ModalProps;

const attrs = useAttrs();
const route = useRoute();
const { t } = useI18n();

const pageTitle = computed(() => {
  const key = route.name?.toString().replace(/___.*$/, '') || '';

  return t(`menu.${key}`);
});

setTitle(pageTitle.value);

const {
  size = 'w-2xl',
  fullscreen = false,
  formId = 'create-edit-form',
  dismissible = true,
} = defineProps({
  fullscreen: Boolean,
  size: String,
  formId: String,
  dismissible: Boolean,
});

defineOptions({ inheritAttrs: false });
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

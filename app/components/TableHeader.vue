<script setup lang="ts">
import type { ModalProps } from '@/composables/useModal';

const useSearchModal = useModal();

const { setModal: setSearchModal } = useSearchModal;

const { setModal } = inject(useModalKey) as ModalProps;
const {
  select,
  isSelected,
  isSelectBatch,
  selectVisible,
  getSelectedItems,
  resetDt,
  searchSubmit,
  actionBatch,
  removeBatch,
} = inject(DtUtils.key) as InstanceType<typeof DtUtils>;

const { t } = useI18n();
const {
  isDeleteConfirm,
  isDeleteSpinner,
  setDeleteSpinner,
  setDeleteConfirm,
  onDeleteConfirmAfterLeave,
} = useDeleteConfirm();

const { handleSubmit, resetForm } = useForm({
  validationSchema: { keyword: 'required' },
});

const props = defineProps<{
  actions?: {
    create?: boolean;
    batch?: boolean;
    status?: boolean;
    remove?: boolean;
  };
  groups?: Record<string, any>[];
}>();

const actions = computed(() => ({
  create: props.actions?.create ?? true,
  batch: props.actions?.batch ?? true,
  status: props.actions?.status ?? false,
  remove: props.actions?.remove ?? true,
}));

const batchItems = computed(() => {
  const items = [];

  if (actions.value.remove) {
    items.push({
      label: t('actions.remove'),
      disabled: !isSelected.value,
      onSelect: () => setDeleteConfirm(true),
    });
  }

  if (actions.value.status) {
    items.push(
      {
        label: t('actions.enable'),
        disabled: !isSelected.value,
        onSelect: () => actionBatch('status', true),
      },
      {
        label: t('actions.disable'),
        disabled: !isSelected.value,
        onSelect: () => actionBatch('status', false),
      },
    );
  }

  return items;
});

const onSubmit = handleSubmit(data => searchSubmit(data));

async function onRemove() {
  setDeleteSpinner(true);

  await removeBatch();

  setDeleteConfirm(false);
}

function onReset() {
  resetForm();
  resetDt();
}

provide('useSearchModal', useSearchModal);
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-6 md:col-start-1 md:col-end-4 flex gap-3">
      <UButton
        icon="fluent:add-circle-24-filled"
        :label="t('actions.create')"
        variant="solid"
        @click="setModal(true)"
      />
      <UFieldGroup size="lg">
        <UButton
          v-if="actions.batch"
          color="neutral"
          variant="subtle"
          :icon="
            !isSelectBatch
              ? 'fluent:text-bullet-list-checkmark-20-filled'
              : 'fluent:dismiss-circle-24-regular'
          "
          :label="$t('actions.batch')"
          @click="selectVisible"
        />
        <UDropdownMenu :items="batchItems">
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down">
            <span v-if="isSelected" class="flex items-center gap-1">
              {{ $t('actions.batch', 2) }}
              <UBadge :label="select.count" class="rounded-full px-2" size="sm" />
            </span>
            <span v-else>{{ $t('actions.batchApply') }}</span>
          </UButton>
        </UDropdownMenu>
      </UFieldGroup>
    </div>

    <div class="col-span-6 md:col-span-2 md:col-end-7">
      <UFieldGroup size="lg" class="flex items-center">
        <FormField
          name="keyword"
          :label="t('actions.search')"
          class="search-input w-full"
          :placeholder="t('form.keyword')"
          :hideLabel="true"
        />
        <UTooltip :text="t('actions.search')">
          <UButton
            type="submit"
            color="neutral"
            variant="subtle"
            icon="fluent:search-24-regular"
            class="bg-neutral-100 text-neutral-500"
            @click="onSubmit"
          />
        </UTooltip>

        <UTooltip :text="t('actions.clear')">
          <UButton
            color="neutral"
            variant="subtle"
            icon="fluent:eraser-segment-24-regular"
            class="bg-neutral-100 text-neutral-500"
            @click="onReset"
          />
        </UTooltip>

        <UTooltip v-if="groups" :text="t('actions.advanceSearch')">
          <UButton
            color="neutral"
            variant="subtle"
            icon="fluent:text-bullet-list-24-filled"
            class="bg-neutral-100 text-neutral-500"
            @click="setSearchModal(true)"
          />

          <AdvancedSearch injection-key="useSearchModal" :groups :multiple="true" />
        </UTooltip>
      </UFieldGroup>
    </div>

    <AlertModal
      v-model:open="isDeleteConfirm"
      :title="t('confirm.removeTitle')"
      type="error"
      icon="fluent:delete-24-filled"
      :loading="isDeleteSpinner"
      @callAction="onRemove"
      @after:leave="onDeleteConfirmAfterLeave"
    >
      <template #content>
        <i18n-t
          keypath="confirm.removeBatch"
          tag="div"
          scope="global"
          class="text-center text-base"
        >
          <template #count>
            <UBadge :label="select.count" class="rounded-full bg-red-400 px-2" />
          </template>
        </i18n-t>
      </template>
    </AlertModal>
  </div>
</template>

<style scoped>
:deep(.vxe-input) {
  width: 100%;
  --vxe-ui-input-height-default: 36px;
  border-radius: var(--vxe-ui-base-border-radius) 0 0 var(--vxe-ui-base-border-radius);
}

:deep(.vxe-input--search-icon.vxe-icon-search) {
  font-size: 20px;
  line-height: unset;
  color: var(--ui-color-neutral-500);
}

:deep(.search-input input) {
  border-radius: calc(var(--ui-radius) * 1.5) 0 0 calc(var(--ui-radius) * 1.5) !important;
}

:deep(.search-form) {
  display: flex;
}

:deep(.search-input div) {
  margin-top: 0 !important;
}
</style>

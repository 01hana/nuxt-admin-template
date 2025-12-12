<script setup lang="ts">
import { groupsFields as updateFields } from '~~/constants/form/update-fields';

const { updateDtRowData, params } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;
const { id, show, isAdd, isEdit, setModal, setLoading } = inject(useModalKey) as ModalProps;

const { t } = useI18n();
const { get, create, set, getTable } = useGroups();
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: { name: 'required' },
});
const { formUpdate } = useAppForm(updateFields, setFieldValue);

const {
  defaultActions,
  transSideMenu,
  state: permissions,
  toApi,
  fromApi,
  resetPermissions,
} = usePermissions(t);

const defaultOpened = computed(() => transSideMenu.value.map((_, index) => String(index)));

watch([show, id], async ([isShow, id]) => {
  if (isShow && !id) {
  }

  if (!isShow || !id) return;

  const data = await get(id);

  fromApi(data.permissions);
  formUpdate(data);
});

function onAfterLeave() {
  resetForm();
  resetPermissions();
}

const onSubmit = handleSubmit(async values => {
  setLoading(true);

  const data = { ...values, permissions: toApi() };

  if (isAdd.value) {
    await create(data).then(() => getTable(params.value));
  }

  if (isEdit.value) {
    const res = await set(id.value as string, data);

    updateDtRowData(res);
  }

  setModal(false);
  setLoading(false);
}) as (e?: Event) => Promise<void>;

function isAllChecked(name: string) {
  return Object.values(permissions.value[name] ?? {}).every(Boolean);
}

function toggleAll(name: string, value: boolean) {
  for (const key in permissions.value[name]) {
    permissions.value[name][key as PermissionAction] = value;
  }
}
</script>

<template>
  <Modal @after:leave="onAfterLeave" form-id="create-edit-form">
    <template #content>
      <UForm id="create-edit-form" :state="{}" @submit="onSubmit">
        <div class="flex gap-6 md:flex-row flex-col">
          <div class="flex-1 flex flex-col gap-3">
            <FormField name="name" label="群組名稱" isRequired />
            <FormField name="description" label="描述" fieldType="textarea" />
            <FormField name="sort" label="排序" fieldType="number" />
          </div>

          <USeparator orientation="vertical" class="hidden md:block h-auto self-stretch -my-6" />

          <div class="flex-1 flex flex-col gap-3">
            <h3 class="text-base font-bold text-primary">權限設定</h3>
            <UAccordion
              type="multiple"
              :items="transSideMenu.slice(1)"
              :default-value="defaultOpened"
            >
              <template #content="{ item }">
                <div class="p-4 space-y-3">
                  <UCheckbox
                    :label="t('actions.selectAll')"
                    :model-value="isAllChecked(item.name)"
                    @update:model-value="toggleAll(item.name, !!$event)"
                  />
                  <div
                    v-for="action in defaultActions"
                    :key="action.value"
                    class="flex items-center justify-between"
                  >
                    <span>{{ action.label }} </span>
                    <USwitch v-model="permissions[item.name][action.value]" color="primary" />
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>
        </div>
      </UForm>
    </template>
  </Modal>
</template>

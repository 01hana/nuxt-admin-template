<script setup lang="ts">
import { usersFields as updateFields } from '../../../../constants/form/update-fields';

const { updateDtRowData, params } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;
const { id, show, isAdd, isEdit, setModal } = inject(useModalKey) as ModalProps;

const { get, create, set, getTable, getGroups } = useUsers();
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: {
    account: 'required',
    name: 'required',
    groups: 'required',
    email: 'required|email',
  },
  initialValues: {
    status: true,
  },
});
const { formUpdate } = useAppForm(updateFields, setFieldValue);

const groupOptions = ref<{ id: string; label: string }[]>([]);

watch([show, id], async ([isShow, id]) => {
  if (isShow && !id) {
    groupOptions.value = await getGroups();
  }

  if (!isShow || !id) return;

  const [data, groups] = await Promise.all([get(id), getGroups()]);

  groupOptions.value = groups;

  formUpdate(data);
});

function onAfterLeave() {
  resetForm();
}

const onSubmit = handleSubmit(async values => {
  if (isAdd.value) {
    await create(values).then(() => getTable(params.value));

    setModal(false);
  }

  if (isEdit.value) {
    const res = await set(id.value as string, values);

    updateDtRowData(res);
    setModal(false);
  }
}) as (e?: Event) => Promise<void>;
</script>

<template>
  <Modal size="w-lg" @after:leave="onAfterLeave" form-id="create-edit-form">
    <template #content>
      <UForm id="create-edit-form" :state="{}" @submit="onSubmit">
        <div class="flex flex-col gap-3">
          <FormField name="account" label="帳號" :disabled="isEdit" />
          <FormField name="name" label="使用者名稱" />
          <FormField
            name="groups"
            label="帳戶群組"
            type="select"
            :items="groupOptions"
            :multiple="true"
          />
          <FormField name="email" label="Email" />
          <FormField name="status" label="狀態" type="switch" />
        </div>
      </UForm>
    </template>
  </Modal>
</template>

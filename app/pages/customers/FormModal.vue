<script setup lang="ts">
import { customersFields as updateFields } from '../../../constants/form/update-fields';
import { genderOptions } from '../../../constants/form/options';

const { updateDtRowData, params } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;
const { id, show, isAdd, isEdit, setModal } = inject(useModalKey) as ModalProps;

const { get, create, set, getTable } = useCustomers();
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: {
    name: 'required',
    gender: 'required',
    email: 'required|email',
    mobile: 'required|numeric',
    address: 'required',
  },
});
const { formUpdate } = useAppForm(updateFields, setFieldValue);
const { t: tv } = usePageI18n();
const { t } = useI18n();

const radioItems = computed(() =>
  genderOptions.map(({ id }) => ({
    label: t(`form.gender.${id}`),
    id,
  })),
);

watch([show, id], async ([isShow, id]) => {
  if (isShow && !id) {
  }

  if (!isShow || !id) return;

  const data = await get(id);
  formUpdate(data);
});

function onAfterLeave() {
  resetForm();
}

const onSubmit = handleSubmit(async values => {
  console.log(values);

  return;

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
          <FormField name="name" :label="tv('name')" isRequired />
          <FormField
            name="gender"
            :label="tv('gender')"
            fieldType="radio"
            :items="radioItems"
            isRequired
          />
          <FormField name="mobile" :label="tv('mobile')" isRequired />
          <FormField name="email" label="Email" isRequired />
          <FormField name="address" :label="tv('address')" isRequired />
          <DatePicker name="birthday" :label="tv('birthday')" />
        </div>
      </UForm>
    </template>
  </Modal>
</template>

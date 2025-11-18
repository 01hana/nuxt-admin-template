<script setup lang="ts">
import { ordersFields as updateFields } from '../../../constants/form/update-fields';

const { updateDtRowData, params } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;
const { id, show, isAdd, isEdit, setModal } = inject(useModalKey) as ModalProps;

const { get, create, set, getTable } = useOrders();
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: {},
});
const { formUpdate } = useAppForm(updateFields, setFieldValue);

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
  <Modal @after:leave="onAfterLeave" form-id="create-edit-form">
    <template #content>
      <UForm id="create-edit-form" :state="{}" @submit="onSubmit">
        <div class="flex gap-6 md:flex-row flex-col">
          <div class="flex-1 flex flex-col gap-3">
            <h3 class="font-bold text-primary">訂單資訊</h3>
            <FormField name="order_number" label="訂單編號(系統自動產生)" disabled />
            <FormField name="payment_method" label="付款方式" fieldType="radio" :items="[]" />
            <FormField name="delivery_method" label="寄送方式" fieldType="radio" :items="[]" />
            <FormField name="payment_status" label="付款狀態" fieldType="select" :items="[]" />
            <FormField name="delivery_status" label="寄送狀態" fieldType="select" :items="[]" />
            <FormField name="order_status" label="訂單狀態" fieldType="select" :items="[]" />
          </div>

          <USeparator orientation="vertical" class="hidden md:block h-auto self-stretch -my-6" />

          <div class="flex-1 flex flex-col gap-3">
            <h3 class="font-bold text-primary">收件人資訊</h3>
            <FormField name="customer" label="姓名" />
            <FormField name="mobile" label="電話" />
            <FormField name="email" label="Email" />
            <FormField name="address" label="地址" />
          </div>
        </div>
      </UForm>
    </template>
  </Modal>
</template>

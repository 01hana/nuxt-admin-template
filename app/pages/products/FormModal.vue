<script setup lang="ts">
import { productsFields as updateFields } from '../../../constants/form/update-fields';

const { updateDtRowData, params } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;
const { id, show, isAdd, isEdit, setModal } = inject(useModalKey) as ModalProps;

const { get, create, set, getTable } = useProducts();
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: { name: 'required', number: 'required', cover: 'required', images: 'required' },
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
  console.log(values);

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

const items = ref([
  {
    label: 'Backlog',
    id: 'backlog',
  },
  {
    label: 'Todo',
    id: 'todo',
  },
  {
    label: 'In Progress',
    id: 'in_progress',
  },
  {
    label: 'Done',
    id: 'done',
  },
]);
</script>

<template>
  <Modal size="w-4xl" @after:leave="onAfterLeave" form-id="create-edit-form">
    <template #content>
      <UForm id="create-edit-form" :state="{}" @submit="onSubmit">
        <div class="flex gap-6 md:flex-row flex-col">
          <div class="flex-1 flex flex-col gap-3">
            <FormField name="name" label="商品名稱" />
            <FormField name="number" label="商品編號" />
            <FormField name="category" label="類別" :items type="select" />
            <FormField name="stock" label="庫存" type="number" />
            <FormField name="price" label="單價" />
            <FormField name="status" label="狀態" type="switch" />
          </div>

          <USeparator orientation="vertical" class="hidden md:block h-auto self-stretch -my-6" />

          <div class="flex-2 flex flex-col gap-3">
            <FileUpload label="封面圖" name="cover" description="(max 2MB)" accept="image/*" />

            <FileUpload
              label="商品照"
              name="images"
              description="(max 2MB)"
              accept="image/*"
              multiple
            />
          </div>
        </div>
      </UForm>
    </template>
  </Modal>
</template>

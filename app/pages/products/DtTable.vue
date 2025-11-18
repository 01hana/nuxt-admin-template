<script setup lang="ts">
const { params, filters, actionStatus } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;

// onMounted(() => {
//   const { getTable } = useProducts();

//   getTable(params.value);
// });
</script>

<template>
  <TableData :sort="['updated_at', 'desc']">
    <vxe-column min-width="120" field="cover" title="封面圖" align="center">
      <template #default="{ row }">
        <div class="flex justify-center">
          <vxe-image src="https://vxeui.com/resource/img/546.gif" height="50" />
        </div>
      </template>
    </vxe-column>

    <vxe-column min-width="200" field="images" title="商品照" align="center" show-overflow>
      <template #default="{ row }">
        <!-- <vxe-image-group
          :url-list="row.images"
          show-preview
          :image-style="{ width: 36, height: 36 }"
        /> -->
        <vxe-upload
          readonly
          mode="image"
          :model-value="row.images"
          :more-config="{ maxCount: 1 }"
          :image-config="{ width: 40, height: 40 }"
        />
      </template>
    </vxe-column>

    <vxe-column min-width="150" field="number" title="商品編號" sortable />

    <vxe-column min-width="200" field="name" title="商品名稱" />

    <vxe-column min-width="120" field="category" title="分類" align="center" :filters />

    <vxe-column
      min-width="120"
      field="price"
      title="單價"
      sortable
      align="center"
      :cell-render="{
        name: 'FormatNumberInput',
        props: { type: 'amount', align: 'right' },
      }"
    />

    <vxe-column min-width="120" field="stock" title="庫存數量" align="center" />

    <vxe-column min-width="120" field="status" title="狀態" align="center" :filters>
      <template #default="{ row }">
        <FormField
          v-model="row.status"
          name="status"
          fieldType="switch"
          class="flex justify-center"
        />
      </template>
    </vxe-column>

    <vxe-column min-width="150" field="updated_at" title="最後更新時間" />
  </TableData>
</template>

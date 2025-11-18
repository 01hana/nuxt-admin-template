<script setup lang="ts">
const { params, filters } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;

// onMounted(() => {
//   const { getTable } = useOrders();

//   getTable(params.value);
// });
</script>

<template>
  <TableData :sort="['updated_at', 'desc']">
    <vxe-column min-width="150" field="order_number" title="訂單編號" />

    <vxe-column min-width="200" field="items" title="訂購商品" align="center">
      <template #default="{ row }">
        <UButton label="查看" />
      </template>
    </vxe-column>

    <vxe-column min-width="200" field="address" title="收件資訊">
      <template #default="{ row }">
        <div>{{ row.customer }}</div>
        <div>{{ row.mobile }}</div>
        <div>{{ row.email }}</div>
        <div>{{ row.address }}</div>
      </template>
    </vxe-column>

    <vxe-column min-width="150" field="total_price" title="總金額" align="center" />

    <vxe-column min-width="130" field="payment_method" title="付款方式" align="center" />

    <vxe-column min-width="130" field="delivery_method" title="寄送方式" align="center" />

    <vxe-column min-width="150" field="payment_status" title="付款狀態" align="center" :filters>
      <template #default="{ row }">
        {{ row.payment_status }}
      </template>
    </vxe-column>

    <vxe-column min-width="150" field="delivery_status" title="寄送狀態" align="center" :filters>
      <template #default="{ row }">
        {{ row.delivery_status }}
      </template>
    </vxe-column>

    <vxe-column min-width="150" field="order_status" title="訂單狀態" align="center" :filters>
      <template #default="{ row }">
        {{ row.order_status }}
      </template>
    </vxe-column>

    <vxe-column min-width="200" field="memo" title="備註" />

    <vxe-column min-width="150" field="created_at" title="建立時間" sortable />

    <vxe-column min-width="150" field="updated_at" title="最後更新時間" sortable />
  </TableData>
</template>

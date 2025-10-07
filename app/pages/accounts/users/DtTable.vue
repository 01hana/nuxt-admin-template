<script setup lang="ts">
const { params, filters } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;

onMounted(() => {
  const { getTable } = useUsers();

  getTable(params.value);
});
</script>

<template>
  <TableData :sort="['updated_at', 'desc']">
    <vxe-column min-width="150" field="account" title="帳號" />

    <vxe-column min-width="200" field="name" title="使用者名稱" />

    <vxe-column min-width="250" field="groups" title="帳戶群組" show-overflow></vxe-column>

    <vxe-column min-width="200" field="email" title="email" />

    <vxe-column min-width="120" field="status" title="狀態" show-overflow></vxe-column>

    <vxe-column min-width="150" field="updated_at" title="最後更新時間" />
  </TableData>
</template>

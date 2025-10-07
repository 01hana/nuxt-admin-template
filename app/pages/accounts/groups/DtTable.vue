<script setup lang="ts">
const { params } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;

onMounted(() => {
  const { getTable } = useGroups();

  getTable(params.value);
});
</script>

<template>
  <TableData :sort="['updated_at', 'desc']">
    <vxe-column min-width="150" field="name" title="名稱" />

    <vxe-column min-width="150" field="description" title="描述 " />

    <vxe-column min-width="150" field="sort" title="排序" sortable align="center" />

    <vxe-column
      min-width="150"
      field="updated_at"
      title="最後更新時間"
      sortable
      formatter="formatDate"
    />
  </TableData>
</template>

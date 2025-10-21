<script setup lang="ts">
const { params, filters } = inject(DtUtils.key) as InstanceType<typeof DtUtils>;

onMounted(() => {
  const { getTable, getFilters } = useUsers();

  getTable(params.value);
  getFilters(['groups', 'status']);
});

function statusChange(id: string, value: boolean) {
  const { set } = useUsers();

  set(id, { status: value });
}
</script>

<template>
  <TableData :sort="['updated_at', 'desc']">
    <vxe-column min-width="150" field="account" title="帳號" />

    <vxe-column min-width="200" field="name" title="使用者名稱" />

    <vxe-column min-width="250" field="groups" title="帳戶群組" :filters show-overflow>
      <template #default="{ row }">
        <UBadge
          v-for="item in row.groups"
          :key="item"
          :label="item"
          class="text-gray-00 bg-gray-300 mx-1"
          size="lg"
        />
      </template>
    </vxe-column>

    <vxe-column min-width="200" field="email" title="email" />

    <vxe-column min-width="120" field="status" title="狀態" align="center" :filters>
      <template #default="{ row }">
        <FormField
          v-model="row.status"
          name="status"
          type="switch"
          class="flex justify-center"
          @change="statusChange(row.id, row.status)"
        />
      </template>
    </vxe-column>

    <vxe-column
      min-width="150"
      field="updated_at"
      title="最後更新時間"
      sortable
      formatter="formatDate"
    />
  </TableData>
</template>

<script setup lang="ts">
const { t } = useI18n();

const items = [
  {
    label: '商品數量',
    value: 2000,
    icon: 'fluent:box-24-regular',
  },
  {
    label: '會員數量',
    value: 520,
    icon: 'fluent:person-24-regular',
  },
  {
    label: '訂單數量',
    value: 30,
    icon: 'fluent:cart-24-regular',
  },
  {
    label: '銷售總額',
    value: 40567,
    icon: 'solar:chat-round-money-outline',
  },
];
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <UCard
      v-for="{ label, value, icon } in items"
      class="p-4 flex items-center justify-between rounded-xl ring-0 transition"
    >
      <div class="flex flex-col gap-1">
        <div class="border-1 border-gray-300 rounded-xl p-2 inline-flex w-fit">
          <UIcon :name="icon" class="text-gray-600" size="16"/>
        </div>

        <div class="text-2xl font-semibold">{{ value }}</div>

        <div class="text-gray-600">{{ label }}</div>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import MenuList from './MenuList.vue';

const isCollapsed = inject('isCollapsed');
</script>

<template>
  <aside
    class="hidden xl:flex flex-none dark:bg-gray-900 flex-col transition-all duration-300"
    :class="isCollapsed ? 'w-20' : 'w-[250px]'"
  >
    <div
      class="flex items-center px-4 mb-4"
      :class="[isCollapsed ? 'justify-center h-20' : 'justify-between']"
    >
      <div v-if="!isCollapsed" class="text-xl font-bold my-3 block">
        <img src="@/assets/images/logo/logo.png" alt="logo" />
      </div>

      <UButton
        :icon="isCollapsed ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'"
        variant="ghost"
        color="neutral"
        @click="isCollapsed = !isCollapsed"
      />
    </div>

    <MenuList />
  </aside>
</template>

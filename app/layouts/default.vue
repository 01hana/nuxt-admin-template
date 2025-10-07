<script setup lang="ts">
import Header from './components/Header.vue';
import SideBar from './components/SideBar.vue';

const isCollapsed = ref(false);

provide('isCollapsed', isCollapsed);
</script>

<template>
  <div class="min-h-screen max-w-screen flex">
    <SideBar />

    <UContainer
      class="bg-slate-100 dark:bg-slate-900"
      :class="[isCollapsed ? 'w-full' : 'xl:w-[calc(100vw-250px)]']"
    >
      <Header />

      <main>
        <slot />
      </main>
    </UContainer>
  </div>
</template>

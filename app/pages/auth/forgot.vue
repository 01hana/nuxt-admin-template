<script setup lang="ts">
definePageMeta({
  layout: 'full',
  meta: {
    resource: 'auth',
  },
});

const { t } = useI18n();
const localePath = useLocalePath();

const { handleSubmit } = useForm({
  validationSchema: {
    email: 'required|email',
  },
});

const onSubmit = handleSubmit(values => {
  console.log(values);
});
</script>

<template>
  <UCard class="w-[400px] shadow-lg ring-0 pb-5">
    <template #header>
      <img src="@/assets/images/logo/logo.png" alt="logo" class="w-full h-[150px] object-contain" />
    </template>

    <UAlert
      :description="t('auth.receiveEmail')"
      variant="soft"
      class="mb-5 font-bold"
      icon="fluent:info-24-regular"
    />

    <UForm :state="{}" class="space-y-3" @submit="onSubmit">
      <FormField name="email" label="Email" icon="fluent:person-mail-24-regular" class="mb-1" />
      <div class="w-full flex justify-end">
        <NuxtLink :to="localePath('/auth/login')" class="text-sm text-primary">{{
          t('auth.hasAccount')
        }}</NuxtLink>
      </div>

      <UButton
        type="submit"
        variant="solid"
        class="w-full mt-8 flex justify-center"
        :label="t('actions.enter', 0)"
      />
    </UForm>
  </UCard>
</template>

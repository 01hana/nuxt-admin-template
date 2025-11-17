<script setup lang="ts">
definePageMeta({
  layout: 'full',
});

const { t } = useI18n();

const show = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    account: 'required',
    password: 'required',
  },
});

const onSubmit = handleSubmit(values => {
  console.log(values);
});
</script>

<template>
  <UCard class="w-[400px] shadow-lg ring-0 pb-5">
    <template #header>
      <img src="@/assets/images/logo/logo.png" alt="logo" />
    </template>

    <UForm :state="{}" class="space-y-3" @submit="onSubmit">
      <FormField name="account" label="帳號" icon="fluent:person-lock-24-regular" />
      <FormField
        name="password"
        label="密碼"
        icon="fluent:lock-closed-24-regular"
        :type="show ? 'text' : 'password'"
      >
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="show ? 'fluent:eye-off-24-filled' : 'fluent:eye-24-filled'"
          @click="show = !show"
        />
      </FormField>

      <UButton
        type="submit"
        variant="solid"
        class="w-full mt-8 flex justify-center"
        :label="t('auth.login')"
      />
    </UForm>
  </UCard>
</template>

<style scoped></style>

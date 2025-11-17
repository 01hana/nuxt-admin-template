<script setup lang="ts">
const items = [
  {
    label: '帳戶資訊',
    icon: 'i-lucide-user',
    slot: 'account',
  },
  {
    label: '密碼資訊',
    icon: 'i-lucide-lock',
    slot: 'password',
  },
];

const { defineField, setFieldValue, handleSubmit } = useForm({
  validationSchema: {},
});

const [password] = defineField('password');

const show = ref(false);
</script>

<template>
  <UPageCard title="個人資訊 Profile settings">
    <UTabs :items="items">
      <template #account>
        <UForm id="account-form" :state="{}" class="flex flex-col gap-4">
          <FormField name="account" label="帳號" disabled />
          <FormField name="name" label="使用者名稱" />
          <FormField name="email" label="Email" />

          <UButton
            :label="$t('actions.save')"
            type="submit"
            variant="soft"
            class="self-end"
            form="account-form"
          />
        </UForm>
      </template>

      <template #password>
        <UForm id="password-form" :state="{}" class="flex flex-col gap-4">
          <FormField name="current_password" label="舊密碼" :type="show ? 'text' : 'password'">
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'fluent:eye-off-24-filled' : 'fluent:eye-24-filled'"
              @click="show = !show"
            />
          </FormField>

          <FormField name="password" label="密碼" :type="show ? 'text' : 'password'">
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'fluent:eye-off-24-filled' : 'fluent:eye-24-filled'"
              @click="show = !show"
            />
          </FormField>

          <CheckPwdList v-model="password" />

          <FormField name="confirm_password" label="密碼確認" :type="show ? 'text' : 'password'">
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'fluent:eye-off-24-filled' : 'fluent:eye-24-filled'"
              @click="show = !show"
            />
          </FormField>

          <UButton
            :label="$t('actions.save')"
            type="submit"
            variant="soft"
            class="self-end"
            form="password-form"
          />
        </UForm>
      </template>
    </UTabs>
  </UPageCard>
</template>

<style scoped></style>

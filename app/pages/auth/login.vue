<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core';

definePageMeta({
  layout: 'full',
  meta: {
    resource: 'auth',
  },
});

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { login, firstLogin } = useAuth();
const [loading, setLoading] = useAppState(false);
const [isFirstLogin, setFirstLogin] = useAppState(false);

useHead({
  title: t('auth.login'),
});

const show = ref(false);
const pwdRule = ref('required');

const { defineField, handleSubmit } = useForm({
  validationSchema: {
    account: 'required',
    password: pwdRule.value,
    confirm_password: route.query.token ? 'required|confirmed:@password' : undefined,
  },
});

const [password] = defineField('password');

onMounted(() => {
  firstLoginVerify();
});

async function firstLoginVerify() {
  if (!route.query.token) return;

  setLoading(true);

  pwdRule.value = 'required|password';

  await promiseTimeout(350);

  setLoading(false);
  setFirstLogin(true);
}

const onSubmit = handleSubmit(values => {
  setLoading(true);

  if (isFirstLogin.value) {
    values = { ...values, ...{ token: route.query.token } };

    firstLogin(values);

    return;
  }

  login(values).finally(() => setLoading(false));
});
</script>

<template>
  <UCard class="w-[400px] shadow-lg ring-0 pb-5">
    <template #header>
      <img src="@/assets/images/logo/logo.png" alt="logo" class="w-full h-[130px] object-contain" />
    </template>

    <h1 v-show="!isFirstLogin" class="text-xl font-bold text-center mb-5">管理者登入</h1>

    <UAlert
      v-show="isFirstLogin"
      :description="t('auth.firstLogin')"
      variant="soft"
      color="warning"
      class="mb-5 font-bold"
    />

    <UForm :state="{}" class="space-y-3" @submit="onSubmit">
      <FormField name="account" :label="t('form.account')" icon="fluent:person-lock-24-regular" />
      <FormField
        name="password"
        :label="t('form.password')"
        icon="fluent:lock-closed-24-regular"
        :type="show ? 'text' : 'password'"
        class="mb-1"
      >
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="show ? 'fluent:eye-off-24-filled' : 'fluent:eye-24-filled'"
          @click="show = !show"
        />
      </FormField>

      <CheckPwdList v-show="isFirstLogin" v-model="password" />

      <FormField
        v-show="isFirstLogin"
        name="confirm_password"
        :label="t('form.confirmPassword')"
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

      <div v-show="!isFirstLogin" class="w-full flex justify-end">
        <NuxtLink :to="localePath('/auth/forgot')" class="text-sm text-primary">{{
          t('auth.forget')
        }}</NuxtLink>
      </div>

      <UButton
        type="submit"
        variant="solid"
        class="w-full mt-8 flex justify-center"
        :label="t('auth.login')"
        :loading
      />
    </UForm>
  </UCard>
</template>

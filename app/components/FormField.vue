<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const {
  icon = '',
  type = 'input',
  hideLabel = false,
} = defineProps({
  icon: String,
  type: String,
  hideLabel: Boolean,
});

const attrs = useAttrs();

const id = ref(`text-field-${useId()}`);

const label = computed(() => attrs?.label as string | undefined);
const fieldName = computed(() => attrs?.name as string);
const isDisabled = computed(() => attrs?.disabled === '' || attrs?.disabled);

const { value, errorMessage: errorMessages } = useField<any>(
  () => fieldName.value ?? id.value,
  undefined,
  {
    label,
    syncVModel: true,
  },
);
</script>

<template>
  <UFormField
    :error="errorMessages"
    :disabled="isDisabled"
    v-bind="{
      ...$attrs,
      id,
    }"
  >
    <template #label>
      <div class="flex items-center gap-1">
        <UIcon v-if="icon" :name="icon" class="w-4 h-4" />
        <span v-if="!hideLabel" class="text-base">{{ label }}</span>
      </div>
    </template>

    <USelect
      v-if="type === 'select'"
      v-model="value"
      value-key="id"
      :items="$attrs.items as any[]"
      class="w-full"
    />

    <USwitch
      v-if="type === 'switch'"
      v-model="value"
      unchecked-icon="i-lucide-x"
      checked-icon="i-lucide-check"
      default-value
    />

    <UInputNumber
      v-if="type === 'number'"
      v-model="value"
      :default-value="0"
      class="w-full"
      orientation="vertical"
      :min="0"
    />

    <UTextarea v-if="type === 'textarea'" v-model="value" autoresize class="w-full" />

    <UInput v-if="type === 'input'" v-model="value" class="w-full" v-bind="$attrs">
      <template #trailing>
        <slot />
      </template>
    </UInput>
  </UFormField>
</template>

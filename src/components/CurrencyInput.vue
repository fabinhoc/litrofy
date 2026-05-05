<script setup lang="ts">
import { Money3Component } from 'v-money3';

withDefaults(
  defineProps<{
    modelValue: number | null | undefined;
    prefix?: string;
    precision?: number;
    decimal?: string;
    thousands?: string;
  }>(),
  {
    prefix: 'R$ ',
    precision: 2,
    decimal: ',',
    thousands: '.',
  },
);

defineEmits<{
  'update:modelValue': [value: number];
}>();
</script>

<template>
  <money3-component
    :model-value="modelValue ?? 0"
    :decimal="decimal"
    :thousands="thousands"
    :prefix="prefix"
    :precision="precision"
    :masked="false"
    class="q-field__input"
    @update:model-value="$emit('update:modelValue', Number($event))"
  />
</template>

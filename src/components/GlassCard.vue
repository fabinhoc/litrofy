<template>
  <q-card class="glass-card" :class="`glass-card--${variant}`">
    <slot />
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'purple' | 'teal' | 'pink';
  }>(),
  { variant: 'default' },
);
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top-color: rgba(255, 255, 255, 0.2);
  box-shadow: var(--glass-shadow-card);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
  will-change: transform;
}

.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--glass-shadow-hover);
}

.glass-card--default {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}

.glass-card--purple {
  background: var(--gradient-glass-purple);
  border-color: rgba(124, 58, 237, 0.3);
  border-top-color: rgba(167, 139, 250, 0.45);
}

.glass-card--teal {
  background: var(--gradient-glass-teal);
  border-color: rgba(13, 148, 136, 0.3);
  border-top-color: rgba(45, 212, 191, 0.45);
}

.glass-card--pink {
  background: var(--gradient-glass-pink);
  border-color: rgba(219, 39, 119, 0.3);
  border-top-color: rgba(244, 114, 182, 0.45);
}
</style>

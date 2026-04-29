<template>
  <q-btn
    class="glass-button"
    :class="[`glass-button--${variant}`, { 'glass-button--pill': pill }]"
    v-bind="$attrs"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
    pill?: boolean;
  }>(),
  {
    variant: 'secondary',
    pill: false,
  },
);
</script>

<style scoped>
.glass-button {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.glass-button--pill {
  border-radius: 999px !important;
}

/* Shimmer sweep on hover */
.glass-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.glass-button:hover::before {
  left: 100%;
}

/* Primary — purple → indigo */
.glass-button--primary {
  background: var(--gradient-purple) !important;
  color: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(124, 58, 237, 0.4) !important;
  box-shadow:
    0 4px 20px rgba(124, 58, 237, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}

.glass-button--primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 28px rgba(124, 58, 237, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}

/* Secondary — translucent glass */
.glass-button--secondary {
  background: var(--glass-btn-secondary-bg) !important;
  color: var(--glass-text-primary) !important;
  border: 1px solid var(--glass-card-border) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

.glass-button--secondary:hover {
  background: var(--glass-btn-secondary-bg-hover) !important;
  transform: translateY(-1px);
}

/* Accent — teal */
.glass-button--accent {
  background: var(--gradient-teal) !important;
  color: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(13, 148, 136, 0.4) !important;
  box-shadow:
    0 4px 20px rgba(13, 148, 136, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}

.glass-button--accent:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 28px rgba(13, 148, 136, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}

/* Ghost — minimal, for cancel/back actions */
.glass-button--ghost {
  background: transparent !important;
  color: var(--glass-text-secondary) !important;
  border: none !important;
  box-shadow: none !important;
}

.glass-button--ghost:hover {
  background: var(--glass-btn-ghost-hover-bg) !important;
  color: var(--glass-text-primary) !important;
  transform: none;
}
</style>

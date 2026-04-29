<template>
  <glass-card class="metric-card" :variant="variant">
    <div class="metric-inner q-pa-md">
      <div class="metric-top row items-center no-wrap q-mb-md">
        <div class="metric-icon-wrap q-mr-sm" v-if="icon">
          <q-icon :name="icon" size="16px" color="white" />
        </div>
        <div class="metric-label">{{ label }}</div>
      </div>

      <div class="metric-value-row row items-end q-mb-sm">
        <span class="metric-value">{{ value }}</span>
        <span class="metric-unit q-ml-xs">{{ unit }}</span>
      </div>

      <div class="metric-footer row items-center justify-between" v-if="sublabel || progress !== undefined">
        <span class="metric-sublabel">{{ sublabel }}</span>
        <div class="metric-progress-wrap" v-if="progress !== undefined">
          <div class="metric-progress-track">
            <div
              class="metric-progress-fill"
              :style="{ width: `${Math.min(progress, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </glass-card>
</template>

<script setup lang="ts">
import GlassCard from './GlassCard.vue';

withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    unit?: string;
    sublabel?: string;
    icon?: string;
    progress?: number;
    variant?: 'default' | 'purple' | 'teal' | 'pink';
  }>(),
  {
    unit: '',
    sublabel: '',
    icon: '',
    variant: 'default',
  },
);
</script>

<style scoped>
.metric-inner {
  display: flex;
  flex-direction: column;
}

.metric-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--glass-icon-wrap-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--glass-text-secondary);
}

.metric-value {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: -0.04em;
  color: var(--glass-text-primary);
  line-height: 1;
}

.metric-unit {
  font-size: 13px;
  font-weight: 500;
  color: var(--glass-text-muted);
  padding-bottom: 5px;
}

.metric-sublabel {
  font-size: 11px;
  color: var(--glass-text-muted);
  letter-spacing: 0.02em;
}

.metric-progress-wrap {
  flex: 1;
  max-width: 72px;
  margin-left: 12px;
}

.metric-progress-track {
  width: 100%;
  height: 3px;
  background: var(--glass-progress-track);
  border-radius: 999px;
  overflow: hidden;
}

.metric-progress-fill {
  height: 100%;
  background: var(--glass-progress-fill);
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

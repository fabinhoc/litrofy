<template>
  <q-layout view="lHh Lpr lFf" class="glass-layout">
    <!-- Ambient light orbs -->
    <div class="orb orb-purple"></div>
    <div class="orb orb-indigo"></div>
    <div class="orb orb-teal"></div>

    <q-header class="glass-header" elevated>
      <q-toolbar class="glass-toolbar q-px-md">
        <div
          class="toolbar-brand row items-center q-gutter-x-sm cursor-pointer"
          @click="$router.push('/')"
        >
          <q-img src="/assets/logo.png" width="18px" height="18px" />
          <span class="brand-name">Litrofy</span>
        </div>
        <q-space />
        <q-btn
          flat
          round
          dense
          :icon="isDark ? 'light_mode' : 'dark_mode'"
          class="theme-toggle"
          @click="toggleTheme"
        />
      </q-toolbar>
    </q-header>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(true);

onMounted(() => {
  const saved = localStorage.getItem('litrofy-theme');
  isDark.value = saved !== 'light';
  document.body.classList.toggle('light-mode', !isDark.value);
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('litrofy-theme', isDark.value ? 'dark' : 'light');
  document.body.classList.toggle('light-mode', !isDark.value);
};
</script>

<style scoped>
.glass-layout {
  background: var(--glass-page-bg);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Ambient orbs */
.orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(90px);
}

.orb-purple {
  top: -25%;
  left: -20%;
  width: 75vw;
  height: 75vw;
  background: var(--orb-purple);
  animation: drift 16s ease-in-out infinite alternate;
}

.orb-indigo {
  bottom: -30%;
  right: -20%;
  width: 65vw;
  height: 65vw;
  background: var(--orb-indigo);
  animation: drift 20s ease-in-out infinite alternate-reverse;
}

.orb-teal {
  top: 35%;
  left: 20%;
  width: 45vw;
  height: 45vw;
  background: var(--orb-teal);
  animation: drift 24s ease-in-out infinite alternate;
  animation-delay: -8s;
}

@keyframes drift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(4%, 6%) scale(1.06);
  }
}

/* Header */
.glass-header {
  background: var(--glass-header-bg) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-header-border) !important;
  box-shadow: none !important;
  position: relative;
  z-index: 10;
}

.glass-toolbar {
  background: transparent !important;
  min-height: 56px;
}

.brand-icon {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--gradient-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.45);
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--glass-header-text);
}

.theme-toggle {
  color: var(--glass-header-text) !important;
  opacity: 0.75;

  &:hover {
    opacity: 1;
  }
}

.page-container {
  background: transparent !important;
  position: relative;
  z-index: 1;
}
</style>

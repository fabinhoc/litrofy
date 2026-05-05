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

    <!-- PWA install banner -->
    <Transition name="install-banner">
      <div v-if="showInstallBanner" class="install-banner">
        <div class="install-banner-inner row items-center no-wrap q-pa-md q-gutter-x-md">
          <q-img src="/icons/icon-96x96.png" width="40px" height="40px" class="install-icon" />
          <div class="col">
            <div class="install-title">Instalar Litrofy</div>
            <div class="install-sub">Acesse offline, como um app nativo</div>
          </div>
          <q-btn
            unelevated
            rounded
            color="primary"
            label="Instalar"
            size="sm"
            class="q-px-md"
            @click="promptInstall"
          />
          <q-btn flat round dense icon="close" size="sm" class="install-close" @click="dismissInstall" />
        </div>
      </div>
    </Transition>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

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

// PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const showInstallBanner = ref(false);
let deferredPrompt: BeforeInstallPromptEvent | null = null;

const onBeforeInstallPrompt = (e: Event) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  // Não mostrar se o usuário já dispensou antes
  if (localStorage.getItem('litrofy-install-dismissed') !== 'true') {
    showInstallBanner.value = true;
  }
};

const onAppInstalled = () => {
  showInstallBanner.value = false;
  deferredPrompt = null;
};

onMounted(() => {
  // Não mostrar banner se já está rodando como PWA instalado
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) return;

  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.addEventListener('appinstalled', onAppInstalled);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.removeEventListener('appinstalled', onAppInstalled);
});

const promptInstall = async () => {
  if (!deferredPrompt) return;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    showInstallBanner.value = false;
  }
  deferredPrompt = null;
};

const dismissInstall = () => {
  showInstallBanner.value = false;
  localStorage.setItem('litrofy-install-dismissed', 'true');
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

/* PWA install banner */
.install-banner {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 9999;
  max-width: 480px;
  margin: 0 auto;
}

.install-banner-inner {
  background: rgba(30, 20, 60, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.35);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05);
}

.install-icon {
  border-radius: 10px;
  flex-shrink: 0;
}

.install-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
}

.install-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

.install-close {
  color: rgba(255, 255, 255, 0.4) !important;
  flex-shrink: 0;
}

.install-banner-enter-active,
.install-banner-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.install-banner-enter-from,
.install-banner-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}
</style>

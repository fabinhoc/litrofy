<template>
  <q-layout view="lHh Lpr lFf" class="glass-layout">
    <!-- Ambient light orbs -->
    <div class="orb orb-purple"></div>
    <div class="orb orb-indigo"></div>
    <div class="orb orb-teal"></div>

    <q-header class="glass-header" elevated>
      <q-toolbar class="glass-toolbar q-px-md">
        <div class="toolbar-brand row items-center q-gutter-x-sm cursor-pointer" @click="$router.push('/')">
          <div class="brand-icon">
            <q-icon name="local_gas_station" size="16px" color="white" />
          </div>
          <span class="brand-name">Litrofy</span>
        </div>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

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
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.22) 0%, transparent 65%);
  animation: drift 16s ease-in-out infinite alternate;
}

.orb-indigo {
  bottom: -30%;
  right: -20%;
  width: 65vw;
  height: 65vw;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.18) 0%, transparent 65%);
  animation: drift 20s ease-in-out infinite alternate-reverse;
}

.orb-teal {
  top: 35%;
  left: 20%;
  width: 45vw;
  height: 45vw;
  background: radial-gradient(circle at center, rgba(13, 148, 136, 0.1) 0%, transparent 65%);
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
  background: rgba(7, 5, 15, 0.65) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
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
  color: rgba(255, 255, 255, 0.9);
}

.page-container {
  background: transparent !important;
  position: relative;
  z-index: 1;
}
</style>

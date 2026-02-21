<script setup lang="ts">
/**
 * LoadingOverlay — Tela de carregamento fullscreen.
 *
 * Exibe logo com pulse + spinner enquanto dados carregam.
 * Fade-out suave ao desaparecer.
 */

import { CBImage } from '@cb/components';

interface Props {
  visible: boolean;
}

defineProps<Props>();
</script>

<template>
  <Transition name="loadingFade">
    <div v-if="visible" class="loadingOverlay">
      <div class="loadingOverlay__glow loadingOverlay__glow--1" />
      <div class="loadingOverlay__glow loadingOverlay__glow--2" />
      <div class="loadingOverlay__content">
        <CBImage
          src="/logo-elas-podem.png"
          alt="Elas Podem"
          size="auto"
          :height="64"
          fit="contain"
          :eager="true"
          class="loadingOverlay__logo"
        />
        <div class="loadingOverlay__spinner" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loadingOverlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hero, #1a0a2e);
  overflow: hidden;
}

.loadingOverlay__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  pointer-events: none;
}

.loadingOverlay__glow--1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  background: var(--color-magenta, #e6346b);
}

.loadingOverlay__glow--2 {
  width: 350px;
  height: 350px;
  bottom: -80px;
  left: -80px;
  background: var(--color-roxo-acento, #9b59b6);
}

.loadingOverlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  z-index: 1;
}

.loadingOverlay__logo {
  animation: loadingPulse 2s ease-in-out infinite;
}

.loadingOverlay__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--color-magenta, #e6346b);
  border-radius: 50%;
  animation: loadingSpin 0.8s linear infinite;
}

@keyframes loadingSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loadingPulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Transition fade-out */
.loadingFade-leave-active {
  transition: opacity 0.4s ease;
}

.loadingFade-leave-to {
  opacity: 0;
}
</style>

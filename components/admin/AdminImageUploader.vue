<script setup lang="ts">
/**
 * 🧩 AdminImageUploader — Upload de imagem com drag&drop, preview e compressao.
 *
 * Reutilizado em Hero, Mission, Testimonials, Supporters e SEO.
 * Usa useStorage internamente (adapter agnostico). Compressao automatica por categoria.
 *
 * Features:
 * - Drag & drop com visual feedback
 * - Preview grande com overlay hover (trocar/remover)
 * - Loading overlay com spinner + backdrop blur
 * - Info de formatos aceitos e compressao ativa
 * - Presets de compressao visiveis (Alta/Media/Baixa)
 */

import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { CBCard, CBIcon, CBLabel, CBSlider } from '@cb/components';
import { useStorage } from '@composables/useStorage';
import { useImageCompression } from '@composables/useImageCompression';
import { COMPRESSION_SETTINGS, IMAGE_UPLOAD_CONFIG } from '@definitions/validationConfigs';
import type { CompressionCategory } from '@/types/storage';

// ============== PROPS ==============

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  category: {
    type: String as PropType<CompressionCategory>,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  /** Habilita slider de opacidade (0-100%). Requer v-model:opacity. */
  opacityEditable: {
    type: Boolean,
    default: false,
  },
  opacity: {
    type: Number,
    default: 100,
  },
});

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [url: string];
  'update:opacity': [value: number];
  uploaded: [url: string];
}>();

// ============== COMPOSABLES ==============

const { t } = useI18n();
const { validateImageFile, uploadImage } = useStorage();
const { compressImage } = useImageCompression();

// ============== STATE ==============

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const isDragging = ref(false);
const uploadError = ref('');

// ============== COMPRESSION STATE ==============

const compressionSettings = computed(() => COMPRESSION_SETTINGS[props.category]);
const compressionEnabled = ref(compressionSettings.value.enabled);
const compressionQuality = ref(compressionSettings.value.quality);

const PRESETS = [
  { label: 'admin.imageUploader.presetHigh', value: 0.9, color: 'var(--color-oliva)' },
  { label: 'admin.imageUploader.presetMedium', value: 0.8, color: 'var(--color-vinho-medio)' },
  { label: 'admin.imageUploader.presetLow', value: 0.6, color: 'var(--color-coral)' },
] as const;

const formatsText = IMAGE_UPLOAD_CONFIG.validExtensions.join(', ');
const maxSizeText = `${IMAGE_UPLOAD_CONFIG.maxSizeMB}MB`;

// ============== METHODS ==============

function triggerFileInput(): void {
  if (!isUploading.value) {
    fileInput.value?.click();
  }
}

async function processFile(file: File): Promise<void> {
  uploadError.value = '';

  const validation = validateImageFile(file);
  if (!validation.isValid) {
    uploadError.value = validation.error ?? t('admin.imageUploader.invalidFile');
    return;
  }

  isUploading.value = true;

  try {
    let fileToUpload = file;

    // Comprimir se habilitado (usando quality do preset selecionado)
    if (compressionEnabled.value) {
      const compressed = await compressImage(file, {
        quality: compressionQuality.value,
        maxWidth: compressionSettings.value.maxWidth,
        maxHeight: compressionSettings.value.maxHeight,
      });
      if (compressed !== file) fileToUpload = compressed;
    }

    const url = await uploadImage(fileToUpload, props.category);
    emit('update:modelValue', url);
    emit('uploaded', url);
  } catch (error) {
    uploadError.value =
      error instanceof Error ? error.message : t('admin.imageUploader.uploadError');
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}

async function handleFileSelect(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) await processFile(file);
}

function removeImage(): void {
  emit('update:modelValue', '');
}

// ============== DRAG & DROP ==============

function handleDragOver(): void {
  if (!isUploading.value) isDragging.value = true;
}

function handleDragLeave(): void {
  isDragging.value = false;
}

async function handleDrop(event: DragEvent): Promise<void> {
  isDragging.value = false;
  if (isUploading.value) return;

  const file = event.dataTransfer?.files?.[0];
  if (file) await processFile(file);
}
</script>

<template>
  <CBCard density="compact" :rounded="10" color="#FDF5F0" class="imgUp">
    <template #header>
      <CBLabel
        :text="label || $t('admin.imageUploader.label')"
        size="sm"
        weight="semibold"
      />
    </template>

    <!-- Zona de upload / preview -->
    <div
      class="imgUp__zone"
      :class="{
        'imgUp__zone--dragging': isDragging,
        'imgUp__zone--has-image': !!modelValue,
      }"
      @click="!modelValue ? triggerFileInput() : undefined"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <!-- Estado: sem imagem -->
      <div v-if="!modelValue" class="imgUp__empty">
        <div class="imgUp__iconCircle">
          <CBIcon icon="luc-cloud-upload" size="1.75rem" color="var(--color-rosa)" />
        </div>
        <span class="imgUp__title">{{ $t('admin.imageUploader.dropzone') }}</span>
        <span class="imgUp__meta">{{ formatsText }} &middot; max {{ maxSizeText }}</span>
      </div>

      <!-- Estado: com imagem (preview) -->
      <div v-else class="imgUp__preview">
        <img :src="modelValue" alt="" class="imgUp__blur" aria-hidden="true" />
        <img :src="modelValue" :alt="label" class="imgUp__image" />
        <div class="imgUp__overlay">
          <button
            type="button"
            class="imgUp__action imgUp__action--edit"
            @click.stop="triggerFileInput"
          >
            <CBIcon icon="luc-pencil" size="1rem" color="#ffffff" />
          </button>
          <button
            type="button"
            class="imgUp__action imgUp__action--delete"
            @click.stop="removeImage"
          >
            <CBIcon icon="luc-trash-2" size="1rem" color="#ffffff" />
          </button>
        </div>
      </div>

      <!-- Loading overlay -->
      <div v-if="isUploading" class="imgUp__loading">
        <CBIcon icon="luc-loader-2" size="2rem" color="#ffffff" class="imgUp__spinner" />
        <span class="imgUp__loadingText">{{ $t('admin.imageUploader.uploading') }}</span>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="uploadError" class="imgUp__error">
      <CBIcon icon="luc-alert-circle" size="0.875rem" color="var(--color-coral)" />
      <span class="imgUp__errorText">{{ uploadError }}</span>
    </div>

    <!-- Compressao: presets + toggle -->
    <div class="imgUp__compression">
      <div class="imgUp__compressionHeader">
        <CBIcon icon="luc-minimize-2" size="0.875rem" color="var(--text-tertiary)" />
        <span class="imgUp__compressionLabel">{{ $t('admin.imageUploader.compression') }}</span>
        <button
          type="button"
          class="imgUp__toggle"
          :class="{ 'imgUp__toggle--active': compressionEnabled }"
          @click="compressionEnabled = !compressionEnabled"
        >
          <span class="imgUp__toggleDot" />
        </button>
      </div>

      <div v-if="compressionEnabled" class="imgUp__presets">
        <button
          v-for="preset in PRESETS"
          :key="preset.value"
          type="button"
          class="imgUp__preset"
          :class="{ 'imgUp__preset--active': compressionQuality === preset.value }"
          :style="{ '--preset-color': preset.color }"
          @click="compressionQuality = preset.value"
        >
          {{ $t(preset.label) }}
        </button>
      </div>
    </div>

    <!-- Opacidade -->
    <CBSlider
      v-if="opacityEditable"
      :model-value="opacity"
      :label="$t('admin.imageUploader.opacity')"
      :min="0"
      :max="100"
      :step="1"
      color="primary"
      thumb-label="always"
      @update:model-value="emit('update:opacity', $event as number)"
    />

    <!-- Input hidden -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      @change="handleFileSelect"
    />
  </CBCard>
</template>

<style scoped>
/* ============================================
   IMAGE UPLOADER — CONTAINER
   ============================================ */
.imgUp {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ============================================
   ZONA DE UPLOAD
   ============================================ */
.imgUp__zone {
  position: relative;
  border: 2px dashed var(--border-hover);
  border-radius: 12px;
  background: rgba(var(--color-vinho-rgb), 0.03);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.imgUp__zone:hover:not(.imgUp__zone--has-image) {
  border-color: var(--color-rosa);
  background: rgba(var(--color-rosa-rgb), 0.06);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(var(--color-rosa-rgb), 0.12);
}

.imgUp__zone--dragging {
  border-color: var(--color-oliva);
  background: rgba(var(--color-oliva-rgb), 0.08);
  transform: scale(1.01);
}

.imgUp__zone--has-image {
  border-style: solid;
  border-color: var(--glass-border);
  background: transparent;
  min-height: auto;
  cursor: default;
}

/* ============================================
   ESTADO VAZIO
   ============================================ */
.imgUp__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.imgUp__iconCircle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(var(--color-rosa-rgb), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.imgUp__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-body);
}

.imgUp__meta {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: var(--font-body);
}

/* ============================================
   PREVIEW
   ============================================ */
.imgUp__preview {
  position: relative;
  width: 100%;
  max-height: 220px;
  overflow: hidden;
  border-radius: 10px;
}

.imgUp__blur {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px) saturate(1.2);
  opacity: 0.5;
  transform: scale(1.1);
}

.imgUp__image {
  position: relative;
  width: 100%;
  height: 220px;
  object-fit: contain;
  display: block;
}

.imgUp__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  opacity: 0;
  transition: opacity 0.25s ease;
  border-radius: 10px;
}

.imgUp__preview:hover .imgUp__overlay {
  opacity: 1;
}

.imgUp__action {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.imgUp__action:hover {
  transform: scale(1.1);
}

.imgUp__action--edit {
  background: var(--color-rosa);
  box-shadow: var(--glow-rosa);
}

.imgUp__action--delete {
  background: var(--color-coral);
  box-shadow: var(--glow-coral);
}

/* ============================================
   LOADING OVERLAY
   ============================================ */
.imgUp__loading {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 10px;
  z-index: 2;
}

.imgUp__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.imgUp__loadingText {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  font-family: var(--font-body);
}

/* ============================================
   ERRO
   ============================================ */
.imgUp__error {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: rgba(var(--color-coral-rgb), 0.06);
  border: 1px solid rgba(var(--color-coral-rgb), 0.15);
  border-radius: 8px;
}

.imgUp__errorText {
  font-size: 0.8125rem;
  color: var(--color-coral);
  font-family: var(--font-body);
}

/* ============================================
   COMPRESSAO
   ============================================ */
.imgUp__compression {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: rgba(var(--color-vinho-rgb), 0.03);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.imgUp__compressionHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.imgUp__compressionLabel {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-family: var(--font-body);
  flex: 1;
}

/* Toggle switch */
.imgUp__toggle {
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: none;
  background: var(--border-light);
  cursor: pointer;
  position: relative;
  transition: background 0.25s ease;
  padding: 0;
}

.imgUp__toggle--active {
  background: var(--color-rosa);
}

.imgUp__toggleDot {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.25s ease;
}

.imgUp__toggle--active .imgUp__toggleDot {
  transform: translateX(16px);
}

/* Presets */
.imgUp__presets {
  display: flex;
  gap: 0.375rem;
}

.imgUp__preset {
  flex: 1;
  padding: 0.375rem 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: var(--font-body);
  transition: all 0.2s ease;
}

.imgUp__preset:hover {
  border-color: var(--preset-color);
  color: var(--preset-color);
}

.imgUp__preset--active {
  background: var(--preset-color);
  border-color: var(--preset-color);
  color: #ffffff;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
  .imgUp__zone {
    min-height: 130px;
  }

  .imgUp__empty {
    padding: 1.5rem 1rem;
  }

  .imgUp__presets {
    flex-direction: column;
  }
}
</style>

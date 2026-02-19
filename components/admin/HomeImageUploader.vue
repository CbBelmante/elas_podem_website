<script setup lang="ts">
/**
 * 🧩 HomeImageUploader — Upload de imagem com preview, validacao e compressao.
 *
 * Reutilizado em Mission, Testimonials, Supporters e SEO.
 * Usa useFirebaseStorage internamente.
 */

import { CBButton, CBIcon, CBLabel } from '@cb/components';
import { useFirebaseStorage } from '@composables/useFirebaseStorage';
import type { CompressionCategory } from '@composables/useFirebaseStorage';

// ============== PROPS ==============

interface Props {
  modelValue: string;
  category: CompressionCategory;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Imagem',
});

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [url: string];
  'uploaded': [url: string];
}>();

// ============== COMPOSABLES ==============

const { validateImageFile, uploadImage } = useFirebaseStorage();

// ============== STATE ==============

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadError = ref('');

// ============== METHODS ==============

function triggerFileInput(): void {
  fileInput.value?.click();
}

async function handleFileSelect(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploadError.value = '';

  const validation = validateImageFile(file);
  if (!validation.isValid) {
    uploadError.value = validation.error ?? 'Arquivo invalido';
    input.value = '';
    return;
  }

  isUploading.value = true;

  try {
    const url = await uploadImage(file, props.category);
    emit('update:modelValue', url);
    emit('uploaded', url);
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Erro ao enviar imagem';
  } finally {
    isUploading.value = false;
    input.value = '';
  }
}

function removeImage(): void {
  emit('update:modelValue', '');
}
</script>

<template>
  <div class="imageUploader">
    <CBLabel :text="label" size="sm" weight="medium" class="imageUploader__label" />

    <!-- Preview da imagem atual -->
    <div v-if="modelValue" class="imageUploader__preview">
      <img :src="modelValue" :alt="label" class="imageUploader__image" />
      <button type="button" class="imageUploader__removeBtn" @click="removeImage">
        <CBIcon icon="luc-trash-2" size="0.875rem" color="#ffffff" />
      </button>
    </div>

    <!-- Placeholder / botao de upload -->
    <div v-else class="imageUploader__placeholder">
      <CBButton
        :label="isUploading ? 'Enviando...' : 'Enviar Imagem'"
        variant="outline"
        size="sm"
        :rounded="10"
        prepend-icon="luc-upload"
        :loading="isUploading"
        :disabled="isUploading"
        @click="triggerFileInput"
      />
    </div>

    <!-- Input file hidden -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      @change="handleFileSelect"
    />

    <!-- Erro de upload -->
    <CBLabel
      v-if="uploadError"
      :text="uploadError"
      size="xs"
      class="imageUploader__error"
    />
  </div>
</template>

<style scoped>
.imageUploader {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.imageUploader__label {
  color: var(--text-secondary);
}

.imageUploader__preview {
  position: relative;
  display: inline-block;
  max-width: 200px;
}

.imageUploader__image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.imageUploader__removeBtn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(238, 74, 85, 0.85);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.imageUploader__removeBtn:hover {
  background: var(--color-coral, #EE4A55);
}

.imageUploader__placeholder {
  display: flex;
  align-items: center;
}

.imageUploader__error {
  color: var(--color-coral, #EE4A55);
}
</style>

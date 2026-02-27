<script setup lang="ts">
/**
 * 🧩 AdminColorPicker — Seletor visual de cor/gradiente
 *
 * Suporta cor solida, gradiente preset e gradiente custom (2-3 cores).
 * Valor armazenado: 'rosa' | 'gradient:primary' | 'custom:rosa,magenta'
 *
 * Use `unavailableModes` para esconder abas que nao fazem sentido no contexto.
 */

import { CBIcon, CBLabel } from '@cb/components';
import { THEME_COLOR_OPTIONS, THEME_GRADIENT_OPTIONS } from '@definitions/themeOptions';
import { parseColorValue, resolveColorValue } from '@utils/colorResolver';

// ============== PROPS ==============

type PickerMode = 'colors' | 'gradients' | 'custom';

interface Props {
  modelValue: string;
  label?: string;
  unavailableModes?: PickerMode[];
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Cor',
  unavailableModes: () => [],
});

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// ============== STATE ==============

const activeTab = ref<PickerMode>('colors');
const customStart = ref('');
const customMiddle = ref('');
const customEnd = ref('');

// ============== AVAILABLE MODES ==============

const allModes: PickerMode[] = ['colors', 'gradients', 'custom'];

const availableModes = computed(() =>
  allModes.filter((m) => !props.unavailableModes.includes(m)),
);

function isAvailable(mode: PickerMode): boolean {
  return availableModes.value.includes(mode);
}

/** Retorna a aba desejada se disponivel, senao a primeira disponivel */
function safeTab(desired: PickerMode): PickerMode {
  return isAvailable(desired) ? desired : availableModes.value[0];
}

// Sincronizar aba ativa e custom fields com o modelValue
watch(
  () => props.modelValue,
  (val) => {
    const parsed = parseColorValue(val);
    if (parsed.type === 'custom') {
      activeTab.value = safeTab('custom');
      const parts = parsed.raw.split(',');
      customStart.value = parts[0] ?? '';
      customMiddle.value = parts.length === 3 ? parts[1] : '';
      customEnd.value = parts[parts.length - 1] ?? '';
    } else if (parsed.type === 'gradient') {
      activeTab.value = safeTab('gradients');
    } else {
      activeTab.value = safeTab('colors');
    }
  },
  { immediate: true },
);

// ============== COMPUTED ==============

/** Label legivel para o valor atual */
const displayLabel = computed(() => {
  const parsed = parseColorValue(props.modelValue);
  if (parsed.type === 'gradient') {
    return THEME_GRADIENT_OPTIONS.find((o) => o.value === parsed.raw)?.label ?? parsed.raw;
  }
  if (parsed.type === 'custom') return 'Personalizado';
  return THEME_COLOR_OPTIONS.find((o) => o.value === parsed.raw)?.label ?? parsed.raw;
});

/** CSS background para o preview bar */
const previewBg = computed(() => resolveColorValue(props.modelValue));

/** Preview ao vivo do gradiente custom sendo montado */
const customPreviewBg = computed(() => {
  if (!customStart.value || !customEnd.value) return 'transparent';
  const start = `var(--color-${customStart.value})`;
  const end = `var(--color-${customEnd.value})`;
  if (customMiddle.value) {
    const mid = `var(--color-${customMiddle.value})`;
    return `linear-gradient(135deg, ${start} 0%, ${mid} 50%, ${end} 100%)`;
  }
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
});

// ============== METHODS ==============

function selectColor(value: string): void {
  emit('update:modelValue', value);
}

function selectGradient(value: string): void {
  emit('update:modelValue', `gradient:${value}`);
}

function emitCustom(): void {
  if (!customStart.value || !customEnd.value) return;
  const parts = customMiddle.value
    ? `${customStart.value},${customMiddle.value},${customEnd.value}`
    : `${customStart.value},${customEnd.value}`;
  emit('update:modelValue', `custom:${parts}`);
}

function selectCustomColor(target: 'start' | 'middle' | 'end', value: string): void {
  if (target === 'start') customStart.value = value;
  else if (target === 'middle') customMiddle.value = customMiddle.value === value ? '' : value;
  else customEnd.value = value;
  emitCustom();
}

function clearCustomMiddle(): void {
  customMiddle.value = '';
  emitCustom();
}

/** CSS background de um swatch de cor */
function colorBg(value: string): string {
  return `var(--color-${value})`;
}

/** CSS background de um swatch de gradiente */
function gradientBg(value: string): string {
  return `var(--gradient-${value})`;
}
</script>

<template>
  <div class="picker">
    <CBLabel v-if="label" :text="label" weight="semibold" size="sm" class="picker__label" />

    <!-- Abas (esconde quando so tem 1 modo) -->
    <div v-if="availableModes.length > 1" class="picker__tabs">
      <button
        v-if="isAvailable('colors')"
        type="button"
        class="picker__tab"
        :class="{ 'picker__tab--active': activeTab === 'colors' }"
        @click="activeTab = 'colors'"
      >
        Cores
      </button>
      <button
        v-if="isAvailable('gradients')"
        type="button"
        class="picker__tab"
        :class="{ 'picker__tab--active': activeTab === 'gradients' }"
        @click="activeTab = 'gradients'"
      >
        Gradientes
      </button>
      <button
        v-if="isAvailable('custom')"
        type="button"
        class="picker__tab"
        :class="{ 'picker__tab--active': activeTab === 'custom' }"
        @click="activeTab = 'custom'"
      >
        Personalizado
      </button>
    </div>

    <!-- Aba: Cores solidas -->
    <div v-if="activeTab === 'colors'" class="picker__panel">
      <div class="picker__swatches">
        <button
          v-for="opt in THEME_COLOR_OPTIONS"
          :key="opt.value"
          type="button"
          class="picker__swatch picker__swatch--circle"
          :class="{ 'picker__swatch--selected': modelValue === opt.value }"
          :style="{ background: colorBg(opt.value) }"
          :title="opt.label"
          @click="selectColor(opt.value)"
        >
          <CBIcon
            v-if="modelValue === opt.value"
            icon="luc-check"
            size="0.75rem"
            color="#ffffff"
            class="picker__check"
          />
        </button>
      </div>
    </div>

    <!-- Aba: Gradientes preset -->
    <div v-if="activeTab === 'gradients' && isAvailable('gradients')" class="picker__panel">
      <div class="picker__swatches">
        <button
          v-for="opt in THEME_GRADIENT_OPTIONS"
          :key="opt.value"
          type="button"
          class="picker__swatch picker__swatch--rect"
          :class="{ 'picker__swatch--selected': modelValue === `gradient:${opt.value}` }"
          :style="{ background: gradientBg(opt.value) }"
          :title="opt.label"
          @click="selectGradient(opt.value)"
        >
          <CBIcon
            v-if="modelValue === `gradient:${opt.value}`"
            icon="luc-check"
            size="0.75rem"
            color="#ffffff"
            class="picker__check"
          />
        </button>
      </div>
    </div>

    <!-- Aba: Personalizado (montar gradiente) -->
    <div v-if="activeTab === 'custom' && isAvailable('custom')" class="picker__panel">
      <!-- Cor Inicial -->
      <div class="picker__customGroup">
        <CBLabel text="Cor Inicial" size="xs" class="picker__customLabel" />
        <div class="picker__swatches">
          <button
            v-for="opt in THEME_COLOR_OPTIONS"
            :key="opt.value"
            type="button"
            class="picker__swatch picker__swatch--sm"
            :class="{ 'picker__swatch--selected': customStart === opt.value }"
            :style="{ background: colorBg(opt.value) }"
            :title="opt.label"
            @click="selectCustomColor('start', opt.value)"
          >
            <CBIcon
              v-if="customStart === opt.value"
              icon="luc-check"
              size="0.625rem"
              color="#ffffff"
              class="picker__check"
            />
          </button>
        </div>
      </div>

      <!-- Cor do Meio (opcional) -->
      <div class="picker__customGroup">
        <div class="picker__customLabelRow">
          <CBLabel text="Cor do Meio" size="xs" class="picker__customLabel" />
          <CBLabel text="(opcional)" size="xs" class="picker__customHint" />
          <button
            v-if="customMiddle"
            type="button"
            class="picker__clearBtn"
            @click="clearCustomMiddle"
          >
            <CBIcon icon="luc-x" size="0.75rem" color="var(--text-tertiary)" />
          </button>
        </div>
        <div class="picker__swatches">
          <button
            v-for="opt in THEME_COLOR_OPTIONS"
            :key="opt.value"
            type="button"
            class="picker__swatch picker__swatch--sm"
            :class="{ 'picker__swatch--selected': customMiddle === opt.value }"
            :style="{ background: colorBg(opt.value) }"
            :title="opt.label"
            @click="selectCustomColor('middle', opt.value)"
          >
            <CBIcon
              v-if="customMiddle === opt.value"
              icon="luc-check"
              size="0.625rem"
              color="#ffffff"
              class="picker__check"
            />
          </button>
        </div>
      </div>

      <!-- Cor Final -->
      <div class="picker__customGroup">
        <CBLabel text="Cor Final" size="xs" class="picker__customLabel" />
        <div class="picker__swatches">
          <button
            v-for="opt in THEME_COLOR_OPTIONS"
            :key="opt.value"
            type="button"
            class="picker__swatch picker__swatch--sm"
            :class="{ 'picker__swatch--selected': customEnd === opt.value }"
            :style="{ background: colorBg(opt.value) }"
            :title="opt.label"
            @click="selectCustomColor('end', opt.value)"
          >
            <CBIcon
              v-if="customEnd === opt.value"
              icon="luc-check"
              size="0.625rem"
              color="#ffffff"
              class="picker__check"
            />
          </button>
        </div>
      </div>

      <!-- Preview do gradiente custom -->
      <div v-if="customStart && customEnd" class="picker__customPreview">
        <div class="picker__previewBar" :style="{ background: customPreviewBg }" />
        <CBLabel
          :text="customMiddle ? '3 cores' : '2 cores'"
          size="xs"
          class="picker__previewLabel"
        />
      </div>
    </div>

    <!-- Preview global -->
    <div v-if="modelValue" class="picker__preview">
      <div class="picker__previewBar" :style="{ background: previewBg }" />
      <CBLabel :text="displayLabel" size="xs" class="picker__previewLabel" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.picker__label {
  color: var(--text-primary);
}

/* ============================================
   TABS
   ============================================ */
.picker__tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.25rem;
}

.picker__tab {
  padding: 0.375rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 6px 6px 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.picker__tab:hover {
  color: var(--text-primary);
  background: rgba(var(--color-vinho-rgb), 0.04);
}

.picker__tab--active {
  color: var(--color-rosa);
  background: rgba(var(--color-rosa-rgb), 0.08);
  border-bottom: 2px solid var(--color-rosa);
}

/* ============================================
   PANEL
   ============================================ */
.picker__panel {
  padding: 0.625rem 0;
}

/* ============================================
   SWATCHES
   ============================================ */
.picker__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.picker__swatch {
  position: relative;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
}

.picker__swatch--circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.picker__swatch--rect {
  width: 52px;
  height: 28px;
  border-radius: 8px;
}

.picker__swatch--sm {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}

.picker__swatch:hover {
  transform: scale(1.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.picker__swatch--selected {
  border-color: var(--color-preto);
  box-shadow: 0 0 0 2px rgba(var(--color-vinho-rgb), 0.2);
  transform: scale(1.08);
}

.picker__check {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

/* ============================================
   CUSTOM GRADIENT BUILDER
   ============================================ */
.picker__customGroup {
  margin-bottom: 0.75rem;
}

.picker__customLabel {
  color: var(--text-secondary);
  margin-bottom: 0.375rem;
}

.picker__customLabelRow {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
}

.picker__customHint {
  color: var(--text-tertiary);
}

.picker__clearBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background 0.2s ease;
}

.picker__clearBtn:hover {
  background: rgba(var(--color-vinho-rgb), 0.08);
}

.picker__customPreview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-light);
}

/* ============================================
   PREVIEW BAR
   ============================================ */
.picker__preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.picker__previewBar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  border: 1px solid rgba(var(--color-vinho-rgb), 0.1);
}

.picker__previewLabel {
  color: var(--text-tertiary);
  white-space: nowrap;
  min-width: fit-content;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
  .picker__swatch--circle {
    width: 28px;
    height: 28px;
  }

  .picker__swatch--rect {
    width: 44px;
    height: 24px;
  }

  .picker__swatch--sm {
    width: 22px;
    height: 22px;
  }

  .picker__tabs {
    gap: 0.125rem;
  }

  .picker__tab {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
  }
}
</style>

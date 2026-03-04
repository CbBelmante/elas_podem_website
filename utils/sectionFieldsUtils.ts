/**
 * 🎯 sectionFieldsUtils - Helpers genéricos de split/combine por FieldMode
 *
 * Lê configs de SECTION_FIELDS em runtime para separar e recombinar dados.
 * Não sabe nada sobre seções específicas (hero, supporters, etc).
 */

import type { FieldMode } from '@definitions/sectionFields';

// ============================================================
// CLONE
// ============================================================

// Deep clone: shallow pra objetos, recursivo pra arrays
function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => cloneValue(v));
  if (typeof value === 'object' && value !== null) return { ...value };
  return value;
}

// ============================================================
// FLAT — seções sem array nested
// ============================================================

// Separa objeto flat em { editable, readonly } por FieldMode. Valores clonados.
export function separateByFields<T extends object>(
  data: T,
  fields: Record<string, FieldMode>
): { editable: Partial<T>; readonly: Partial<T> } {
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};

  for (const [key, mode] of Object.entries(fields)) {
    if (!(key in data) || mode === 'hidden') continue;
    const target = mode === 'editable' ? editable : readonly;
    target[key] = cloneValue((data as Record<string, unknown>)[key]);
  }

  return { editable: editable as Partial<T>, readonly: readonly as Partial<T> };
}

// Recombina editable + readonly em objeto flat
export function combineFromFields<T>(editable: Partial<T>, readonly: Partial<T>): T {
  return { ...readonly, ...editable } as T;
}

// ============================================================
// ARRAY — arrays de items pareados por índice
// ============================================================

// Separa array em { editable[], readonly[] } pareados por índice
export function separateArrayByFields<T extends object>(
  data: T[],
  fields: Record<string, FieldMode>
): { editable: Partial<T>[]; readonly: Partial<T>[] } {
  const results = data.map((item) => separateByFields(item, fields));
  return {
    editable: results.map((r) => r.editable),
    readonly: results.map((r) => r.readonly),
  };
}

/**
 * Recombina arrays pareados editable + readonly em array flat.
 * defaultReadonly é fallback quando readonly[i] não existe.
 *
 * @param params.editable - Array de campos editáveis
 * @param params.readonly - Array de campos readonly (pareado por índice)
 * @param params.defaultReadonly - Fallback quando readonly[i] não existe
 * @returns Array de objetos flat recombinados (T[])
 */
export function combineArrayFromFields<T>(params: {
  editable: Partial<T>[];
  readonly: Partial<T>[];
  defaultReadonly?: Partial<T>;
}): T[] {
  const { editable, readonly, defaultReadonly = {} } = params;
  return editable.map((e, i) => ({ ...(readonly[i] || defaultReadonly), ...e }) as T);
}

// ============================================================
// DESCOBERTA — lê o config e separa section-level de item-level
// ============================================================

/**
 * Encontra a chave nested (items/methods) no config.
 * Procura a primeira chave cujo valor é objeto (não string, não array).
 *
 * @param fields - Config completo da seção (ex: SECTION_FIELDS.supporters)
 * @returns `{ key, config }` com nome do array e seus FieldModes, ou undefined para seções flat
 */
export function getItemFields(
  fields: Record<string, unknown>
): { key: string; config: Record<string, FieldMode> } | undefined {
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return { key, config: value as Record<string, FieldMode> };
    }
  }
  return undefined;
}

// Filtra apenas campos section-level (string FieldMode) do config
export function getSectionFields(fields: Record<string, unknown>): Record<string, FieldMode> {
  const result: Record<string, FieldMode> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string') {
      result[key] = value as FieldMode;
    }
  }
  return result;
}

// ============================================================
// WRAPPER — seções com section-level + array nested
// ============================================================

/**
 * Separa seção wrapper (section-level + array nested) em editable/readonly.
 * Lê o config automaticamente — strings no root = section-level, objeto = array items.
 *
 * @param params.data - Seção wrapper do Firestore (ex: ISupportersSection)
 * @param params.fields - Config completo (ex: SECTION_FIELDS.supporters)
 * @param params.sectionDefaults - Defaults para campos section-level (backward compat)
 * @returns `{ editable, readonly }` com section-level + item-level separados
 */
export function separateWrapperByFields(params: {
  data: Record<string, unknown>;
  fields: Record<string, unknown>;
  sectionDefaults?: Record<string, unknown>;
}): { editable: Record<string, unknown>; readonly: Record<string, unknown> } {
  const { data, fields, sectionDefaults } = params;
  const itemInfo = getItemFields(fields);
  const sectionFieldModes = getSectionFields(fields);

  // Section-level: separar campos cujo modo é string
  const sectionEditable: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(sectionFieldModes)) {
    if (mode === 'hidden') continue;
    const value = data[key] ?? sectionDefaults?.[key];
    if (mode === 'editable') sectionEditable[key] = cloneValue(value);
  }

  // Item-level: separar array por campos do sub-config
  if (itemInfo) {
    const items = (data[itemInfo.key] ?? []) as Record<string, unknown>[];
    const { editable: itemsEditable, readonly: itemsReadonly } = separateArrayByFields(
      items,
      itemInfo.config
    );
    return {
      editable: { ...sectionEditable, [itemInfo.key]: itemsEditable },
      readonly: { [itemInfo.key]: itemsReadonly },
    };
  }

  return { editable: sectionEditable, readonly: {} };
}

/**
 * Recombina editable/readonly de seção wrapper em formato Firestore.
 *
 * @param params.editable - Campos editáveis (section-level + array editável)
 * @param params.readonly - Campos readonly (array readonly pareado)
 * @param params.fields - Config completo (ex: SECTION_FIELDS.supporters)
 * @returns Objeto flat recombinado no formato Firestore (TResult)
 */
export function combineWrapperFromFields<TResult>(params: {
  editable: Record<string, unknown>;
  readonly: Record<string, unknown>;
  fields: Record<string, unknown>;
}): TResult {
  const { editable, readonly, fields } = params;
  const itemInfo = getItemFields(fields);
  const result: Record<string, unknown> = {};

  // Section-level: copiar campos do editable (e readonly se houver)
  for (const [key, value] of Object.entries(editable)) {
    if (itemInfo && key === itemInfo.key) continue;
    result[key] = value;
  }
  for (const [key, value] of Object.entries(readonly)) {
    if (itemInfo && key === itemInfo.key) continue;
    result[key] = value;
  }

  // Item-level: recombinar arrays
  if (itemInfo) {
    const editableItems = (editable[itemInfo.key] ?? []) as Partial<unknown>[];
    const readonlyItems = (readonly[itemInfo.key] ?? []) as Partial<unknown>[];
    result[itemInfo.key] = combineArrayFromFields({ editable: editableItems, readonly: readonlyItems });
  }

  return result as TResult;
}

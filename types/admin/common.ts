/**
 * Common Admin Types - Elas Podem Admin
 *
 * Tipos genéricos reutilizados por todas as páginas admin:
 * - ISectionConfig: config de UI dos accordions do editor
 * - IPageSectionConfig / IPageEditorConfig: config do orquestrador de save
 * - ISaveResult / IValidationResult: resultado de operações
 * - IAdminLog: audit log
 */

import type { Component, Ref } from 'vue';

// ============================================================
// EDITOR UI — Config dos accordions (homeEdit, aboutEdit, etc.)
// ============================================================

export interface ISectionConfig {
  name: string;
  title: string;
  icon: string;
  component: Component;
}

// ============================================================
// PAGE EDITOR — Orquestrador de save/reset
// ============================================================

export interface IPageSectionConfig {
  name: string;
  form: Ref<any>;
  originalData: () => any;
  validator: (data: any) => IValidationResult;
  saveFunction: (data: any) => Promise<void>;
  getImageUrls: () => { old?: string; new?: string };
  updateLocalData: (data: any) => void;
}

export interface IPageEditorConfig {
  pageName: string;
  sections: IPageSectionConfig[];
  pageData: Ref<any>;
  tempUploadedImages: Ref<string[]>;
}

// ============================================================
// SAVE / VALIDATION
// ============================================================

export interface ISaveResult {
  success: boolean;
  message: string;
  savedSections: string[];
  error?: Error;
}

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================
// ADMIN LOG
// ============================================================

export interface IAdminLog {
  action: string;
  details: Record<string, any>;
  timestamp: string;
  user: string;
}

/**
 * 🔧 Firestore Collections - Nomes centralizados
 *
 * Unica fonte de verdade para nomes de collections e documentos.
 * Mudou o nome no Firestore? Muda aqui, propaga pro projeto inteiro.
 */

// ============== COLLECTIONS ==============

export const FIRESTORE_COLLECTIONS = {
  PAGES: 'pages',
  USERS: 'users',
  ADMIN_LOGS: 'admin_logs',
} as const satisfies Record<string, string>;

export type FirestoreCollection =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];

// ============== DOCUMENTS (por collection) ==============

export const PAGE_DOCUMENTS = {
  HOME: 'home',
  ABOUT: 'about',
} as const satisfies Record<string, string>;

export type PageDocument = (typeof PAGE_DOCUMENTS)[keyof typeof PAGE_DOCUMENTS];

// ============== UTILS ==============

export function isValidCollection(name: string): name is FirestoreCollection {
  return Object.values(FIRESTORE_COLLECTIONS).includes(name as FirestoreCollection);
}

export function isValidPageDocument(name: string): name is PageDocument {
  return Object.values(PAGE_DOCUMENTS).includes(name as PageDocument);
}

export const ALL_COLLECTIONS = Object.values(FIRESTORE_COLLECTIONS) as FirestoreCollection[];
export const ALL_PAGE_DOCUMENTS = Object.values(PAGE_DOCUMENTS) as PageDocument[];

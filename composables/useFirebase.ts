/**
 * 🎣 useFirebase - Inicializacao e acesso ao Firebase
 *
 * Singleton que inicializa Firebase App, Firestore, Auth e Storage.
 * Usa useConfig() para ler as env vars do .env via runtimeConfig.
 *
 * @dependencias
 * - firebase/app, firebase/firestore, firebase/auth, firebase/storage
 * - config/index.ts (useConfig)
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';

// ============== DEPENDENCIAS INTERNAS ==============

import { useConfig } from '@config';

// ============== INTERFACES ==============

export interface IFirebaseServices {
  $app: FirebaseApp;
  $db: Firestore;
  $auth: Auth;
  $storage: FirebaseStorage;
}

// ============== SINGLETON ==============

let _services: IFirebaseServices | null = null;

// ============== COMPOSABLE ==============

/**
 * Retorna as instancias do Firebase (app, db, auth, storage).
 *
 * Na primeira chamada, inicializa o Firebase App com as env vars.
 * Chamadas subsequentes retornam a mesma instancia (singleton).
 *
 * Deve ser chamado dentro de contexto Vue (setup, composables, plugins, middleware).
 */
export function useFirebase(): IFirebaseServices {
  if (_services) return _services;

  const config = useConfig();

  let app: FirebaseApp;

  if (getApps().length === 0) {
    app = initializeApp({
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      projectId: config.firebase.projectId,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId,
      appId: config.firebase.appId,
    });
  } else {
    app = getApps()[0]!;
  }

  _services = {
    $app: app,
    $db: getFirestore(app),
    $auth: getAuth(app),
    $storage: getStorage(app),
  };

  return _services;
}

// ============== EXPORTS ==============

export type UseFirebase = ReturnType<typeof useFirebase>;

/**
 * 🎣 useAuth - Gerenciamento de autenticacao
 *
 * Singleton com Firebase Auth + Firestore users (multi-role).
 * Login, logout, auth state listener, permissoes por role.
 *
 * @dependencias
 * - firebase/auth (signIn, signOut, onAuthStateChanged)
 * - firebase/firestore (collection users para role/displayName)
 * - composables/useFirebase (instancias Firebase)
 * - definitions/adminRoles (roles e permissoes)
 */

// ============== DEPENDENCIAS EXTERNAS ==============

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

// ============== DEPENDENCIAS INTERNAS ==============

import { useFirebase } from '@composables/useFirebase';
import { ADMIN_ROLES, isValidRole, getRolePermissions } from '@definitions/adminRoles';
import type { AdminRole } from '@definitions/adminRoles';
import { Logger } from '@utils/Logger';

// ============== INTERFACES ==============

export interface IUserData {
  id?: string;
  email: string;
  displayName: string;
  role: AdminRole;
  active: boolean;
  lastLogin: Timestamp | null;
}

export interface IAuthResult {
  success: boolean;
  error?: string;
}

interface IAuthState {
  user: FirebaseUser | null;
  userData: IUserData | null;
  isLoading: boolean;
  error: string | null;
}

// ============== CONSTANTS ==============

const logger = Logger.child({ composable: 'useAuth' });

// ============== SINGLETON ==============

let _state: ReturnType<typeof reactive<IAuthState>> | null = null;

function getState() {
  if (_state) return _state;
  _state = reactive<IAuthState>({
    user: null,
    userData: null,
    isLoading: true,
    error: null,
  });
  return _state;
}

// ============== COMPOSABLE ==============

export function useAuth() {
  const { $auth, $db } = useFirebase();
  const state = getState();

  // ===== COMPUTED =====

  const isAuthenticated = computed(() => !!state.user);

  const isAdmin = computed(
    () => state.userData?.role === ADMIN_ROLES.ADMIN && state.userData?.active === true,
  );

  const isRedatora = computed(
    () => state.userData?.role === ADMIN_ROLES.REDATORA && state.userData?.active === true,
  );

  const isModeradora = computed(
    () => state.userData?.role === ADMIN_ROLES.MODERADORA && state.userData?.active === true,
  );

  const userRole = computed(() => state.userData?.role ?? null);

  const permissions = computed(() => {
    if (!state.userData?.role || !state.userData?.active) return null;
    return getRolePermissions(state.userData.role);
  });

  // ===== HELPERS INTERNOS =====

  /**
   * Busca dados do usuario no Firestore pelo email.
   * Collection: /users (doc por uid ou query por email)
   */
  const fetchUserData = async (email: string): Promise<IUserData | null> => {
    try {
      const usersRef = collection($db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { ...userDoc.data(), id: userDoc.id } as IUserData;
      }

      logger.warn('Usuario nao encontrado no Firestore', { email });
      return null;
    } catch (error) {
      logger.error('Erro ao buscar dados do usuario', error as Error, { email });
      return null;
    }
  };

  /**
   * Atualiza timestamp de ultimo login no Firestore.
   */
  const updateLastLogin = async (userId: string): Promise<void> => {
    try {
      const userDocRef = doc($db, 'users', userId);
      await updateDoc(userDocRef, { lastLogin: Timestamp.now() });
    } catch (error) {
      logger.warn('Erro ao atualizar ultimo login', { userId });
    }
  };

  // ===== ACTIONS PUBLICAS =====

  /**
   * Login com email e senha.
   *
   * Fluxo:
   * 1. Autentica no Firebase Auth
   * 2. Busca dados (role, active) no Firestore /users
   * 3. Valida se esta ativo
   * 4. Atualiza lastLogin
   */
  const signIn = async (email: string, password: string): Promise<IAuthResult> => {
    state.isLoading = true;
    state.error = null;

    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password);
      const firebaseUser = userCredential.user;

      const userData = await fetchUserData(firebaseUser.email!);

      if (!userData) {
        throw new Error('Dados do usuario nao encontrados');
      }

      if (!userData.active) {
        throw new Error('Usuario desativado');
      }

      if (!isValidRole(userData.role)) {
        throw new Error(`Role invalida: ${userData.role}`);
      }

      state.user = firebaseUser;
      state.userData = userData;

      if (userData.id) {
        await updateLastLogin(userData.id);
      }

      logger.info('Login realizado', {
        email: firebaseUser.email,
        role: userData.role,
      });

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro no login';
      state.error = message;
      logger.error('Falha no login', error instanceof Error ? error : null, { email });
      return { success: false, error: message };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * Logout — limpa estado e redireciona pra home.
   */
  const signOut = async (): Promise<IAuthResult> => {
    try {
      await firebaseSignOut($auth);

      state.user = null;
      state.userData = null;
      state.error = null;

      logger.info('Logout realizado');

      await navigateTo('/');
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro no logout';
      state.error = message;
      logger.error('Falha no logout', error instanceof Error ? error : null);
      return { success: false, error: message };
    }
  };

  /**
   * Refresh dos dados do usuario (re-busca do Firestore).
   */
  const refreshUserData = async (): Promise<void> => {
    if (!state.user?.email) return;

    const userData = await fetchUserData(state.user.email);
    if (userData) {
      state.userData = userData;
      logger.debug('Dados do usuario atualizados', { role: userData.role });
    }
  };

  /**
   * Verifica se o usuario tem permissao para acessar o admin.
   * Qualquer role ativa tem acesso (permissoes especificas sao por acao).
   */
  const hasAdminAccess = (): boolean => {
    return isAuthenticated.value && !!state.userData?.active;
  };

  /**
   * Observer de mudancas de autenticacao.
   * Chamado pelo plugin auth.client.ts no boot da aplicacao.
   */
  const initAuthStateListener = () => {
    return onAuthStateChanged($auth, async (firebaseUser) => {
      state.isLoading = true;

      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.email!);
        state.user = firebaseUser;
        state.userData = userData;

        if (userData) {
          logger.debug('Auth state: logado', {
            email: firebaseUser.email,
            role: userData.role,
          });
        }
      } else {
        state.user = null;
        state.userData = null;
        logger.debug('Auth state: deslogado');
      }

      state.isLoading = false;
    });
  };

  // ===== RETURN =====

  return {
    // Estado (refs do reactive)
    ...toRefs(state),

    // Computed
    isAuthenticated,
    isAdmin,
    isRedatora,
    isModeradora,
    userRole,
    permissions,

    // Actions
    signIn,
    signOut,
    refreshUserData,
    hasAdminAccess,
    initAuthStateListener,
  };
}

// ============== EXPORTS ==============

export type UseAuth = ReturnType<typeof useAuth>;

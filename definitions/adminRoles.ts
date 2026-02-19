/**
 * 🎭 Admin Roles - Papeis de usuarios do admin Elas Podem
 *
 * Define roles, display names, permissoes e helpers.
 * Padrao CODE_STYLE_GUIDE: as const satisfies + tipos derivados.
 */

// ============== ROLES ==============

export const ADMIN_ROLES = {
  ADMIN: 'admin',
  REDATORA: 'redatora',
  MODERADORA: 'moderadora',
} as const satisfies Record<string, string>;

// ============== TYPES ==============

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

// ============== DISPLAY NAMES ==============

export const ADMIN_ROLE_DISPLAY_NAMES: Record<AdminRole, string> = {
  [ADMIN_ROLES.ADMIN]: 'Administradora',
  [ADMIN_ROLES.REDATORA]: 'Redatora',
  [ADMIN_ROLES.MODERADORA]: 'Moderadora',
};

// ============== DESCRIPTIONS ==============

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  [ADMIN_ROLES.ADMIN]: 'Acesso total — editar conteudo, gerenciar usuarios, configuracoes',
  [ADMIN_ROLES.REDATORA]: 'Editar conteudo — textos, imagens, secoes da home',
  [ADMIN_ROLES.MODERADORA]: 'Visualizar e aprovar — revisar alteracoes antes de publicar',
};

// ============== PERMISSOES ==============

/**
 * Define quais acoes cada role pode fazer.
 * Usado no admin pra habilitar/desabilitar botoes e acoes.
 */
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, {
  canEdit: boolean;
  canPublish: boolean;
  canManageUsers: boolean;
  canViewLogs: boolean;
}> = {
  [ADMIN_ROLES.ADMIN]: {
    canEdit: true,
    canPublish: true,
    canManageUsers: true,
    canViewLogs: true,
  },
  [ADMIN_ROLES.REDATORA]: {
    canEdit: true,
    canPublish: false,
    canManageUsers: false,
    canViewLogs: false,
  },
  [ADMIN_ROLES.MODERADORA]: {
    canEdit: false,
    canPublish: true,
    canManageUsers: false,
    canViewLogs: true,
  },
};

// ============== UTILS ==============

export function isValidRole(role: string): role is AdminRole {
  return Object.values(ADMIN_ROLES).includes(role as AdminRole);
}

export function getRoleDisplayName(role: string): string {
  if (isValidRole(role)) {
    return ADMIN_ROLE_DISPLAY_NAMES[role];
  }
  return role;
}

export function getRolePermissions(role: string) {
  if (isValidRole(role)) {
    return ADMIN_ROLE_PERMISSIONS[role];
  }
  return null;
}

export const ALL_ROLES = Object.values(ADMIN_ROLES) as AdminRole[];

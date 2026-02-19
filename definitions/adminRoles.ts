/**
 * 🎭 Admin Roles - Papeis de usuarios do admin Elas Podem
 *
 * Define roles, display names, permissoes e helpers.
 * Padrao CODE_STYLE_GUIDE: as const satisfies + tipos derivados.
 *
 * Hierarquia: superAdmin > admin > writer/moderator
 * O superAdmin e o responsavel pelo projeto — nao pode ser desativado/removido.
 */

// ============== ROLES ==============

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'superAdmin',
  ADMIN: 'admin',
  WRITER: 'writer',
  MODERATOR: 'moderator',
} as const satisfies Record<string, string>;

// ============== TYPES ==============

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

// ============== DISPLAY NAMES ==============

export const ADMIN_ROLE_DISPLAY_NAMES: Record<AdminRole, string> = {
  [ADMIN_ROLES.SUPER_ADMIN]: 'Super Admin',
  [ADMIN_ROLES.ADMIN]: 'Administradora',
  [ADMIN_ROLES.WRITER]: 'Writer',
  [ADMIN_ROLES.MODERATOR]: 'Moderator',
};

// ============== DESCRIPTIONS ==============

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  [ADMIN_ROLES.SUPER_ADMIN]: 'Responsavel pelo projeto — controle absoluto, nao pode ser desativado',
  [ADMIN_ROLES.ADMIN]: 'Acesso total — editar conteudo, gerenciar usuarios, configuracoes',
  [ADMIN_ROLES.WRITER]: 'Editar conteudo — textos, imagens, secoes da home',
  [ADMIN_ROLES.MODERATOR]: 'Visualizar e aprovar — revisar alteracoes antes de publicar',
};

// ============== PERMISSOES ==============

/**
 * Define quais acoes cada role pode fazer.
 * Usado no admin pra habilitar/desabilitar botoes e acoes.
 *
 * superAdmin e admin tem as mesmas permissoes.
 * A diferenca e hierarquica: superAdmin nao pode ser desativado/removido.
 */
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, {
  canEdit: boolean;
  canPublish: boolean;
  canManageUsers: boolean;
  canViewLogs: boolean;
}> = {
  [ADMIN_ROLES.SUPER_ADMIN]: {
    canEdit: true,
    canPublish: true,
    canManageUsers: true,
    canViewLogs: true,
  },
  [ADMIN_ROLES.ADMIN]: {
    canEdit: true,
    canPublish: true,
    canManageUsers: true,
    canViewLogs: true,
  },
  [ADMIN_ROLES.WRITER]: {
    canEdit: true,
    canPublish: false,
    canManageUsers: false,
    canViewLogs: false,
  },
  [ADMIN_ROLES.MODERATOR]: {
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

/** Verifica se a role e superAdmin (responsavel pelo projeto) */
export function isSuperAdminRole(role: string): boolean {
  return role === ADMIN_ROLES.SUPER_ADMIN;
}

export const ALL_ROLES = Object.values(ADMIN_ROLES) as AdminRole[];

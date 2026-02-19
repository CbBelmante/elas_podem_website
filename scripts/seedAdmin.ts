/**
 * 🌱 Seed Admin - Cria usuario admin no Firebase via prompts interativos
 *
 * Cria TUDO automaticamente:
 * 1. Usuario no Firebase Auth (email/senha)
 * 2. Documento no Firestore /users (role, displayName, active)
 *
 * Requer:
 * - serviceAccountKey.json na raiz do projeto (baixar do Firebase Console)
 *   Firebase Console → Configuracoes do Projeto → Contas de Servico → Gerar nova chave
 *
 * Uso:
 *   npm run seedAdmin
 *
 * Roles validas (definidas em definitions/adminRoles.ts):
 *   superAdmin — responsavel pelo projeto, controle absoluto
 *   admin      — acesso total ao admin
 *   writer     — so edita conteudo
 *   moderator  — so aprova/revisa
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { input, password, select, confirm } from '@inquirer/prompts';
import { ALL_ROLES, ADMIN_ROLE_DESCRIPTIONS } from '../definitions/adminRoles';

// ============== ROLES (importadas de definitions/adminRoles.ts) ==============

const ROLE_CHOICES = ALL_ROLES.map((role) => ({
  name: `${role} — ${ADMIN_ROLE_DESCRIPTIONS[role]}`,
  value: role,
}));

// ============== FIREBASE ADMIN INIT ==============

let serviceAccount;

try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf-8'));
} catch {
  console.error('');
  console.error('  ❌ Arquivo serviceAccountKey.json nao encontrado na raiz do projeto');
  console.error('');
  console.error('  Como obter:');
  console.error('  1. Acesse o Firebase Console (console.firebase.google.com)');
  console.error('  2. Va em Configuracoes do Projeto → Contas de Servico');
  console.error('  3. Clique em "Gerar nova chave privada"');
  console.error('  4. Salve o arquivo como serviceAccountKey.json na raiz do projeto');
  console.error('');
  console.error('  ⚠️  NUNCA comite este arquivo no git (ja deve estar no .gitignore)');
  console.error('');
  process.exit(1);
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);
const db = getFirestore(app);

// ============== PROMPTS ==============

async function askUserData() {
  console.log('');
  console.log('  🌱 Seed Admin — Elas Podem');
  console.log('  ─────────────────────────────');
  console.log('');

  const email = await input({
    message: 'Email do usuario:',
    validate: (value) => {
      if (!value.includes('@')) return 'Email invalido';
      return true;
    },
  });

  const pwd = await password({
    message: 'Senha (minimo 6 caracteres):',
    mask: '*',
    validate: (value) => {
      if (value.length < 6) return 'Senha deve ter no minimo 6 caracteres';
      return true;
    },
  });

  await password({
    message: 'Confirme a senha:',
    mask: '*',
    validate: (value) => {
      if (value !== pwd) return 'Senhas nao conferem';
      return true;
    },
  });

  const displayName = await input({
    message: 'Nome de exibicao:',
    validate: (value) => {
      if (!value.trim()) return 'Nome nao pode ser vazio';
      return true;
    },
  });

  const role = await select({
    message: 'Role do usuario:',
    choices: ROLE_CHOICES,
  });

  return { email, password: pwd, displayName, role };
}

// ============== SEED ==============

async function seedAdmin() {
  const userData = await askUserData();

  // Confirmacao antes de criar
  console.log('');
  console.log('  ─────────────────────────────');
  console.log(`  📧 Email: ${userData.email}`);
  console.log(`  👤 Nome:  ${userData.displayName}`);
  console.log(`  🎭 Role:  ${userData.role}`);
  console.log('  ─────────────────────────────');

  const confirmed = await confirm({
    message: 'Criar este usuario?',
    default: true,
  });

  if (!confirmed) {
    console.log('');
    console.log('  ❌ Cancelado pelo usuario');
    console.log('');
    process.exit(0);
  }

  console.log('');

  // 1. Criar usuario no Firebase Auth
  console.log('  [1/2] Criando usuario no Firebase Auth...');

  let authUser;

  try {
    // Tenta buscar usuario existente (pra nao duplicar)
    authUser = await auth.getUserByEmail(userData.email);
    console.log(`  ⚠️  Usuario ja existe no Auth (uid: ${authUser.uid})`);
  } catch {
    // Nao existe — cria novo
    authUser = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });
    console.log(`  ✅ Usuario criado no Auth (uid: ${authUser.uid})`);
  }

  // 2. Criar documento no Firestore /users
  console.log('  [2/2] Criando documento no Firestore /users...');

  const userDoc = {
    email: userData.email,
    displayName: userData.displayName,
    role: userData.role,
    active: true,
    lastLogin: null,
  };

  await db.collection('users').doc(authUser.uid).set(userDoc, { merge: true });
  console.log(`  ✅ Documento criado em /users/${authUser.uid}`);

  // Resumo
  console.log('');
  console.log('  ────────────────────────────────────');
  console.log('  ✅ Seed completo!');
  console.log('');
  console.log('  Agora voce pode:');
  console.log('  1. Rodar npm run dev');
  console.log('  2. Acessar /admin/login');
  console.log(`  3. Logar com ${userData.email}`);
  console.log('');
}

seedAdmin().catch((error) => {
  console.error('');
  console.error('  ❌ Erro ao criar admin:', error.message);
  console.error('');
  process.exit(1);
});

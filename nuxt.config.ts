import { resolve, dirname } from 'path';
import { existsSync, lstatSync, readlinkSync } from 'fs';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(() => {
  // Detectar se CBComponents está em desenvolvimento local (npm link)
  const cbSymlinkPath = resolve(__dirname, 'node_modules/@cb/components');
  const isSymlink = existsSync(cbSymlinkPath) && lstatSync(cbSymlinkPath).isSymbolicLink();
  const cbComponentsPath = isSymlink
    ? resolve(dirname(cbSymlinkPath), readlinkSync(cbSymlinkPath))
    : '';
  const hasLocalCBComponents = isSymlink;

  // Log do modo de desenvolvimento
  if (hasLocalCBComponents) {
    console.log('*** CBComponents: Modo DESENVOLVIMENTO (npm link detectado)');
    console.log(`    Caminho: ${cbComponentsPath}`);
  } else {
    console.log('*** CBComponents: Modo PRODUCAO');
  }

  return {
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint'],
    vite: {
      optimizeDeps: {
        exclude: ['@cb/components'],
      },
      server: {
        fs: {
          allow: [resolve(__dirname), resolve(__dirname, '../cbcomponents')],
        },
      },
    },
  };
});

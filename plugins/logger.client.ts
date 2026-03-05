/**
 * 📝 Logger Plugin - Configura CbLogger com flags do app
 *
 * Passa features.enableDebugLogs do config pro Logger.configure().
 * Roda apenas no client (.client.ts).
 */

import { Logger } from '@cb/components';
import { APP_CONSTANTS } from '@config/constants';

export default defineNuxtPlugin(() => {
  Logger.configure({
    forceDebug: APP_CONSTANTS.features.enableDebugLogs,
  });
});

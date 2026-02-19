/**
 * 📝 Logger - Professional Frontend Logging Framework
 *
 * Sistema de logs estruturados para Vue/Nuxt.
 * Elimina console.log em produção, filtragem por nível.
 */

/**
 * @example
 * import { Logger } from './Logger.js'
 * Logger.info('Usuário logou', { userId: 123 })
 */

// ============== DEPENDÊNCIAS EXTERNAS ==============

import { ref } from 'vue';
import { config as appConfig } from '@config';
import dayjs from 'dayjs';

// ============== CONSTANTES DE CONFIGURAÇÃO DE NÍVEIS DE LOG ==============

/**
 * 🎯 Níveis de log para filtragem de saída
 *
 * Hierarquia de prioridade onde números menores = mais verboso
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4,
};

/**
 * 🎨 Conjuntos de emojis para logs visuais
 *
 * Diferentes sets para diversos contextos de uso:
 * - default: Balanceado para uso geral
 * - minimal: Discreto para ambientes profissionais
 * - colorful: Vibrante para desenvolvimento visual
 */
const EMOJI_SETS = {
  default: {
    debug: '🐛',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    timing: '⏱️',
    success: '✅',
  },
  minimal: {
    debug: '🔍',
    info: '💡',
    warn: '🔶',
    error: '🚨',
    timing: '📊',
    success: '🎉',
  },
  colorful: {
    debug: '🕵️',
    info: '🔵',
    warn: '🟡',
    error: '🔴',
    timing: '⏰',
    success: '🟢',
  },
};

/**
 * 🎨 Estilos CSS para console.group() - Centralizado para fácil customização
 *
 * Cada nível de log tem:
 * - emoji: Bolinha colorida para identificação visual rápida
 * - labelStyle: CSS para o badge do nível (ex: "🔴 ERROR")
 * - messageStyle: CSS para a mensagem após o badge
 * - collapsed: Se deve iniciar fechado (true) ou aberto (false)
 */
const LOG_STYLES = {
  DEBUG: {
    emoji: '🟢',
    labelStyle: 'color: #22c55e; font-weight: bold;',
    messageStyle: 'color: inherit;',
    collapsed: true,
  },
  INFO: {
    emoji: '🔵',
    labelStyle: 'color: #3b82f6; font-weight: bold;',
    messageStyle: 'color: inherit;',
    collapsed: true,
  },
  WARN: {
    emoji: '🟠',
    labelStyle: 'color: #f59e0b; font-weight: bold;',
    messageStyle: 'color: inherit;',
    collapsed: true,
  },
  ERROR: {
    emoji: '🔴',
    labelStyle: 'color: #dc2626; font-weight: bold; font-size: 14px;',
    messageStyle: 'color: #dc2626; font-weight: bold;',
    collapsed: false, // ERROR sempre expandido!
  },
};

/**
 * 🔧 Define nível de log baseado no ambiente
 *
 * @returns {number} Nível de log apropriado
 */
const getLogLevel = () => {
  // Usa config.ts para verificar ambiente
  if (appConfig.features.enableDebugLogs) {
    return LOG_LEVELS.DEBUG;
  }

  if (appConfig.isProduction) {
    return LOG_LEVELS.WARN;
  }

  // Default: desenvolvimento
  return LOG_LEVELS.DEBUG;
};

/**
 * ⏱️ Formata timestamp para logs
 *
 * @returns {string} Timestamp no formato HH:MM:SS
 */
const getTimestamp = () => {
  return new Date().toISOString().split('T')[1].split('.')[0];
};

/**
 * 🔧 Configuração global do Logger
 */
const config = {
  // 🎨 Configurações visuais
  emojis: false,
  emojiSet: 'default',

  // 🛡️ Proteção de dados sensíveis
  redact: [], // Array de campos para censurar (ex: ['password', 'token', 'cpf'])
  censor: '**PROTECTED**', // Texto de substituição para dados sensíveis

  // 📊 Modes de output
  structuredMode: false, // false = visual dev, true = JSON estruturado

  // ⚡ Performance
  asyncMode: false, // Buffer assíncrono para não bloquear UI
};

// 🗂️ Buffer assíncrono para performance
let logBuffer = [];
let bufferTimeout = null;

/**
 * 🛡️ Redação de dados sensíveis
 *
 * Remove dados sensíveis de objetos baseado na configuração global.
 * Suporta caminhos aninhados usando notação de ponto.
 *
 * @param {Object} obj - Objeto para censurar dados sensíveis
 * @param {string[]} [redactPaths] - Caminhos para censurar
 * @returns {Object} Objeto com dados sensíveis censurados
 *
 * @example
 * const userData = {
 *   user: { name: 'João', email: 'joao@test.com' },
 *   password: 'senha123',
 *   token: 'abc123'
 * }
 *
 * const safe = redactSensitiveData(userData, ['password', 'user.email'])
 * // Retorna: { user: { name: 'João', email: '**PROTECTED**' }, password: '**PROTECTED**', token: 'abc123' }
 */
const redactSensitiveData = (obj, redactPaths = config.redact) => {
  // Proteção contra tipos inválidos
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  // Se não há caminhos para censurar, retorna original
  if (!Array.isArray(redactPaths) || redactPaths.length === 0) {
    return obj;
  }

  // Clona o objeto para evitar mutação
  const result = { ...obj };

  redactPaths.forEach((path) => {
    const keys = path.split('.');
    let current = result;

    // Navega até o penúltimo nível
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] && typeof current[keys[i]] === 'object') {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      } else {
        // Caminho não existe, pula
        return;
      }
    }

    // Censura o campo final se existe
    const finalKey = keys[keys.length - 1];
    if (current && Object.prototype.hasOwnProperty.call(current, finalKey)) {
      current[finalKey] = config.censor;
    }
  });

  return result;
};

/**
 * 📊 Detecção inteligente de modo de output (v2.0)
 *
 * Determina automaticamente se deve usar formato visual ou JSON estruturado
 * baseado no ambiente e configuração.
 *
 * @returns {'json'|'visual'} Modo de output apropriado
 */
const getOutputMode = () => {
  // Modo explícito tem prioridade
  if (config.structuredMode) return 'json';

  // Auto-detecção baseada no ambiente usando config.ts
  if (appConfig.isProduction) return 'json';

  // Modo visual para desenvolvimento
  return 'visual';
};

/**
 * 📊 Formatação adaptável de output
 *
 * @param {string} level - Nível do log
 * @param {string} message - Mensagem do log
 * @param {Object} [context={}] - Contexto adicional
 * @returns {string|Object} Formato visual (dev) ou JSON (prod)
 *
 * @example
 * // Modo desenvolvimento (visual)
 * formatOutput('INFO', 'User login', { userId: 123 })
 * // Retorna: "ℹ️ [14:30:25] [INFO] User login"
 *
 * // Modo produção (JSON)
 * formatOutput('INFO', 'User login', { userId: 123 })
 * // Retorna: { level: 'info', time: '2025-01-28T14:30:25.000Z', msg: 'User login', userId: 123 }
 */
const formatOutput = (level, message, context = {}, isTiming = false) => {
  const outputMode = getOutputMode();

  // 🎯 Extrai badge ANTES de aplicar redação (badge não vai pro contexto)
  const { cleanContext } = extractBadge(context);

  // Aplica redação de dados sensíveis sempre
  const safeContext = redactSensitiveData(cleanContext);

  if (outputMode === 'json') {
    // Formato JSON estruturado para produção
    return {
      level: level.toLowerCase(),
      time: new Date().toISOString(),
      msg: message,
      ...safeContext,
    };
  }

  // Formato visual para desenvolvimento (v1.x compatível)
  // Passa o contexto ORIGINAL (com badge) para formatLogMessage extrair o badge
  return formatLogMessage(level, message, context, isTiming);
};

/**
 * 🎯 Extrai badge do contexto e retorna contexto limpo
 *
 * O badge é usado apenas para formatação da mensagem,
 * não deve aparecer no objeto de contexto logado.
 *
 * @param {Object} context - Contexto original
 * @returns {{ badge: string|null, cleanContext: Object }} Badge extraído e contexto limpo
 */
const extractBadge = (context) => {
  const badge = context.badge || null;

  // Se não tem badge, retorna contexto original
  if (!badge) {
    return { badge: null, cleanContext: context };
  }

  // Remove badge do contexto
  const { badge: _, ...cleanContext } = context;

  return { badge, cleanContext };
};

/**
 * 📊 Formata mensagem de log com emojis opcionais (v1.x compatível)
 *
 * Função mantida para compatibilidade com v1.x. Use formatOutput para funcionalidades v2.0.
 *
 * @param {string} level - Nível do log (DEBUG, INFO, WARN, ERROR)
 * @param {string} message - Mensagem do log
 * @param {Object} [context={}] - Contexto adicional
 * @param {boolean} [isTiming=false] - Se é log de timing
 * @returns {string} Mensagem formatada
 */
const formatLogMessage = (level, message, context = {}, isTiming = false) => {
  const timestamp = getTimestamp();
  const shouldShowEmoji = config.emojis || context.emoji;

  // 🎯 Extrai badge do contexto (não aparecerá no log)
  const { badge } = extractBadge(context);
  const customBadge = badge ? `[${badge}] ` : '';

  if (!shouldShowEmoji) {
    return `[${timestamp}] [${level}] ${customBadge}${message}`;
  }

  const emojiSet = EMOJI_SETS[config.emojiSet] || EMOJI_SETS.default;
  let emoji = '';

  if (isTiming) {
    emoji = emojiSet.timing;
  } else {
    switch (level) {
      case 'DEBUG':
        emoji = emojiSet.debug;
        break;
      case 'INFO':
        emoji = emojiSet.info;
        break;
      case 'WARN':
        emoji = emojiSet.warn;
        break;
      case 'ERROR':
        emoji = emojiSet.error;
        break;
      default:
        emoji = emojiSet.info;
    }
  }

  return `${emoji} [${timestamp}] [${level}] ${customBadge}${message}`;
};

/**
 * 🎨 Formata mensagem SEM badge de nível (para console.group)
 *
 * Usado quando vamos mostrar o nível com bolinha colorida,
 * então não precisa do [DEBUG], [INFO], etc.
 *
 * @param {string} message - Mensagem do log
 * @param {Object} [context={}] - Contexto adicional
 * @returns {string} Mensagem formatada apenas com timestamp
 */
const formatMessageForGroup = (message, context = {}) => {
  const timestamp = getTimestamp();
  const { badge } = extractBadge(context);
  const customBadge = badge ? `[${badge}] ` : '';

  return `[${timestamp}] ${customBadge}${message}`;
};

/**
 * 🔍 Captura informações de quem chamou o Logger
 *
 * Parse do stack trace para identificar arquivo, linha e função real
 * que invocou o logger, pulando as linhas internas do Logger.ts
 *
 * @returns {{ function: string; file: string; line: number; column: number }} Informações do caller
 *
 * @example
 * const caller = captureCallerInfo();
 * // Retorna: { function: 'ApiService.get', file: 'ApiService.ts', line: 219, column: 15 }
 */
const captureCallerInfo = (): { function: string; file: string; line: number; column: number } => {
  const err = new Error();
  const stack = err.stack?.split('\n') ?? [];

  // Pula linhas do Logger.ts e pega a primeira linha externa
  // stack[0] = "Error"
  // stack[1] = "at captureCallerInfo (Logger.ts:XXX)"
  // stack[2] = "at Logger.error (Logger.ts:XXX)"
  // stack[3] = "at CALLER_REAL (ApiService.ts:219)" ✅ QUEREMOS ESSA!
  let callerLine = stack[3] ?? stack[2] ?? '';

  // Se ainda estiver no Logger, tenta próxima
  if (callerLine.includes('Logger.ts')) {
    callerLine = stack[4] ?? stack[3] ?? '';
  }

  // Parse: "at functionName (file.ts:123:45)" ou "at file.ts:123:45"
  const match = callerLine.match(/at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?/);

  if (match) {
    return {
      function: match[1] ?? 'anonymous',
      file: match[2]?.split('/').pop() ?? 'unknown',
      line: parseInt(match[3]) ?? 0,
      column: parseInt(match[4]) ?? 0,
    };
  }

  return { function: 'unknown', file: 'unknown', line: 0, column: 0 };
};

/**
 * ⚡ Sistema de buffer assíncrono para performance (v2.0)
 *
 * Processa logs em batches para evitar bloqueio da UI em aplicações
 * com alto volume de logging.
 */
const flushLogs = () => {
  if (logBuffer.length === 0) return;

  // requestIdleCallback disponível no browser
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(
      () => {
        const logsToProcess = [...logBuffer];
        logBuffer = [];

        logsToProcess.forEach((logEntry) => {
          const { method, args } = logEntry;
          console[method](...args);
        });
      },
      { timeout: 100 }
    );
  } else {
    // Fallback para Node.js ou browsers antigos
    setTimeout(() => {
      const logsToProcess = [...logBuffer];
      logBuffer = [];

      logsToProcess.forEach((logEntry) => {
        const { method, args } = logEntry;
        console[method](...args);
      });
    }, 0);
  }
};

/**
 * 🎯 Logger v2 - Sistema de logs profissional para frontend
 *
 * Classe principal com funcionalidades avançadas de logging, proteção de dados
 * e sistema hierárquico de contexto.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Logger {
  // 🔗 Contexto herdado para child loggers
  static _context: Record<string, any> = {};
  // 🎚️ Nível mínimo de log para este logger (default: herda global)
  static _minLevel: number | null = null;
  // 📋 Histórico de erros recentes (para DebugPanel e tracking) - REATIVO!
  private static _recentErrors = ref<
    Array<{
      timestamp: string;
      message: string;
      error?: Error | null;
      context?: Record<string, any>;
    }>
  >([]);
  // ⚙️ Quantidade máxima de erros a manter no histórico
  private static _maxRecentErrors: number = 10;

  /**
   * 🔧 Configura comportamento global dos logs (v2.0 expandido)
   *
   * @param {Object} [options={}] - Opções de configuração
   * @param {boolean} [options.emojis=false] - Habilita emojis nos logs
   * @param {string} [options.emojiSet='default'] - Conjunto de emojis ('default', 'minimal', 'colorful')
   * @param {string[]} [options.redact=[]] - Campos para censurar dados sensíveis
   * @param {string} [options.censor='**PROTECTED**'] - Texto de substituição para dados sensíveis
   * @param {boolean} [options.structuredMode=false] - Força modo JSON estruturado
   * @param {boolean} [options.asyncMode=false] - Habilita buffer assíncrono para performance
   *
   * @example
   * // Configuração básica
   * Logger.configure({
   *   emojis: true,
   *   emojiSet: 'colorful'
   * })
   *
   * // Configuração com proteção de dados
   * Logger.configure({
   *   redact: ['password', 'cpf', 'user.email'],
   *   censor: '***',
   *   asyncMode: true
   * })
   */
  static configure(options: Record<string, any> = {}): void {
    // ✅ Configurações v1.x (compatibilidade)
    config.emojis = options.emojis ?? config.emojis;
    config.emojiSet = options.emojiSet ?? config.emojiSet;

    // ✅ Configurações v2.0 (novas funcionalidades)
    config.redact = options.redact ?? config.redact;
    config.censor = options.censor ?? config.censor;
    config.structuredMode = options.structuredMode ?? config.structuredMode;
    config.asyncMode = options.asyncMode ?? config.asyncMode;

    // 🛡️ Validações de configuração
    if (!EMOJI_SETS[config.emojiSet]) {
      console.warn(`[Logger] Invalid emoji set '${config.emojiSet}', falling back to 'default'`);
      config.emojiSet = 'default';
    }

    if (!Array.isArray(config.redact)) {
      console.warn('[Logger] config.redact must be an array, falling back to empty array');
      config.redact = [];
    }

    if (typeof config.censor !== 'string') {
      console.warn('[Logger] config.censor must be a string, falling back to "**PROTECTED**"');
      config.censor = '**PROTECTED**';
    }
  }

  /**
   * 📊 Retorna configuração atual (v2.0 expandido)
   *
   * @returns {Object} Configuração atual com todas as opções v2.0
   */
  static getConfig(): Record<string, any> {
    return { ...config };
  }

  /**
   * ⚙️ Configura quantidade máxima de erros recentes a manter
   *
   * @param {number} max - Quantidade máxima (padrão: 10)
   *
   * @example
   * Logger.setMaxRecentErrors(20) // Mantém 20 erros
   */
  static setMaxRecentErrors(max: number): void {
    this._maxRecentErrors = Math.max(1, max); // Mínimo 1
  }

  /**
   * 📋 Retorna ref reativo de erros recentes
   *
   * Usado pelo DebugPanel e outras ferramentas de debug.
   * Retorna o ref() diretamente para manter reatividade no Vue!
   *
   * @returns {Ref<Array>} Ref reativo do array de erros
   *
   * @example
   * const errors = Logger.getRecentErrors()
   * // No template: errors[0].message (Vue detecta mudanças automaticamente!)
   */
  static getRecentErrors() {
    return this._recentErrors; // Retorna ref direto (reativo!)
  }

  /**
   * 🗑️ Limpa lista de erros recentes
   *
   * @example
   * Logger.clearRecentErrors()
   */
  static clearRecentErrors(): void {
    this._recentErrors.value = [];
  }

  /**
   * 🎚️ Retorna nível de log efetivo para este logger
   *
   * Prioriza minLevel local se definido, senão usa global.
   * ERROR sempre passa (exceto SILENT explícito).
   */
  static getEffectiveLogLevel(): number {
    return this._minLevel ?? getLogLevel();
  }

  /**
   * 👶 Cria logger filho com herança de contexto (v2.0)
   *
   * Sistema hierárquico que permite criar loggers especializados
   * mantendo contexto do logger pai.
   *
   * @param {Object} [context={}] - Contexto adicional para o logger filho
   * @param {string} [context.minLevel] - Nível mínimo: 'DEBUG'|'INFO'|'WARN'|'ERROR'|'SILENT'
   * @returns {Logger} Nova instância de logger com contexto herdado
   *
   * @example
   * // Logger normal (herda nível global)
   * const appLogger = Logger.child({ app: 'MyApp' })
   *
   * // Logger só com erros (ignora info/debug mesmo em dev)
   * const quietLogger = Logger.child({ service: 'supabase', minLevel: 'ERROR' })
   */
  static child(context: Record<string, any> = {}): typeof Logger {
    // Extrai minLevel do contexto (não vai pro log)
    const { minLevel, ...cleanContext } = context;

    // Combina contexto do pai com novo contexto
    const parentContext = this._context || {};
    const childContext = { ...parentContext, ...cleanContext };

    // Cria nova instância que herda de Logger
    const childLogger = Object.create(Logger);
    childLogger._context = childContext;

    // Define nível mínimo se especificado
    if (minLevel && LOG_LEVELS[minLevel] !== undefined) {
      childLogger._minLevel = LOG_LEVELS[minLevel];
    } else {
      childLogger._minLevel = this._minLevel; // Herda do pai
    }

    return childLogger;
  }

  /**
   * 🎯 Cria helpers de domínio configuráveis (v2.0)
   *
   * Sistema genérico para criar helpers especializados por domínio,
   * substituindo o createComponentLogger limitado.
   *
   * @param {string} domain - Nome do domínio
   * @param {Object} helpers - Configuração dos helpers
   * @returns {Object} Objeto com helpers especializados
   *
   * @example
   * const userHelpers = Logger.createDomainHelpers('user', {
   *   login: { idField: 'userId', category: 'auth', level: 'info' },
   *   dataAccess: { idField: 'userId', category: 'privacy', level: 'warn' }
   * })
   *
   * userHelpers.login('user123', 'success', { ip: '192.168.1.1' })
   * userHelpers.dataAccess('user123', 'cpf_view')
   */
  static createDomainHelpers(domain, helpers = {}) {
    const domainLogger = this.child({ domain });
    const domainHelpers = {};

    Object.entries(helpers).forEach(([helperName, config]) => {
      domainHelpers[helperName] = (id, action, context = {}) => {
        const helperContext = {
          [config.idField || 'id']: id,
          action,
          category: config.category,
          ...context,
        };

        const message = config.message || `${action} executed`;
        const level = config.level || 'info';

        domainLogger[level](message, helperContext);
      };
    });

    return domainHelpers;
  }

  /**
   * 🐛 Log de debug - apenas em desenvolvimento (v2.0 aprimorado)
   *
   * Usa console.group para melhor organização visual e permite
   * clicar no arquivo/linha corretos (não Logger.ts).
   *
   * @param {string} message - Mensagem do log
   * @param {Object} [context={}] - Contexto adicional
   */
  static debug(message: string, context: Record<string, any> = {}): void {
    if (this.getEffectiveLogLevel() <= LOG_LEVELS.DEBUG) {
      const finalContext = { ...this._context, ...context };
      const { cleanContext } = extractBadge(finalContext);
      const caller = captureCallerInfo();

      if (config.asyncMode) {
        // Modo assíncrono: buffer simples (com badge de nível)
        const mainMsg = formatLogMessage('DEBUG', message, finalContext);
        logBuffer.push({ method: 'log', args: [mainMsg, cleanContext] });
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(flushLogs, 0);
      } else {
        // Modo síncrono: usar console.group para melhor organização
        const style = LOG_STYLES.DEBUG;
        const groupFn = style.collapsed ? console.groupCollapsed : console.group;
        // Usa formatMessageForGroup que JÁ vem sem [DEBUG]
        const msg = formatMessageForGroup(message, finalContext);
        groupFn.call(
          console,
          `%c${style.emoji} DEBUG%c ${msg}`,
          style.labelStyle,
          style.messageStyle
        );

        // Informações do caller (permite clicar para ir ao arquivo correto)
        console.log(
          `📍 Caller: ${caller.function}() at ${caller.file}:${caller.line}:${caller.column}`
        );
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

        // Contexto com console.table (mais legível)
        if (Object.keys(cleanContext).length > 0) {
          console.group('📋 Context:');
          console.table(cleanContext);
          console.groupEnd();
        }

        console.groupEnd();
      }
    }
  }

  /**
   * ℹ️ Log de informações importantes (v2.0 aprimorado)
   *
   * Usa console.group para melhor organização visual e permite
   * clicar no arquivo/linha corretos (não Logger.ts).
   *
   * @param {string} message - Mensagem do log
   * @param {Object} [context={}] - Dados adicionais
   */
  static info(message: string, context: Record<string, any> = {}): void {
    if (this.getEffectiveLogLevel() <= LOG_LEVELS.INFO) {
      const finalContext = { ...this._context, ...context };
      const { cleanContext } = extractBadge(finalContext);
      const caller = captureCallerInfo();

      if (config.asyncMode) {
        // Modo assíncrono: buffer simples (com badge de nível)
        const mainMsg = formatLogMessage('INFO', message, finalContext);
        logBuffer.push({ method: 'info', args: [mainMsg, cleanContext] });
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(flushLogs, 0);
      } else {
        // Modo síncrono: usar console.group para melhor organização
        const style = LOG_STYLES.INFO;
        const groupFn = style.collapsed ? console.groupCollapsed : console.group;
        // Usa formatMessageForGroup que JÁ vem sem [INFO]
        const msg = formatMessageForGroup(message, finalContext);
        groupFn.call(
          console,
          `%c${style.emoji} INFO%c ${msg}`,
          style.labelStyle,
          style.messageStyle
        );

        // Informações do caller (permite clicar para ir ao arquivo correto)
        console.log(
          `📍 Caller: ${caller.function}() at ${caller.file}:${caller.line}:${caller.column}`
        );
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

        // Contexto com console.table (mais legível)
        if (Object.keys(cleanContext).length > 0) {
          console.group('📋 Context:');
          console.table(cleanContext);
          console.groupEnd();
        }

        console.groupEnd();
      }
    }
  }

  /**
   * ⚠️ Log de avisos - problemas potenciais (v2.0 aprimorado)
   *
   * Usa console.group para melhor organização visual e permite
   * clicar no arquivo/linha corretos (não Logger.ts).
   *
   * @param {string} message - Mensagem de aviso
   * @param {Object} [context={}] - Contexto adicional
   */
  static warn(message: string, context: Record<string, any> = {}): void {
    if (this.getEffectiveLogLevel() <= LOG_LEVELS.WARN) {
      const finalContext = { ...this._context, ...context };
      const { cleanContext } = extractBadge(finalContext);
      const caller = captureCallerInfo();

      if (config.asyncMode) {
        // Modo assíncrono: buffer simples (com badge de nível)
        const mainMsg = formatLogMessage('WARN', message, finalContext);
        logBuffer.push({ method: 'warn', args: [mainMsg, cleanContext] });
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(flushLogs, 0);
      } else {
        // Modo síncrono: usar console.group para melhor organização
        const style = LOG_STYLES.WARN;
        const groupFn = style.collapsed ? console.groupCollapsed : console.group;
        // Usa formatMessageForGroup que JÁ vem sem [WARN]
        const msg = formatMessageForGroup(message, finalContext);
        groupFn.call(
          console,
          `%c${style.emoji} WARN%c ${msg}`,
          style.labelStyle,
          style.messageStyle
        );

        // Informações do caller (permite clicar para ir ao arquivo correto)
        console.log(
          `📍 Caller: ${caller.function}() at ${caller.file}:${caller.line}:${caller.column}`
        );
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

        // Contexto com console.table (mais legível)
        if (Object.keys(cleanContext).length > 0) {
          console.group('📋 Context:');
          console.table(cleanContext);
          console.groupEnd();
        }

        console.groupEnd();
      }
    }
  }

  /**
   * ❌ Log de erros da aplicação (v2.0 aprimorado)
   *
   * Usa console.group para melhor organização visual e permite
   * clicar no arquivo/linha corretos (não Logger.ts).
   * Preserva o stack trace original do erro passando ele direto ao console.error.
   * ERROR fica sempre EXPANDIDO (não collapsed) para chamar atenção!
   *
   * @param {string} message - Mensagem de erro
   * @param {Error|Object} [error=null] - Objeto de erro
   * @param {Object} [context={}] - Contexto adicional
   */
  static error(
    message: string,
    error: Error | null = null,
    context: Record<string, any> = {}
  ): void {
    if (this.getEffectiveLogLevel() <= LOG_LEVELS.ERROR) {
      const finalContext = { ...this._context, ...context };
      const { cleanContext } = extractBadge(finalContext);
      const caller = captureCallerInfo();

      // 📋 TRACKING: Adiciona erro ao histórico recente
      this._recentErrors.value.unshift({
        timestamp: dayjs().format('HH[h]mm[m]ss[s]'),
        message,
        error,
        context: cleanContext,
      });

      // Mantém apenas a quantidade configurada
      if (this._recentErrors.value.length > this._maxRecentErrors) {
        this._recentErrors.value.pop();
      }

      if (config.asyncMode) {
        // Modo assíncrono: buffer simples (com badge de nível)
        const mainMsg = formatLogMessage('ERROR', message, finalContext);
        logBuffer.push({
          method: 'error',
          args: error instanceof Error ? [mainMsg, error, cleanContext] : [mainMsg, cleanContext],
        });
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(flushLogs, 0);
      } else {
        // Modo síncrono: usar console.group para melhor organização
        // ⚠️ IMPORTANTE: ERROR usa console.group (não groupCollapsed) para ficar SEMPRE EXPANDIDO!
        const style = LOG_STYLES.ERROR;
        const groupFn = style.collapsed ? console.groupCollapsed : console.group;
        // Usa formatMessageForGroup que JÁ vem sem [ERROR]
        const msg = formatMessageForGroup(message, finalContext);
        groupFn.call(
          console,
          `%c${style.emoji} ERROR%c ${msg}`,
          style.labelStyle,
          style.messageStyle
        );

        // Informações do caller (permite clicar para ir ao arquivo correto)
        console.log(
          `📍 Caller: ${caller.function}() at ${caller.file}:${caller.line}:${caller.column}`
        );
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

        // Erro original (preserva stack clicável)
        // IMPORTANTE: passar erro direto ao console.error preserva stack trace navegável
        if (error) {
          console.group('🔴 Original Error:');
          console.error(error);
          console.groupEnd();
        }

        // Contexto com console.table (mais legível)
        if (Object.keys(cleanContext).length > 0) {
          console.group('📋 Context:');
          console.table(cleanContext);
          console.groupEnd();
        }

        console.groupEnd();
      }
    }
  }

  /**
   * 🎯 Cria logger específico para componente (v1.x compatível, usa child internamente)
   *
   * Mantido para compatibilidade com v1.x. Para funcionalidades avançadas,
   * use child() ou createDomainHelpers().
   *
   * @param {string} componentName - Nome do componente
   * @returns {Object} Logger com contexto do componente
   */
  static createComponentLogger(componentName) {
    // Usa o novo sistema child internamente para manter compatibilidade
    const componentLogger = this.child({ component: componentName });

    return {
      debug: (message, context = {}) => componentLogger.debug(message, context),

      info: (message, context = {}) => componentLogger.info(message, context),

      warn: (message, context = {}) => componentLogger.warn(message, context),

      error: (message, error = null, context = {}) =>
        componentLogger.error(message, error, context),
    };
  }

  /**
   * ⏱️ Utilitário para medir performance de operações (v2.0 aprimorado)
   *
   * Sistema de timing com redação automática de dados sensíveis e
   * suporte ao novo sistema de formatação.
   *
   * @param {string} operation - Nome da operação
   * @returns {Function} Função para finalizar timing
   *
   * @example
   * const endTiming = Logger.startTiming('userProcessing')
   *
   * // ... realizar operação pesada
   * await processUserData()
   *
   * endTiming({ recordsProcessed: 150, status: 'success' })
   * // Log: "Completed: userProcessing" com duração automática
   */
  static startTiming(operation) {
    const startTime = performance.now();
    const finalContext = { ...this._context };

    // Log de início usando novo sistema
    this.debug(`Started: ${operation}`, finalContext);

    return (context = {}) => {
      const duration = performance.now() - startTime;
      const timingContext = {
        ...finalContext,
        duration: `${duration.toFixed(2)}ms`,
        ...context,
      };

      // Log de conclusão usando novo sistema
      const output = formatOutput('INFO', `Completed: ${operation}`, timingContext, true);

      // 🎯 Remove badge do contexto antes de logar
      const { cleanContext } = extractBadge(timingContext);

      if (this.getEffectiveLogLevel() <= LOG_LEVELS.INFO) {
        if (config.asyncMode) {
          logBuffer.push({ method: 'info', args: [output, cleanContext] });
          if (bufferTimeout) clearTimeout(bufferTimeout);
          bufferTimeout = setTimeout(flushLogs, 0);
        } else {
          if (typeof output === 'object') {
            console.info(JSON.stringify(output));
          } else {
            console.info(output, cleanContext);
          }
        }
      }
    };
  }
}

/**
 * 🎯 Export padrão para conveniência
 */
export default Logger;

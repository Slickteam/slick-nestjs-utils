import { HttpException, HttpStatus, LogLevel, Logger } from '@nestjs/common';

function LoggerParams(level: LogLevel = 'verbose') {
  return (target: { constructor: { name: string } }, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original: (...args: unknown[]) => unknown = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      let message = `${propertyKey}(`;
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (Array.isArray(arg)) {
          message += `[${i}]=${arg.length}`;
        } else {
          message += `[${i}]=${String(arg)}`;
        }
        if (i < args.length - 1) {
          message += ',';
        }
      }
      message += ')';
      const className = target.constructor.name;
      switch (level) {
        case 'verbose':
          Logger.verbose(message, className);
          break;
        case 'debug':
          Logger.debug(message, className);
          break;
        case 'log':
          Logger.log(message, className);
          break;
        case 'warn':
          Logger.warn(message, className);
          break;
        default:
          Logger.error(message, className);
          break;
      }
      const value: unknown = original.apply(this, args);
      return value;
    };
  };
}

function throwErrorAndLog(message: any, typeError = HttpStatus.INTERNAL_SERVER_ERROR, logger: Logger | undefined): never {
  const error = new HttpException(message, typeError);
  if (logger) {
    logger?.error(message);
  } else {
    Logger.error(message);
  }
  throw error;
}

function throwErrorAndLogWithContext(message: any, typeError = HttpStatus.INTERNAL_SERVER_ERROR, context?: string): never {
  const error = new HttpException(message, typeError);
  Logger.error(message, context);
  throw error;
}

function logLevel(level: LogLevel): LogLevel[] {
  const levelTab: LogLevel[] = [];
  switch (level) {
    case 'verbose':
      levelTab.push('verbose');
    case 'debug':
      levelTab.push('debug');
    case 'log':
      levelTab.push('log');
    case 'warn':
      levelTab.push('warn');
    default:
      levelTab.push('error');
  }
  return levelTab;
}

export { LoggerParams, throwErrorAndLog, throwErrorAndLogWithContext, logLevel };

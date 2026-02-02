import { HttpException, HttpStatus, LogLevel, Logger } from '@nestjs/common';

interface LoggerParamsOptions {
  level?: LogLevel;
  paramNames?: string[];
}

function LoggerParams(options: LogLevel | LoggerParamsOptions = 'verbose') {
  const level = typeof options === 'string' ? options : options.level || 'verbose';
  const paramNames = typeof options === 'object' && options.paramNames ? options.paramNames : undefined;

  return (target: { constructor: { name: string } }, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original: (...args: unknown[]) => unknown = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      let message = `${propertyKey}(`;
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const paramName = paramNames && paramNames[i] ? paramNames[i] : `[${i}]`;

        if (Array.isArray(arg)) {
          message += `${paramName}=[Array(${arg.length})]`;
        } else if (arg === null) {
          message += `${paramName}=null`;
        } else if (arg === undefined) {
          message += `${paramName}=undefined`;
        } else if (typeof arg === 'object') {
          message += `${paramName}={...}`;
        } else if (typeof arg === 'string') {
          message += `${paramName}="${arg}"`;
        } else {
          message += `${paramName}=${String(arg)}`;
        }

        if (i < args.length - 1) {
          message += ', ';
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

import { InternalServerErrorException, LogLevel, Logger, NotFoundException } from '@nestjs/common';

enum ErrorEnum {
  INTERNAL_ERROR,
  NOT_FOUND,
}

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

function throwErrorAndLog(logger: Logger | undefined, message: any, typeError = ErrorEnum.INTERNAL_ERROR): never {
  let error;
  if (typeError === ErrorEnum.NOT_FOUND) {
    error = new NotFoundException(message);
  } else {
    error = new InternalServerErrorException(message);
  }
  logger?.error(message);
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

export { LoggerParams, ErrorEnum, throwErrorAndLog, logLevel };

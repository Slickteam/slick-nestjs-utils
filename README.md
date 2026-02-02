# Slick NestJS Utils

[![npm version](https://img.shields.io/npm/v/@slickteam/nestjs-utils.svg)](https://www.npmjs.com/package/@slickteam/nestjs-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Utility functions for NestJS applications, providing logging decorators and error handling helpers.

## Installation

```bash
npm install @slickteam/nestjs-utils
```

## API Reference

### LoggerParams

Method decorator that automatically logs function parameters when called.

```ts
import { LoggerParams } from '@slickteam/nestjs-utils';

class UserService {
  @LoggerParams() // Default: 'verbose' level
  findUser(id: string, options: object) {
    // Logs: "findUser([0]=123,[1]=[object Object])" at verbose level
  }

  @LoggerParams('debug')
  createUser(name: string) {
    // Logs: "createUser([0]=John)" at debug level
  }
}
```

**Parameters:**

- `level` (optional): Log level - `'verbose'` | `'debug'` | `'log'` | `'warn'` | `'error'`. Default: `'verbose'`

### throwErrorAndLog

Throws an `HttpException` and logs the error message.

```ts
import { HttpStatus, Logger } from '@nestjs/common';
import { throwErrorAndLog } from '@slickteam/nestjs-utils';

class UserService {
  private readonly logger = new Logger(UserService.name);

  findUser(id: string) {
    const user = this.repository.find(id);
    if (!user) {
      throwErrorAndLog('User not found', HttpStatus.NOT_FOUND, this.logger);
    }
    return user;
  }
}
```

**Parameters:**

- `message`: Error message to log and throw
- `typeError` (optional): HTTP status code. Default: `HttpStatus.INTERNAL_SERVER_ERROR`
- `logger` (optional): Logger instance. If not provided, uses the static `Logger`

### throwErrorAndLogWithContext

Throws an `HttpException` and logs the error message with a context string.

```ts
import { HttpStatus } from '@nestjs/common';
import { throwErrorAndLogWithContext } from '@slickteam/nestjs-utils';

function validateInput(data: unknown) {
  if (!data) {
    throwErrorAndLogWithContext('Invalid input', HttpStatus.BAD_REQUEST, 'ValidationService');
  }
}
```

**Parameters:**

- `message`: Error message to log and throw
- `typeError` (optional): HTTP status code. Default: `HttpStatus.INTERNAL_SERVER_ERROR`
- `context` (optional): Context string for the logger

### logLevel

Returns an array of log levels to enable, based on a minimum level (cascade).

```ts
import { logLevel } from '@slickteam/nestjs-utils';

// Returns ['debug', 'log', 'warn', 'error']
const levels = logLevel('debug');

// Usage with NestJS bootstrap
const app = await NestFactory.create(AppModule, {
  logger: logLevel('debug'),
});
```

**Parameters:**

- `level`: Minimum log level - `'verbose'` | `'debug'` | `'log'` | `'warn'` | `'error'`

**Returns:** Array of `LogLevel` including the specified level and all levels above it.

## Requirements

- Node.js >= 18
- NestJS >= 11

## License

[MIT](LICENSE)

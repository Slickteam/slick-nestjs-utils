# Slick Nestjs Utils

## Usage

- Install dependency

```bash
npm i -S @slickteam/nestjs-utils
```

- Exemple import

```ts
import { LoggerParams, throwErrorAndLog } from '@slickteam/nestjs-utils';

@LoggerParams()
function test() {
  throwErrorAndLog('Not implemented');
}
```

## Content

- Enum:
  - `ErrorEnum`
- Functions:
  - `LoggerParams`
  - `logLevel`
  - `throwErrorAndLog`

## Dependencies version

Nestjs

- `@nestjs/common`: `^10.4.4`

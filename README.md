# Slick Nestjs Utils

Available on npmjs.org : [@slickteam/nestjs-utils](https://www.npmjs.com/package/@slickteam/nestjs-utils)

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

- `@nestjs/common`: `^11.0.4`

import { LoggerParams } from '../src/index';

class TestService {
  @LoggerParams()
  methodWithoutParamNames(param1: string, param2: number) {
    return 'test';
  }

  @LoggerParams('debug')
  methodWithLevelOnly(param1: string) {
    return 'test';
  }

  @LoggerParams({
    level: 'debug',
    paramNames: ['userId', 'userData'],
  })
  methodWithParamNames(userId: string, userData: object) {
    return 'test';
  }

  @LoggerParams({
    paramNames: ['arrayParam', 'nullParam', 'undefinedParam', 'objectParam'],
  })
  methodWithSpecialValues(arrayParam: string[], nullParam: null, undefinedParam: undefined, objectParam: { key: string }) {
    return 'test';
  }
}

const service = new TestService();

console.log('Testing methodWithoutParamNames:');
service.methodWithoutParamNames('hello', 42);

console.log('\nTesting methodWithLevelOnly:');
service.methodWithLevelOnly('world');

console.log('\nTesting methodWithParamNames:');
service.methodWithParamNames('123', { name: 'John' });

console.log('\nTesting methodWithSpecialValues:');
service.methodWithSpecialValues(['a', 'b'], null, undefined, { key: 'value' });

import './__mock__';
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('../../src/util/downloadCSV', () => jest.fn());

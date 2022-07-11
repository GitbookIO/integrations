import { addEventListener } from './addEventListener';
import { console } from './console';
import { CookieJar } from './cookiejar';
import { fetch, TimeoutError } from './fetch';
import { FetchEvent } from './fetchevent';
import { FormData } from './formdata';
import { Headers } from './headers';
import { Request } from './request';
import { Response } from './response';
import {
    ReadableStream,
    WritableStream,
    ByteLengthQueuingStrategy,
    CountQueuingStrategy,
    TransformStream,
} from './streams';
import { TextEncoder, TextDecoder } from './text-encoding';
import { URL, URLSearchParams } from './url';
import { btoa, atob } from './base64';

global.console = console;
global.btoa = btoa;
global.atob = atob;

global.URL = URL;
global.URLSearchParams = URLSearchParams;

global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.CookieJar = CookieJar;
global.fetch = fetch;
global.TimeoutError = TimeoutError;
global.FetchEvent = FetchEvent;
global.FormData = FormData;

global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
global.CountQueuingStrategy = CountQueuingStrategy;
global.TransformStream = TransformStream;

// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

global.addEventListener2 = addEventListener;

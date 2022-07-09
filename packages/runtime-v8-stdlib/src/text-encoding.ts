import * as bridge from './bridge';

export class TextEncoder {
    public encode(input) {
        return bridge._encodeStringToBuffer(input);
    }
}

export class TextDecoder {
    public encoding: any;
    constructor(encoding) {
        this.encoding = encoding;
    }
    public decode(input) {
        return bridge._decodeBufferToString(input, this.encoding);
    }
}

export namespace ParserDecoder {
  export interface MultipartFormDataDecodedParts {
    name: string;
    filename: string;
    value: string;
    'Content-type': string;
  }
  export interface Headers {
    'User-Agent': string;
    Accept: string;
    'Cache-Control': string;
    'Postman-Token': string;
    Host: string;
    'Accept-Encoding': string;
    Connection: string;
    'Content-Type': string;
    'Content-Length': string;
  }
}

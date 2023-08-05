import { APIGatewayEvent } from 'aws-lambda';
import { ParserDecoder } from './types';
export class Parser {
  private contentType: string;
  private filename: string;
  private data: string;
  private headers: ParserDecoder.Headers;
  private event: APIGatewayEvent;
  constructor(event: APIGatewayEvent) {
    this.event = event;
    this.headers = event.headers as unknown as ParserDecoder.Headers;
    this.contentType = this.headers['Content-Type'];
  }
  private getBoundary(): string {
    return this.contentType.split(';')[1].split('=')[1];
  }
  private matchStringWithRegex(str: string, regex: RegExp): string | null {
    const matches = str.match(regex);
    if (!matches || matches.length < 2) {
      return null;
    }
    return matches[1];
  }
  public async parse(): Promise<ParserDecoder.MultipartFormDataDecodedParts> {
    const result: ParserDecoder.MultipartFormDataDecodedParts = {
      name: 'default',
      filename: 'default',
      value: '',
      'Content-type': 'multipart/form-data',
    };
    try {
      const rawDataArray = this.event.body.split(this.getBoundary());
      for (const item of rawDataArray) {
        let name = this.matchStringWithRegex(item, /(?:name=")(.+?)(?:")/);
        if (!name || !(name = name.trim())) {
          continue;
        }
        const value = this.matchStringWithRegex(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);
        if (!value) {
          continue;
        }
        let filename = this.matchStringWithRegex(item, /(?:filename=")(.*?)(?:")/);
        if (filename && (filename = filename.trim())) {
          result.name = name;
          result.value = value;
          result.filename = filename;
          let contentType = this.matchStringWithRegex(item, /(?:Content-Type:)(.*?)(?:\r\n)/);
          if (contentType && (contentType = contentType.trim())) {
            result['Content-Type'] = contentType;
          }
        } else {
          result.name = name;
          result.value = value;
          result['Content-Type'] = this.contentType;
        }
      }
      if (!result || result === undefined) {
        throw new Error('INTERNAL_ERROR_WHEN_ENCODING_MULTIPART_FORM_DATA');
      }
    } catch (e) {
      console.log('Error', e);
    } finally {
      this.contentType = result['Content-type'];
      this.filename = result.filename;
      this.data = result.value;
    }
    return result;
  }
}

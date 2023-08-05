import { matchStringWithRegex } from './helpers/stringMatcher';

export function main() {
  try {
    const contentType = headers['Content-Type'];
    const boundary = contentType.split(';')[1].split('=')[1];
    const result: ImageUploader.MultipartFormDataDecodedParts = {};
    const rawDataArray = event.body!.split(boundary);
    for (let item of rawDataArray) {
      let name = matchStringWithRegex(item, /(?:name=")(.+?)(?:")/);
      if (!name || !(name = name.trim())) continue;
      let value = matchStringWithRegex(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);
      if (!value) continue;
      let filename = matchStringWithRegex(item, /(?:filename=")(.*?)(?:")/);
      if (filename && (filename = filename.trim())) {
        result.name = name;
        result.value = value;
        result.filename = filename;
        let contentType = matchStringWithRegex(item, /(?:Content-Type:)(.*?)(?:\r\n)/);
        if (contentType && (contentType = contentType.trim())) {
          result['Content-Type'] = contentType;
        }
      } else {
        result.name = name;
        result.value = value;
        result['Content-Type'] = contentType;
      }
    }
    if (!result || result === undefined) {
      throw new Error('INTERNAL_ERROR_WHEN_ENCODING_MULTIPART_FORM_DATA');
    }
  } catch (e) {
    console.log('Error', e);
    jsonResponse.statusCode = 200;
    jsonResponse.body = JSON.stringify({
      message: (e as Error).message,
      signedUrl: '',
    });
  }
}

import { APIGatewayEvent } from 'aws-lambda';
import { Parser } from './helpers';
async function logic(event: APIGatewayEvent) {
  if (!event) {
    throw new Error('NO_EVENT_WAS_PASSED');
  }
  const newParser = new Parser(event);
  const response = await newParser.parse();
  if (!response) {
    throw new Error("PARSER_ERROR_COULDN'T_PARSE_EVENT");
  }
  return response;
}

export function main(event: APIGatewayEvent) {
  return logic(event);
}

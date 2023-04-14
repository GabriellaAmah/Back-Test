import { GraphQLError } from 'graphql';

class ErrorResponse extends Error {
  code: number
  constructor(code: number, message: string) {
    super()
    this.code = code;
    this.message = message
  }
}

export function produceError(code: number, message: string): ErrorResponse {
  throw new GraphQLError(message, {
    extensions: {
      code: code || 500,
    },
  });

}
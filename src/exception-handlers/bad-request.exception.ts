import { HttpException } from '@nestjs/common';

export class BadEntityException extends HttpException {
  constructor(error: any) {
    super(error.message, 400, { cause: error });
  }
}

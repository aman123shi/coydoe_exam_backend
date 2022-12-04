import { HttpException } from '@nestjs/common';
interface ResponseOptions {
  statusCode: number;
  body: any;
}
export const responseBuilder = (responseOptions: ResponseOptions) => {
  return {
    status: 'success',
    statusCode: responseOptions.statusCode,
    body: responseOptions.body,
  };
};

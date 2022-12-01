import { HttpException } from '@nestjs/common';
interface ResponseOptions {
  statusCode: number;
  body: any;
}
export const responseBuilder = (responseOptions: ResponseOptions) => {
  // if (responseOptions.statusCode >= 400) {
  //   throw new HttpException(
  //     {
  //       statusCode: responseOptions.statusCode,
  //       error: responseOptions.error.message,
  //     },
  //     responseOptions.statusCode,
  //     {
  //       cause: responseOptions.error,
  //     },
  //   );
  // }

  return {
    status: 'success',
    statusCode: responseOptions.statusCode,
    body: responseOptions.body,
  };
};

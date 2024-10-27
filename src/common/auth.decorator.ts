import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'] || '';

    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : authorization;

    if (token) {
      return token;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);

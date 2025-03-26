// pagination.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || undefined;
    const pageSize = parseInt(request.query.pageSize, 10) || undefined;
    return {
      page,
      pageSize,
    };
  },
);

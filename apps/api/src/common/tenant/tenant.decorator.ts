import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // In production with session auth, this comes from req.user.companyId or X-Company-Id verified against membership
    return request.headers['x-company-id'] || request.user?.companyId || 'company_default';
  },
);

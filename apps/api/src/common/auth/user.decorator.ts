import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@fairhire/shared';

export interface RequestUser {
  id: string;
  email: string;
  companyId: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser = request.user || {
      id: request.headers['x-user-id'] || 'usr_dev_admin',
      email: request.headers['x-user-email'] || 'admin@fairhire.local',
      companyId: request.headers['x-company-id'] || 'company_default',
      role: (request.headers['x-user-role'] as Role) || 'ADMIN',
    };

    return data ? user?.[data] : user;
  },
);

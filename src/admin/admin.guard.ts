import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_ONLY_KEY = 'admin_only';
export const AdminOnly = () => SetMetadata(IS_ADMIN_ONLY_KEY, true);

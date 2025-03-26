import { SetMetadata } from '@nestjs/common';

export const sameUserKey = 'SAME_USER_CHECK';
export const SameUserCheck = () => SetMetadata(sameUserKey, true);

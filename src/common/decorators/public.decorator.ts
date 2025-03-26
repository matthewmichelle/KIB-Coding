import { SetMetadata } from '@nestjs/common';

export const publicDecoratorKey = 'IS_PIBLIC';
export const Public = () => SetMetadata(publicDecoratorKey, true);

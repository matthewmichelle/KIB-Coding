import { SetMetadata } from '@nestjs/common';
import { sameUserKey } from './same-user.decorator';

export const BypassSameUserCheck = () => SetMetadata(sameUserKey, false);

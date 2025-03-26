import { IRefreshTokenPayload } from '../../common/interfaces/refresh-token-payload.interface';
import { IRefreshTokens } from '../../common/interfaces/tokens.interface';

export interface IJwtTokenService {
  generateTokens(
    user: ITransformedUserData,
    accessToken: string,
    refreshToken: string,
  ): IRefreshTokens;
  validateAndExtractRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}

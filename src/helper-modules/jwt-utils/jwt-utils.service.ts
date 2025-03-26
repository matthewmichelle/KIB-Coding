import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { BadRequestError } from '../../common/types/error-types.data';

interface IAccessTokenPayload {
  userInfo: ITransformedUserData; // Replace `any` with your specific user type if available
  token: string;
}

interface IRefreshTokenPayload {
  userInfo: ITransformedUserData; // Replace `any` with your specific user type if available
  refreshToken: string;
}

@Injectable()
export class JwtUtilsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  private generateJwtToken(payload: object, expiresIn: string) {
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.appConfigService.getJwtSecret(),
      issuer: this.appConfigService.getTokenIssuer(),
      audience: this.appConfigService.getTokenAudience(),
    });
  }

  generateJwtAccessToken(payload: IAccessTokenPayload) {
    const accessTokenExpiration =
      this.appConfigService.getJwtAccessExpiration();
    return this.generateJwtToken(
      {
        sub: {
          ...payload,
        },
      },
      accessTokenExpiration,
    );
  }

  generateJwtRefreshToken(payload: IRefreshTokenPayload) {
    const refreshTokenExpiration =
      this.appConfigService.getJwtRefreshExpiration(); // Assume you have this method
    return this.generateJwtToken(
      {
        sub: {
          user: payload.userInfo.id,
          refreshToken: payload.refreshToken,
        },
      },
      refreshTokenExpiration,
    );
  }

  extractPayloadFromToken(token: string) {
    return this.jwtService.decode(token);
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestError('Invalid token: ' + error.message);
    }
  }
}

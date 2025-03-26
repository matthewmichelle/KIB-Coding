// src/common/interfaces/tokens.interface.ts

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  expires_in: number;
}

export interface IRefreshTokens {
  accessToken: string;
  refreshToken: string;
}

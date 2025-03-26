// interfaces/hid-auth-response.interface.ts
export interface IHidAuthResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface ILoginHistory {
  status: string;
  date: string;
  expiryDate?: string;
  lastUnsuccessfulDate?: string;
  lastSuccessfulDate?: string;
}

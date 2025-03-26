import { ILoginHistory } from './login-history.interface';

export interface IUserStatistics {
  status: string;
  date: string;
  expiryDate: string;
}

export interface IUserLoginHistory {
  userId: number | null;
  loginHistory: ILoginHistory;
}

export const loginHistoryStatus = {
  success: 'SUCCESS',
  fail: 'FAIL',
};

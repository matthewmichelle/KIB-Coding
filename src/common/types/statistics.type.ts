export interface StatisticsMessage {
  cif: string;
  userId: string;
  body?: any;
  platform: string;
  microservice: string;
  status: string;
  type: string;
  subType: string;
  action: string;
  options?: any;
  beneficiaryName?: any;
  accountNumber?: string;
  country?: string;
  bank?: string;
  currency?: string;
  address?: string;
}

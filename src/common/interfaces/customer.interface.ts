export interface ICustomer {
  enableOpenUaeAcc?: boolean;
  Id: string;
  OldCifNo: string;
  ShortName: string;
  GivenName: string;
  FamilyName: string;
  ArabicName: string;
  MainSector: string;
  MainSectorDescription: string;
  Sector: string;
  SectorDescription: string;
  Nationality: string;
  LegalId: string;
  LegalDocName: string;
  LegalIssDate: string;
  LegalExpDate: string;
  OtherIds: string[]; // Assuming it's an array of strings
  BirthIncorpDate: number;
  Language: string;
  Company: string;
  Title: string;
  CustomerSince: number;
  Sms: string[];
  Email: string[];
  RelCode: string[]; // Assuming it's an array of strings
  Relation: string[]; // Assuming it's an array of strings
  RelCustomer: string[]; // Assuming it's an array of strings
  Signed: boolean;
  SignDate: number;
  Gender: 'MALE' | 'FEMALE'; // Restricting gender to specific values
  Address: string[];
  KYCDate: number;
  IssuingAuthority: string;
  LegalForm: string;
  ORR: string;
  Governorate: string;
  Branch: string;
  PostingRestrict: string;
  AccPurpose: string[]; // Array of purposes
  RiskIndicator: string;
  Occupation: string;
  OccupationDesc: string;
  isPayrollCompany: boolean;
  ResidentAddress: string[];
  LandmarkDetails: string;
  PostCode: string;
  Bancassurance: string;
  WealthMangement: string;
  DeliveryMechanism: string;
  AccountOfficier: string;
  AccountOfficierName: string;
  OtherOfficier: string[]; // Assuming it's an array of strings
  AcOfficier: string;
  CustomerStatus: string;
  eBankingService: boolean;
  HasSignature: boolean;
  country?: string;
}

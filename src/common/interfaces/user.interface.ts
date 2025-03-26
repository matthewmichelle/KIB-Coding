interface OtherCif {
  cif: string;
  country: string;
}

interface IUser {
  Id: string;
  Customer: string;
  country: string;
  CustomerName: string;
  StartDate: any; // You can also use Date if you want to convert this to a date object
  EndDate: any; // You can also use Date if you want to convert this to a date object
  SystemStatus: string;
  ChannelStatus: string;
  StatusDate: any; // You can also use Date if you want to convert this to a date object
  Signed: boolean; // Assuming "true" and "false" are represented as boolean
  RegistrationDate: any; // You can also use Date if you want to convert this to a date object
  UserType: string;
  MainCustomer: string;
  isDual: boolean;
  othercifs: OtherCif[]; // Array of OtherCif objects
}

interface ITransformedAllCif {
  cif: string;
  country: string;
  sector: string;
  isCorporate: boolean;
  mobileNumber: string;
  segment: string;
}

interface ITransformedUser {
  toknizedData: ITransformedUserData;
  data: ITransformedUserData;
}
interface ITransformedUserData {
  id: string;
  name?: string;
  cif?: string;
  registrationDate?: number;
  sector?: string;
  isCorporate?: boolean;
  startDate?: any;
  endDate?: any;
  isDual?: boolean;
  country?: string;
  EGSuspended?: boolean;
  allcifs?: ITransformedAllCif[];
  othercifs?: ITransformedAllCif[];
}

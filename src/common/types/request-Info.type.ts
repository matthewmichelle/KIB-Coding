import { StatisticsMessage } from './statistics.type';

export interface RequestInfo {
  topic?: string;
  replyTopic?: string;
  correlationId?: string;
  tracingHeader?: string;
  authorization?: string;
  apiRoute?: string;
  route?: string;
  apiMethod?: string;
  otp?: string;
  deviceId?: string;
  geolongitude?: string;
  geolatitude?: string;
  ip?: string;
  message?: string;
  date?: Date;
  updateValue?: StatisticsMessage;
  channel?: string;
  country?: string;
}

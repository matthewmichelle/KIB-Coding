import { ApiHeader } from '@nestjs/swagger';

// Enums for allowed values
export enum Language {
  EN = 'en',
  AR = 'ar',
  // Add more languages as needed
}

export enum Country {
  EG = 'EG',
  AE = 'AE',
  // Add more countries as needed
}

export enum AppType {
  RETAIL = 'retail',
  CORPORATE = 'corporate',
  // Add more app types as needed
}

// Centralized default values
const DEFAULTS = {
  language: Language.EN,
  country: Country.EG,
  appType: AppType.RETAIL,
  versionNumber: '1.0.0',
  deviceId: 'unknown-device',
  geolongitude: '0.0',
  geolatitude: '0.0',
  ip: '0.0.0.0',
  method: 'encryption',
  channel : 'INTERNET'
};

// Header Decorators
export const ApiAcceptLanguage = () =>
  ApiHeader({
    name: 'accept-language',
    description: 'Language from which the request is made',
    example: DEFAULTS.language,
    required: true,
    schema: {
      type: 'string',
      enum: Object.values(Language),
      default: DEFAULTS.language,
    },
  });

export const ApiCountry = () =>
  ApiHeader({
    name: 'country',
    description: 'Country from which the request is made',
    example: DEFAULTS.country,
    required: true,
    schema: {
      type: 'string',
      enum: Object.values(Country),
      default: DEFAULTS.country,
    },
  });

export const ApiAppType = () =>
  ApiHeader({
    name: 'apptype',
    description: 'App Type from which the request is made',
    example: DEFAULTS.appType,
    required: true,
    schema: {
      type: 'string',
      enum: Object.values(AppType),
      default: DEFAULTS.appType,
    },
  });

export const ApiAppVersionNumber = () =>
  ApiHeader({
    name: 'version-number',
    description: 'App Version from which the request is made',
    example: DEFAULTS.versionNumber,
    required: true,
    schema: {
      type: 'string',
      default: DEFAULTS.versionNumber,
    },
  });

export const ApiAppArea = () =>
  ApiHeader({
    name: 'area',
    description: 'Areas from which the request is made',
    example: 'global',
    required: false,
  });

export const ApiDeviceId = () =>
  ApiHeader({
    name: 'deviceId',
    description: 'Device ID from which the request is made',
    example: DEFAULTS.deviceId,
    required: false,
    schema: {
      type: 'string',
      default: DEFAULTS.deviceId,
    },
  });

export const ApiGeoLongitude = () =>
  ApiHeader({
    name: 'geolongitude',
    description: 'Geographical longitude from which the request is made',
    example: DEFAULTS.geolongitude,
    required: false,
    schema: {
      type: 'string',
      default: DEFAULTS.geolongitude,
    },
  });

export const ApiGeoLatitude = () =>
  ApiHeader({
    name: 'geolatitude',
    description: 'Geographical latitude from which the request is made',
    example: DEFAULTS.geolatitude,
    required: false,
    schema: {
      type: 'string',
      default: DEFAULTS.geolatitude,
    },
  });

export const ApiIp = () =>
  ApiHeader({
    name: 'ip',
    description: 'IP address from which the request is made',
    example: DEFAULTS.ip,
    required: false,
    schema: {
      type: 'string',
      default: DEFAULTS.ip,
    },
  });

export const ApiMethod = () =>
  ApiHeader({
    name: 'method',
    description: 'method address from which the request is made',
    example: DEFAULTS.method,
    required: false,
    schema: {
      type: 'string',
      example: DEFAULTS.method,
    },
  });

  export const ApiChannel = () =>
    ApiHeader({
      name: 'channel',
      description: 'channel address from which the request is made',
      example: DEFAULTS.channel,
      required: false,
      schema: {
        type: 'string',
        example: DEFAULTS.channel,
      },
    });

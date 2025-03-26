import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
} from '../types/error-types.data';

interface AxiosErrorResponse {
  message?: string;
  hid_error?: { code: string; error_description: string };
  hid_failure?: { reason: number };
  errorCode?: number;
  scimType?: string;
}

/**
 * Maps HID failure codes to corresponding HTTP exceptions.
 *
 * @param reason - The HID failure reason code.
 * @returns Corresponding NestJS HTTP exception.
 */
function mapHidFailureToException(reason: number): HttpException {
  switch (reason) {
    case 31:
      return new UnauthorizedError(
        'It is required to provide amount and currency for asynchronous EMV cap authentication of EMV cards with IAF=1',
      );
    case 12:
      return new BadRequestError(
        'The authentication code length does not match the requested authentication length of characters',
      );
    case 1:
      return new UnauthorizedError('The authenticator is disabled');
    case 0:
      return new UnauthorizedError('The authenticator could not be found');
    case 7:
      return new UnauthorizedError('The authenticator is not yet valid');
    case 22:
      return new UnauthorizedError('The challenge has expired');
    case 17:
      return new UnauthorizedError(
        'The challenge does not match that issued for the token',
      );
    case 30:
      return new UnauthorizedError(
        'It is required to provide challenge for asynchronous authentication',
      );
    case 4:
      return new ForbiddenError('There is a primary block for this channel');
    case 6:
      return new ForbiddenError(
        'There is a primary and secondary block for this channel',
      );
    case 5:
      return new ForbiddenError('There is a secondary block for this channel');
    case 20:
      return new UnauthorizedError('The device is not valid');
    case 33:
      return new InternalServerError(
        'The conversion of EMV SDB to EMV NVP format failed',
      );
    case 36:
      return new UnauthorizedError(
        'The credential type does not support asynchronous authentication',
      );
    case 35:
      return new UnauthorizedError(
        'The credential type does not support synchronous authentication',
      );
    case 40:
      return new UnauthorizedError('Unsupported LDAP authentication mode');
    case 34:
      return new UnauthorizedError(
        'Failed to provide the required PKI_CHALLENGE_SIGNATURE parameter for Asynchronous PKI Certificate authentication',
      );
    case 18:
      return new UnauthorizedError('An incorrect response was provided');
    case 26:
      return new BadRequestError(
        'The amount value for EMV cap verification is invalid',
      );
    case 27:
      return new BadRequestError(
        'The currency code for EMV cap verification is invalid',
      );
    case 32:
      return new BadRequestError(
        'The Cryptogram Version Number (CVN) for EMV card is invalid',
      );
    case 25:
      return new BadRequestError('The EMV card data is invalid');
    case 28:
      return new BadRequestError(
        'The Master Key Label for EMV card is invalid',
      );
    case 2:
      return new UnauthorizedError(
        'The successive failed authentication count reached the disable threshold',
      );
    case 3:
      return new UnauthorizedError(
        'The maximum number of usages has been reached',
      );
    case 29:
      return new UnauthorizedError('The maximum value of ATC is reached');
    case 9:
      return new UnauthorizedError('An MD answer does not match');
    case 14:
      return new UnauthorizedError('Insufficient MD answers were provided');
    case 23:
      return new UnauthorizedError('No valid credentials were found');
    case 19:
      return new UnauthorizedError(
        "The password's maximum usage has been reached",
      );
    case 13:
      return new UnauthorizedError('The password does not match');
    case 45:
      return new UnauthorizedError('The user is disabled');
    case 15:
      return new UnauthorizedError('The user was not found');
    case 24:
      return new UnauthorizedError('The software PIN was wrong');
    case -1:
      return new UnauthorizedError('The value is not defined (available)');
    case 46:
      return new UnauthorizedError('The Activation Code has expired');
    case 47:
      return new UnauthorizedError(
        'The Activation Code has reached its threshold',
      );
    case 54:
      return new InternalServerError('The score has not been retrieved');
    case 55:
      return new UnauthorizedError(
        'The authentication code is not allowed by configuration',
      );
    case 49:
      return new UnauthorizedError('The challenge has not been found');
    case 59:
      return new UnauthorizedError('The check before action failed');
    case 48:
      return new UnauthorizedError('The user already has an open session');
    case 50:
      return new InternalServerError('The OOB secret generation has failed');
    case 58:
      return new InternalServerError('Specific RMS parameters are missing');
    case 41:
      return new UnauthorizedError('The OTP matched');
    case 42:
      return new UnauthorizedError('The OTP did not match');
    case 43:
      return new UnauthorizedError('The PIN matched');
    case 44:
      return new UnauthorizedError('The PIN did not match');
    case 56:
      return new UnauthorizedError(
        'For the second step authentication, no session transfer has been found',
      );
    case 57:
      return new UnauthorizedError(
        'The second step authentication user does not match',
      );
    case 53:
      return new UnauthorizedError('The block threshold has been reached');
    case 52:
      return new UnauthorizedError('The reject threshold has been reached');
    case 51:
      return new UnauthorizedError('The step-up threshold has been reached');
    case 39:
      return new UnauthorizedError(
        'Hashed password authentication is unsuccessful',
      );
    default:
      return new UnauthorizedError(
        'Unauthorized: The HID failure reason is unrecognized',
      );
  }
}

/**
 * Maps Axios errors to NestJS HTTP exceptions.
 *
 * @param error - The Axios error to map.
 * @returns Corresponding NestJS HTTP exception.
 */
export function mapAxiosErrorToHttpException(error: AxiosError): HttpException {
  if (error.response) {
    const { status, data }: any = error.response;

    // Cast data to AxiosErrorResponse to safely access the message property
    const errorData = data as AxiosErrorResponse;

    // Check for specific hid_failure reasons
    if (data.hid_failure) {
      return mapHidFailureToException(data.hid_failure.reason);
    }

    // Additional conditions based on errorCode or scimType
    if (data.errorCode === 0 || data.scimType === 'invalidValue') {
      return new UnauthorizedError('Unauthorized');
    }

    // Extract custom error message if available
    const customMessage = errorData.message || 'An unexpected error occurred';

    // Map status codes to appropriate custom exceptions
    switch (status) {
      case 400:
        return new BadRequestError(customMessage);
      case 401:
        return new UnauthorizedError(customMessage);
      case 403:
        return new ForbiddenError(customMessage);
      case 404:
        return new NotFoundError(customMessage);
      case 500:
        return new InternalServerError(customMessage);
      default:
        return new InternalServerError(customMessage);
    }
  }

  // Handle network errors (no response)
  if (error.request) {
    return new ServiceUnavailableError(
      'Network error: No response from server',
    );
  }

  // Handle other Axios errors
  return new InternalServerError(`Error setting up request: ${error.message}`);
}

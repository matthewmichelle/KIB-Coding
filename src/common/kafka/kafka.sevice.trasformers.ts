import {
  InternalServerError,
  NotFoundError,
  BadRequestError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '../types/error-types.data';
import _ from 'lodash';

export class KafkaTransformersService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public transformersDataObject(data: any): any {
    // Check if there is an error field
    if (data.error) {
      const message = data.message.toString(); // 'Request failed with status code 503'

      // Extract the status code from the message
      const match = message.match(/status code (\d+)/);
      const statusCode = match ? parseInt(match[1], 10) : 500; // Default to 500 if parsing fails

      switch (statusCode) {
        case 401: // Bad Request
          throw new UnauthorizedError(message || 'Unauthorized request');
        case 400: // Bad Request
          throw new BadRequestError(message || 'Bad request');
        case 404: // Not Found
          throw new NotFoundError(message || 'Not found');
        case 503: // Service Unavailable
          throw new ServiceUnavailableError(message || 'Service unavailable');
        case 500: // Internal Server Error
        default:
          throw new InternalServerError(message || 'Internal server error');
      }
    } else {
      return data.Data || data.data;
    }
  }

  public TransformersAuthObject(data: any): boolean {
    return !data.error;
  }
}

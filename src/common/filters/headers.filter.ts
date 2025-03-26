import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class HeaderValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Extract headers
    const acceptLanguage = request.headers['accept-language'];
    const country = request.headers['country'];

    // Define allowed values
    const allowedLanguages = ['ar', 'en'];
    const allowedCountries = ['EG', 'AE'];

    // Validate accept-language header
    if (!acceptLanguage || !allowedLanguages.includes(acceptLanguage)) {
      throw new HttpException(
        'Invalid or missing accept-language header. Allowed values: ar, en',
        HttpStatus.FORBIDDEN,
      );
    }

    // Validate country header
    if (!country || !allowedCountries.includes(country)) {
      throw new HttpException(
        'Invalid or missing country header. Allowed values: EG, AE',
        HttpStatus.FORBIDDEN,
      );
    }

    // If validation passes, allow the request to proceed
    return true;
  }
}

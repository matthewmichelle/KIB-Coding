import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class HeaderPipe implements PipeTransform {
  /**
   * Transforms the LoginByPasswordDto by adding values from the request headers.
   * @param value The LoginByPasswordDto to transform.
   * @param metadata The metadata for the argument being transformed.
   * @returns The transformed LoginByPasswordDto.
   */
  transform(value: any, metadata: ArgumentMetadata) {
    const headers = metadata['headers'] || {};

    // Set country, accept-language, appType, and version-number from headers
    value.country = headers['country'] || 'EG'; // Default to 'EG' if not provided
    value['acceptLanguage'] = headers['accept-language'] || 'en'; // Default to 'en-US'
    value['appType'] = headers['apptype'] || 'retail'; // Default to 'web'
    value['versionNumber'] = headers['version-number'] || '1.0.0'; // Default to '1.0.0'

    return value;
  }
}

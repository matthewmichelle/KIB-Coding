import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '../utils/request-context.util';

@Injectable()
export class CustomHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract the client IP from the X-Forwarded-For header or the remoteAddress
    const xForwardedFor = req.headers['ip'] as string;
    const clientIp = xForwardedFor
      ? xForwardedFor.split(',')[0]
      : req.connection.remoteAddress;

    // Set or update custom headers
    req.headers['ip'] = clientIp; // Set the X-Forwarded-For header
    // Set default values for additional headers
    req.headers['deviceid'] = req.headers['deviceid'] || 'not-set'; // Default deviceId
    req.headers['geolongitude'] = req.headers['geolongitude'] || 'not-set'; // Default longitude
    req.headers['geolatitude'] = req.headers['geolatitude'] || 'not-set'; // Default latitude
    req.headers['country'] = req.headers['country'] || 'EG'; // Default channel
    req.headers['accept-language'] = req.headers['accept-language'] || 'en'; // Default channel
    req.headers['version-number'] = req.headers['version-number'] || '1.0.0'; // Default channel
    req.headers['authorization'] = req.headers['authorization'] || 'not-set'; // Set the Authorization header

    // Proceed to the next middleware or route handler
    // Store the request headers in a context object
    RequestContext.setRequest(req);

    next();
  }
}

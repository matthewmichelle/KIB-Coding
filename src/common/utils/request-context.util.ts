import { Request } from 'express';
import * as _ from 'lodash';

class RequestContext {
  private static request: Request;

  static setRequest(req: Request) {
    this.request = req;
  }

  static getRequest(): Request {
    return this.request;
  }

  static getHeaders() {
    return this.request?.headers;
  }

  static getHeaderValue(headers: any, headerName: string): string | undefined {
    const header = headers[headerName];
    return _.isArray(header) ? header[0] : header;
  }

  // Function to get the effective channel
  static getEffectiveChannel(
    headers: any,
    channel?: string,
  ): string | undefined {
    return channel || this.getHeaderValue(headers, 'channel');
  }
}

export { RequestContext };

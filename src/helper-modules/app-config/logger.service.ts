import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class PlainLoggerService implements LoggerService {
  log(message: string) {
    console.log(message); // Plain text log without color
  }

  error(message: string, trace: string) {
    console.error(message, trace);
  }

  warn(message: string) {
    console.warn(message);
  }

  debug(message: string) {
    console.debug(message);
  }

  verbose(message: string) {
    console.log(message); // or a different verbosity level
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class SerializationInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Transform and sanitize the data here
        return this.serialize(data);
      }),
    );
  }

  private serialize(data: T): any {
    // Perform serialization logic here
    // For example, convert objects to DTOs, remove sensitive information, etc.
    return {
      message: 'Success',
      data,
    };
  }
}

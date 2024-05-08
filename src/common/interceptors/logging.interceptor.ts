import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const name_controller = context.getClass().name;
    const name_handler = context.getHandler().name;
    const user_agent = req.get('user-agent') || '';
    const { ip, method, path: url } = req;

    this.logger.log(`Request: 
      ${method} ${url} ${user_agent} ${ip}: 
      ${name_controller} - ${name_handler}
    `);

    return next.handle().pipe(
      tap((res) => {
        this.logger.log('Response: ', JSON.stringify(res));
      }),
    );
  }
}

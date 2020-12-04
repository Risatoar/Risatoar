import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './interceptor/http-exception.filter';
import { AnyExceptionFilter } from './interceptor/any-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // http异常拦截 包装响应格式
  app.useGlobalFilters(new HttpExceptionFilter());
  // 异常拦截 包装响应格式
  app.useGlobalFilters(new AnyExceptionFilter());
  // 响应拦截 包装格式
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
}
bootstrap();

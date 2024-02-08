import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exceptions.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices'
import { AmqpQueues, RoomsMSG } from './common/constants/rabbitmq';
 
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ, 
    options: {
      urls: [process.env.RABBITMQ_URL], 
      queue: AmqpQueues.roomsQueue
    }
  });
  app.useGlobalFilters(new HttpExceptionFilter);
  app.useGlobalInterceptors(new TimeoutInterceptor);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();

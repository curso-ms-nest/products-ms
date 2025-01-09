import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Main');
  
  // const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes( 
  //   new ValidationPipe({ 
  //   whitelist: true, 
  //   forbidNonWhitelisted: true, 
  //   }) 
  //  );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        port: envs.port
      }
    }
  );
  app.useGlobalPipes( 
    new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    }) 
  );

  await app.listen();
  logger.log(`Microservicio corriendo en el puerto: ${envs.port}`)
}
bootstrap();

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  // -- Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  // -- Swagger
  const config = new DocumentBuilder()
    .setTitle('Clothes API Store')
    .setDescription("Store focus on women's clothes")
    .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'Bearer' })
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // -- CORS
  app.enableCors({
    origin: true,
  });

  // -- Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(Number(process.env.APP_PORT), () => {
    console.info(`Listening on port $process.env.APP_PORT}`);
  });
}
bootstrap();

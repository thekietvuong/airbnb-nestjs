import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Airbnb APIs')
    .setDescription("CyberSoft Capstone project by Vuong The Kiet")
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Comment')
    .addTag('BookRoom')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(5000);
}
bootstrap();

//https://www.youtube.com/watch?v=c_-b_isI4vg
//bnb
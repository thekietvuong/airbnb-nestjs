import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { BookRoomModule } from './book-room/book-room.module';
import { RoomModule } from './room/room.module';
import { LocationController } from './location/location.controller';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    CommentModule,
    BookRoomModule,
    RoomModule,
    LocationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

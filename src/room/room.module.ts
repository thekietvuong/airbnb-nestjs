import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/location/entities/location.entity';
import { Room } from './entities/room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Location]),
    ConfigModule
  ],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}

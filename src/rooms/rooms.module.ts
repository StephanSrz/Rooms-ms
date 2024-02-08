import { Module } from '@nestjs/common';
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { RoomRepository } from './rooms.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ROOMS } from 'src/common/models/room.model';
import { RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ROOMS.name, 
      schema: RoomSchema
    }])
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository]
})
export class RoomsModule {}

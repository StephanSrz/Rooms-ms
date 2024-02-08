import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose';
import RoomEntity from './entity/room.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ROOMS } from 'src/common/models/room.model';
import { IRooms } from 'src/common/interfaces/rooms.interface';

@Injectable()
export class RoomRepository {
  constructor(@InjectModel(ROOMS.name) private roomModel: Model<IRooms>){}

  // private methods
  

  // database relation methods

  async findRooms(): Promise<IRooms[]>{
    return await this.roomModel.find();
  }

  async saveRoom(roomEntity: RoomEntity): Promise<IRooms>{
    let newRoom = new this.roomModel(roomEntity);
    return await newRoom.save();
  }

  async findRoomById(id: String){
    return await this.roomModel.findById(id);
  }

  async updateRoom(id: String, roomentity: RoomEntity): Promise<IRooms>{
    return this.roomModel.findByIdAndUpdate(id, roomentity, { new: true });
  }

  async deleteRoom(id: String): Promise<boolean | null>{
    const roomDeleted = await this.roomModel.findByIdAndDelete(id);
    if(!roomDeleted){
      return null;
    }
    return true;
  }

  // * users in room
  async findUserInRoom(roomId: string){
    try {
      return await this.roomModel.findOne( { _id: roomId }, { _id: 0, users: 1 } );
    } catch (error) {}
  }

  async addUserToRoom(roomId: string, userId: string){
    return await this.roomModel.updateOne({ _id: roomId }, { $push: {users: userId} })
  }

  async removeUserInRoom(roomId: string, userId: string){
    return await this.roomModel.updateOne({ _id: roomId }, { $pull: {users: userId}});
  }
  
}

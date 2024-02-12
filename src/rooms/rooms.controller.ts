import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomDTO } from "./dto/room.dto";
import RoomEntity from "./entity/room.entity";
import { Response } from "express";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RoomsMSG, UserInRoomMSG } from "src/common/constants/rabbitmq";

@Controller()
export class RoomsController{
  constructor(private readonly roomsService: RoomsService){}

  @MessagePattern(RoomsMSG.FIND_ALL)
  async getRooms(@Res() res: Response){
    let rooms = await this.roomsService.findRooms(); 
    if(!rooms) return {message: "There are not rooms"}
    return rooms
  }

  @MessagePattern(RoomsMSG.CREATE)
  saveRooms(@Payload() roomDTO: RoomDTO){
    let roomEntity = new RoomEntity(roomDTO);
    return this.roomsService.saveRoom(roomEntity);
  }

  @MessagePattern(RoomsMSG.FIND_ONE)
  async getRoomById(@Payload() id: String){
    let roomResult = await this.roomsService.findRoomById(id);
    if(!roomResult){
      return { message: `Room with id ${id} Not found` };
    }
    return roomResult;
  }

  @MessagePattern(RoomsMSG.UPDATE)
  async updateRoom(@Payload() payload){
    const roomEntity = new RoomEntity(payload.roomDto);
    const roomUpdated = await this.roomsService.updateRoom(payload.id, roomEntity);
    if(!roomUpdated){
      return { message: `Room with id ${payload.id} Not found` };
    }
    return roomUpdated;
  }
  
  @MessagePattern(RoomsMSG.DELETE)
  async deleteRoom(@Payload() id: String){
    const roomDeleted = await this.roomsService.deleteRoom(id);
    if(!roomDeleted){
      return { message: `Room with id ${id} Not found` };
    }
    return { message: 'Room Deleted' };
  }

  // * User In Room Controller
  @MessagePattern(UserInRoomMSG.FIND_ALL)
  async getUsersInRoom(@Payload() roomID: string){
    try{
      let users = await this.roomsService.findUsersInRoom(roomID);
      if(users == null){
        return { message: 'There are not users in room'};
      }
      return users;
    } catch(error) {
      return { message: 'error: ', err: error.toString()}
    }
  }

  @MessagePattern(UserInRoomMSG.ADD)
  async addUserToRoom(@Payload() payload){
    const userAdded = await this.roomsService.addUserToRoom(payload.roomID, payload.userID);
    if(!userAdded){
      return { message: `User with id: ${payload.userID} is already included in room` };
    }
    return userAdded;
  }

  @MessagePattern(UserInRoomMSG.REMOVE)
  async removeUserInRoom(@Payload() payload){
    let userRemoved = await this.roomsService.removeUserInRoom(payload.roomID, payload.userID);
    if(!userRemoved){
      return { message: `User with id: ${payload.userID} is not included in room` };
    } 
    return { message: 'User Removed' };
  }


}

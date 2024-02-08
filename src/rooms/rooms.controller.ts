import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomDTO } from "./dto/room.dto";
import RoomEntity from "./entity/room.entity";
import { Response } from "express";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RoomsMSG } from "src/common/constants/rabbitmq";

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
  async getRoomById(@Payload() id: String, @Res() res: Response){
    let roomResult = await this.roomsService.findRoomById(id);
    if(!roomResult){
      return res.status(404).json({ message: `Room with id ${id} Not found` });
    }
    return res.status(200).json(roomResult);
  }

  @MessagePattern(RoomsMSG.UPDATE)
  async updateRoom(@Payload() payload, @Res() res: Response){
    const roomEntity = new RoomEntity(payload.roomDTO);
    const roomUpdated = await this.roomsService.updateRoom(payload.id, roomEntity);
    if(!roomUpdated){
      return res.status(404).json({ message: `Room with id ${payload.id} Not found` });
    }
    return res.status(202).json(roomUpdated);
  }
  
  @MessagePattern(RoomsMSG.DELETE)
  async deleteRoom(@Payload() id: String, @Res() res: Response){
    const roomDeleted = await this.roomsService.deleteRoom(id);
    if(!roomDeleted){
      return res.status(404).json({ message: `Room with id ${id} Not found` });
    }
    return res.status(200).json({ message: 'Room Deleted' });
  }

  // * User In Room Controller
  @Get(':id/users-room')
  async getUsersInRoom(@Param('id') roomId: string, @Res() res: Response){
    let users = await this.roomsService.findUsersInRoom(roomId);
    if(!users){
      return res.status(202).json({ message: 'There are not users in room'});
    }
    return res.status(202).json( users );
  }

  @Post(':id/add-user')
  async addUserToRoom(@Param('id') roomId: string, @Body('userId') userId: string, @Res() res: Response){
    const userAdded = await this.roomsService.addUserToRoom(roomId, userId);
    if(!userAdded){
      return res.status(404).json({ message: `User with id: ${userId} is already included in room` });
    }
    return res.status(202).json(userAdded);
  }

  @Put(':id/remove-user')
  async removeUserInRoom(@Param('id') roomId: string, @Body('userId') userId: string, @Res() res: Response){
    let userRemoved = await this.roomsService.removeUserInRoom(roomId, userId);
    if(!userRemoved){
      return res.status(404).json({ message: `User with id: ${userId} is not included in room` });
    }
    return res.status(202).json({ message: 'User Removed' });
  }


}

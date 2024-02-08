import { Injectable } from "@nestjs/common";
import RoomEntity from "./entity/room.entity";
import { RoomRepository } from "./rooms.repository";
import { IRooms } from "src/common/interfaces/rooms.interface";
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepository: RoomRepository){}

  async findRooms(): Promise<IRooms[] | null>{
    let rooms = await this.roomRepository.findRooms();
    if(rooms.length == 0){
      return null
    } 
    return rooms
  }

  private generateUniqueCode() {
    const uuid = uuidv4();
    const code = uuid.substring(0, 6).toUpperCase();
    return code;
  }

  private usersIdUtils(usersIdObj){
    let usersId: String[] = usersIdObj.map(userId=> userId.toString())
    return usersId
  }
  // Db Interacction

  async saveRoom(roomEntity: RoomEntity){
    roomEntity.roomCode = this.generateUniqueCode();
    return await this.roomRepository.saveRoom(roomEntity)
  }

  async findRoomById(id: String){
    return await this.roomRepository.findRoomById(id);
  }

  async updateRoom(id: String, roomEntity: RoomEntity): Promise<IRooms | boolean>{
    return await this.roomRepository.updateRoom(id, roomEntity);
  }

  async deleteRoom(id): Promise<boolean>{
    const roomDeleted = await this.roomRepository.deleteRoom(id);
    if(!roomDeleted){
      return false;
    }
    return true; 
  }

  // * Add user to room services
  async findUsersInRoom(id: string): Promise<String[] | null>{
    let usersIdObj = await this.roomRepository.findUserInRoom(id);
    if(!usersIdObj.users.length){
      return null 
    }
    let usersId = this.usersIdUtils(usersIdObj.users);
    return usersId;
  }

  async addUserToRoom(roomId: string, userId: string){
    let userInRoom = await this.findUsersInRoom(roomId);
    if(userInRoom != null){
      if(userInRoom.includes(userId)) return false;
    }
    
    return await this.roomRepository.addUserToRoom(roomId, userId);
  }

  async removeUserInRoom(roomId: string, userId: string){
    let userInRoom = await this.findUsersInRoom(roomId);
    if(!userInRoom.includes(userId)){
      return false;
    }
    return await this.roomRepository.removeUserInRoom(roomId, userId);
  }

}

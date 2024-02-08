export enum AmqpQueues {
  roomsQueue = "rooms"
}

export enum RoomsMSG {
  CREATE = "CREATE_ROOM",
  FIND_ALL = "FIND_ROOMS",
  FIND_ONE = "FIND_ROOM",
  UPDATE = "UPDATE_ROOM",
  DELETE = "DELETE_ROOM",
  VALIDATE = "VALID_ROOM" 
}

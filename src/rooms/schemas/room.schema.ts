import * as mongoose from "mongoose";

export const RoomSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: {type: String, default: null},
    roomCode: {type: String},
    maxNumUsers: {type: String, default: null},
    createdBy: {
      type: String
    },
    users: [{
      type: String
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'users'
    }]
  },{ timestamps: true }
  );
RoomSchema.index({ roomCode: 1 });

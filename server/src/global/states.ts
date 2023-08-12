import { Room, GuestUser } from "../types/socket-types";
import { Consumer, Producer, Transport } from "mediasoup/node/lib/types";

//TODO replace with map

const rooms: Map<string, Room> = new Map();
const producers: Map<string, Producer> = new Map();
const transports: Map<string, Transport> = new Map();
const consumers: Map<string, Consumer> = new Map();

// ROOM FUNCTIONS
const isUserAlreadyInRoom = (members: GuestUser[], socketId: string) => {
  const member = members.find((mem) => mem.socketId === socketId);
  return member;
};

const getRoom = (roomId: string) => {
  return rooms.get(roomId);
};

const addRoom = (data: Room) => {
  if (!getRoom(data.id)) {
    rooms.set(data.id, data);
  }
};

const addMemberToRoom = (roomId: string, user: GuestUser) => {
  const room = getRoom(roomId);
  // TODO
  // if user exist change socket id and actual id in collection
  if (room) {
    const isUserInRoom = isUserAlreadyInRoom(room.members, user.socketId);

    if (!isUserInRoom) {
      const room = getRoom(roomId);
      room?.members.push(user);
    }
  }
};

const removeMemberFromRoom = (roomId: string, userSocketId: string) => {
  const room = getRoom(roomId);
  if (room) {
    room.members = room.members.filter((mem) => mem.socketId !== userSocketId);
  }
};

const getRoomMembers = (roomId: string) => {
  const room = getRoom(roomId);
  if (!room) return console.error("no room found");
  return room.members;
};

// PRODUCERS FUNCTIONS
export {
  consumers,
  producers,
  rooms,
  transports,
  getRoom,
  getRoomMembers,
  removeMemberFromRoom,
  addMemberToRoom,
  addRoom,
};

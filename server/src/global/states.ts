import { Room, GuestUser } from "../types/socket-types";
import { Producer, Transport } from "mediasoup/node/lib/types";

//TODO replace with map
const rooms: { [roomName: string]: Room } = {};
const producers: Map<string, Producer> = new Map();
const transports: Map<string, Transport> = new Map();

// ROOM FUNCTIONS
const isUserAlreadyInRoom = (members: GuestUser[], socketId: string) => {
  const member = members.find((mem) => mem.socketId === socketId);
  return member;
};

export const getRoom = (roomId: string) => {
  return rooms[roomId];
};

export const addRoom = (data: Room) => {
  if (!getRoom(data.id)) {
    rooms[data.id] = data;
  }
};

export const addMemberToRoom = (roomId: string, user: GuestUser) => {
  const room = getRoom(roomId);
  // TODO
  // if user exist change socket id and actual id in collection
  if (room) {
    const isUserInRoom = isUserAlreadyInRoom(room.members, user.socketId);

    if (!isUserInRoom) {
      rooms[roomId].members.push(user);
    }
  }
};

export const removeMemberFromRoom = (roomId: string, userSocketId: string) => {
  if (getRoom(roomId)) {
    rooms[roomId].members = rooms[roomId]?.members.filter(
      (mem) => mem.socketId !== userSocketId
    );
  }
};

export const getRoomMembers = (roomId: string) => {
  const room = getRoom(roomId);
  return room.members;
};

// PRODUCERS FUNCTIONS

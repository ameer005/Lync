import { Room, GuestUser } from "../types/socket-types";

const rooms: { [roomName: string]: Room } = {};

export const getRoom = (roomId: string) => {
  return rooms[roomId];
};

export const addRoom = (data: Room) => {
  if (!getRoom(data.id)) {
    rooms[data.id] = data;
  }
};

export const addUserToRoom = (roomId: string, user: GuestUser) => {
  if (!getRoom(roomId)) {
    rooms[roomId].members.push(user);
  }
};

export const getRoomMembers = (roomId: string) => {
  const room = getRoom(roomId);
  return room.members;
};

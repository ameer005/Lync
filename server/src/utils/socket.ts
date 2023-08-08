import { Room, GuestUser } from "../types/socket-types";

const rooms: { [roomName: string]: Room } = {};

//helpers
const isUserAlreadyInRoom = (members: GuestUser[], socketId: string) => {
  const member = members.find((mem) => mem.socketId === socketId);

  return member;
};

//main functions
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
  if (room) {
    const isUserInRoom = isUserAlreadyInRoom(room.members, user.socketId);

    if (!isUserInRoom) {
      rooms[roomId].members.push(user);
    }
  }
};

export const getRoomMembers = (roomId: string) => {
  const room = getRoom(roomId);
  return room.members;
};

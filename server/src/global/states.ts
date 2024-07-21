import Peer from "../lib/socket/Peer";
import Room from "../lib/socket/Room";

const rooms: Map<string, Room> = new Map();

const roomAlreadyExist = (roomId: string) => {
  return rooms.has(roomId);
};

const addRoom = (room: Room) => {
  rooms.set(room.roomId, room);
};

const getRoom = (roomId: string) => {
  return rooms.get(roomId);
};

const addPeerToRoom = (roomId: string, peer: Peer) => {
  rooms.get(roomId)?.addPeer(peer);
};

const deleteRoom = (roomId: string) => {
  rooms.delete(roomId);
};

// PRODUCERS FUNCTIONS
export { roomAlreadyExist, addRoom, addPeerToRoom, getRoom, deleteRoom };

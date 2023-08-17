import { Socket } from "socket.io-client";

export const asyncSocket = <T>(
  socket: Socket,
  event: SocketEvents,
  ...rest: any
): Promise<T> => {
  return new Promise((resolve, reject) => {
    socket.emit(event, ...rest, (res: SocketResponse<T>) => {
      if (res.status === "success") {
        resolve(res.data);
      } else {
        reject(res.message);
      }
    });
  });
};

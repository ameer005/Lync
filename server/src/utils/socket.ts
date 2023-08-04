interface UserDocument {
  _id: string;
  email: string;
  name: string;
  username: string;
  adminAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
  socketId: string;
}

let users: UserDocument[] = [];

export const addSocketUser = (userData: UserDocument, socketId: string) => {
  !users.some((user) => user._id == userData?._id) &&
    users.push({ ...userData, socketId });
};

export const getSocketUser = (userId: string) => {
  return users.find((user) => user._id === userId);
};

export const getSocketUsers = () => {
  return users;
};

export const removeSocketUser = (userId: string) => {
  users = users.filter((user) => user.socketId !== userId);
};

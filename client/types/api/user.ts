export interface UserDocument {
  _id: string;
  email: string;
  name: string;
  username: string;
  adminAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Login {
  token: string;
  user: UserDocument;
}

export interface Users {
  results: number;
  users: UserDocument[];
}

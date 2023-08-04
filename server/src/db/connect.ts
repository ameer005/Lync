import mongoose from "mongoose";

const connect = (url: string): Promise<typeof mongoose> => {
  mongoose.set("strictQuery", true);
  return mongoose.connect(url);
};

export default connect;

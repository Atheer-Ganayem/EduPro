import mongoose from "mongoose";
const url = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.znjli.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return await mongoose.connect(url);
};

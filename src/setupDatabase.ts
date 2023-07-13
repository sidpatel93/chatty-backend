import mongoose from "mongoose";
import {config} from "./config";
export default () => {
  const connect = () => {
    mongoose.connect(config.DATABASE_URL).then(() => {
      console.log('connected to mongodb');
    }).catch((error) => {
      console.log('error connecting to mongodb', error);
      return process.exit(1);
    });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};

import mongoose from "mongoose";
import Logger from "bunyan";
import {config} from "@root/config";

const log: Logger = config.createLogger('database');
export default () => {
  const connect = () => {
    mongoose.connect(config.DATABASE_URL).then(() => {
      log.info('Connected to mongodb !!!!!!!!!!!');
    }).catch((error) => {
      log.error(error);
      return process.exit(1);
    });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};

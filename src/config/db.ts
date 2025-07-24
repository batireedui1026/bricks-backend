import mongoose from "mongoose";
import log from "../utils/logger";

export const connectDB = async (uri: string) => {
  // console.log("URI-IReedui", uri);
  try {
    const con = await mongoose.connect(uri);
    log("debug", "database connected", con.connection.host);
    // console.log("", con.connection.host);
  } catch (error) {
    console.log("err", error);
    console.log("database cannot connected");
  }
};

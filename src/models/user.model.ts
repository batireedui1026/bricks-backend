import mongoose, { model, Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  username: String;
  firstname: String;
  lastname: String;
  password: String;
  email: String;
  contactPhone: String;
  role: "admin" | "teacher" | "unitel" | "superadmin";
  active: Boolean;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрийг заавал оруулна."],
  },
  firstname: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрийг заавал оруулна."],
  },
  lastname: {
    type: String,
    required: [true, "Хэрэглэгчийн овгийг заавал оруулна."],
  },
  password: {
    type: String,
    required: [true, "Хэрэглэгчийн нууц үгийг заавал оруулна."],
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн майл хаягийг заавал оруулна."],
  },
  contactPhone: {
    type: String,
    required: [true, "Хэрэглэгчийн утасыг хаягийг заавал оруулна."],
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "unitel", "superadmin"],
    required: [true, "Хэрэглэгчийн эрхийг заавал оруулна."],
  },
  active: {
    type: Boolean,
    required: [true, "Хэрэглэгчийн төлөв заавал оруулна."],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = model<IUser>("User", userSchema);
export default User;

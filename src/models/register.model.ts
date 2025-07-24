import mongoose, { model, Schema, Document } from "mongoose";
interface IRegistration {
  trainingType: Schema.Types.ObjectId;
  childrenNames: string | string[];
  contactPhone: String;
  childrenNumber: Number;
  email: String;
  invoiceId: string;
  paidAt: Date;
  paymentStatus: "paid" | "unpaid";
  paymentAmount: Number;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    trainingType: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Сургалтын төрлийг заавал оруулна."],
    },
    childrenNames: {
      type: [],
      required: [true, "Нэрийг заавал оруулна."],
    },
    contactPhone: {
      type: String,
      required: [true, "Холбоо барих утсыг заавал оруулна."],
    },
    childrenNumber: {
      type: Number,
      required: [true, "Хүүхдийн тоог заавал оруулна"],
      default: 1,
    },
    email: {
      type: String,
      required: [true, "и-мэйл хаягийг заавал оруулна."],
    },
    invoiceId: {
      type: String,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    expireAt: {
      type: Date,
      default: null,
      index: { expires: 0 },
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      required: [true, "Төлбөрийн төлөвийг заавал оруулна."],
    },
    paymentAmount: {
      type: Number,
      required: [false, "Төлбөрийн дүн"],
    },
  },
  { timestamps: true }
);

const Registration = model<IRegistration>("Registration", registrationSchema);
export default Registration;

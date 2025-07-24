import mongoose, { model, Schema, Document } from "mongoose";

interface IInvoice extends Document {
  invoiceId: string;
  status: "unpaid" | "paid";
  created_at: Date;
  paid_at: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: { type: String },
    status: { type: String, default: "unpaid" },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Invoice = model<IInvoice>("invoice", invoiceSchema);

export default Invoice;

import {
  callbackWebhook,
  checkInvoice,
  createInvoice,
  deleteInvoice,
  downloadPayment,
} from "../controllers/bank-controller";

const paymentRoute = (app: any) => {
  app.post("/api/v1/payment/create/invoice", createInvoice);
  app.post("/api/v1/payment/check/invoice/:invoice_id", checkInvoice);
  app.delete("/api/v1/payment/check/invoice/:invoice_id", deleteInvoice);
  app.get("/api/v1/payment/check/invoice/:payment_id", downloadPayment);

  app.get("/api/v1/payment/payment_id", callbackWebhook);
};
export default paymentRoute;

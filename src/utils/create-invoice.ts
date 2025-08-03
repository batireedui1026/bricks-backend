import log from "./logger";
import { getQPayToken, getToken } from "./qpay-token";
import httpsRequest from "./request-builder";
import { Request, Response } from "express";
export const createInvoiceFn = async (
  trainingType: string,
  contactPhone: string,
  payment_id: string,
  amount: number
) => {
  const dynamicDescription = `${trainingType} ${contactPhone}`;
  console.log(dynamicDescription);

  try {
    let token = getToken();
    if (token === null) {
      log("warn", "Token null get new token");
      token = await getQPayToken();
    }

    const body = {
      invoice_code: "MGLSTEM_EDU_INVOICE",
      sender_invoice_no: "123455678",
      invoice_receiver_code: "83",
      sender_branch_code: "BRANCH1",
      invoice_description: dynamicDescription,
      enable_expiry: false,
      allow_partial: false,
      minimum_amount: null,
      allow_exceed: false,
      maximum_amount: null,
      amount: amount,
      callback_url:
        "http://steamhub.mn/api/v1/payment/payment_id?payment_id=" + payment_id,
      sender_staff_code: "online",
      note: null,
      invoice_receiver_data: {
        register: "РД7018585",
        name: "Munkhsaikhan",
        email: "test@gmail.com",
        phone: "99092085",
      },
      lines: [
        {
          line_description: dynamicDescription,
          line_quantity: 1.0,
          line_unit_price: amount,
          note: "-",
        },
      ],
    };

    const result = await httpsRequest<any, any>(
      "POST",
      "https://merchant.qpay.mn/v2/invoice",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result;
  } catch (error) {
    log("error", "invoice create ", error);
    return null;
  }
};

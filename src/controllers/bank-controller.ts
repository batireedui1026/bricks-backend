import { Request, Response } from "express";
import log from "../utils/logger";
import { getQPayToken, getToken } from "../utils/qpay-token";
import httpsRequest from "../utils/request-builder";
import Invoice from "../models/invoice.model";
import Registration from "../models/register.model";
// import { DateTime } from "luxon";

export const createInvoice = async (req: Request, res: Response) => {
  const { province, contactPhone } = req.body;
  const dynamicDescription = `${province} ${contactPhone}`;
  console.log(dynamicDescription);
  const payment_id = "12345678";
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
      amount: 85000,
      callback_url:
        "http://steamhub.mn/api/v1/payment/payment_id?payment_id=" + payment_id,
      sender_staff_code: "online",
      note: null,
      invoice_receiver_data: {
        register: "РД7018585",
        name: "Munkhsaikhan",
        email: "Info@unitelhub.mn",
        phone: "99092085",
      },
      lines: [
        {
          line_description: dynamicDescription,
          line_quantity: 1.0,
          line_unit_price: 85000,
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

    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    log("error", "Нэхэмжлэл үүсгэхэд алдаа гарлаа", error);
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

// tulbur shalgahad checkincoice duudna omno n incoiceid yvuulj baigaa utga irne tulbur shalgasd, body goor regiterartion id tulbur toloh

export const checkInvoice = async (req: Request, res: Response) => {
  const id = req.params.invoice_id;
  const {
    email,
    FirstName,
    trainingType,
    startTime,
    endTime,
    address,
    startDate,
    endDate,
  } = req.body;

  try {
    let token = getToken();
    if (token === null) {
      log("warn", "Token null get new token");
      token = await getQPayToken();
    }
    const body = {
      object_type: "INVOICE",
      object_id: id,
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    };
    const result = await httpsRequest<any, any>(
      "POST",
      "https://merchant.qpay.mn/v2/payment/check",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (result?.data.rows?.[0]?.payment_status === "PAID") {
      // const paymentId = req.query.payment_id as string;

      await Registration.updateOne(
        { invoiceId: id },
        {
          $set: {
            paymentStatus: "paid",
            paymentAmount: result?.data.rows?.[0]?.payment_amount,
            expireAt: null,
            paidAt: new Date(),
          },
        }
      );
    }

    res.status(200).json({ result });
  } catch (error) {
    log("error", "Нэхэмжлэл үүсгэхэд алдаа гарлаа", error);
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const id = req.params.invoice_id;
  if (!id) return res.status(400).json({ message: "Invoice ID is required." });
  try {
    let token = getToken();
    if (token === null) {
      log("warn", "Token null get new token");
      token = await getQPayToken();
    }
    const body = {
      object_type: "INVOICE",
      object_id: id,
    };

    const result = await httpsRequest<any, any>(
      "DELETE",
      "https://merchant.qpay.mn/v2/payment/cancel",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({ success: true, result });
  } catch (error) {
    log("error", "Нэхэмжлэл цуцлахад алдаа гарлаа", error);
    res.status(500).json({ message: "Цуцлахад алдаа гарлаа", error });
  }
};
export const downloadPayment = async (req: Request, res: Response) => {
  const id = req.params.payment_id;
  try {
    let token = getToken();
    if (token === null) {
      log("warn", "Token null get new token");
      token = await getQPayToken();
    }

    const result = await httpsRequest<any, any>(
      "GET",
      "https://merchant.qpay.mn/v2/payment/cancel",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    log("error", "Нэхэмжлэл татахад алдаа гарлаа", error);
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

// export const callbackWebhook = async (req: Request, res: Response) => {
//   const paymentId = req.query.payment_id as string;
//   await Registration.findByIdAndUpdate(paymentId, {
//     paymentStatus: "paid",
//     expireAt: null,
//     paymentAmount: 85000,
//     paidAt: new Date(),
//   });
//   // энд төлсөн төлөв өөрчлөх
//   console.log("calbaclurl__------mun--=");
//   res.status(200).send("SUCCESS");
// };
export const callbackWebhook = async (req: Request, res: Response) => {
  const paymentId = req.query.payment_id as string;
  try {
    // is here

    await Registration.findByIdAndUpdate(paymentId, {
      paymentStatus: "paid",
      expireAt: null,
      paymentAmount: 40,
      paidAt: new Date(),
    });

    log("info", "callback url paymentId: " + paymentId, "OK");
  } catch (error) {
    log("error", "callback url error: " + paymentId, error);
  }

  res.status(200).send("SUCCESS");
};

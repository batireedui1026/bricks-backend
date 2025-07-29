import { Request, Response } from "express";
import Registration from "../models/register.model";
import { createInvoiceFn } from "../utils/create-invoice";
import mongoose from "mongoose";
import Lesson from "../models/lesson.model";
import Class from "../models/class.model";

export const createRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { trainingType, childrenNames, contactPhone, childrenNumber, email } =
    req.body;

  try {
    if (
      !trainingType ||
      !childrenNumber ||
      !childrenNames ||
      !contactPhone ||
      !email
    ) {
      res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
      return;
    }

    if (
      Array.isArray(childrenNames) &&
      childrenNames.length !== childrenNumber
    ) {
      res
        .status(400)
        .json({ message: "Хүүхдийн тоо болон нэрсийн тоо таарахгүй байна" });
      return;
    }

    const selectedClass = await Class.findById(trainingType).populate({
      path: "course_id",
      select: "amount",
    });

    if (
      !selectedClass ||
      !selectedClass.course_id ||
      (typeof selectedClass.course_id === "object" &&
        !("amount" in selectedClass.course_id))
    ) {
      res.status(404).json({ message: "Анги эсвэл хичээл олдсонгүй" });
      return;
    }

    const baseCost = (selectedClass.course_id as { amount: number })?.amount;

    const paymentAmount = baseCost * childrenNumber;

    const paymentStatus = "unpaid";

    const registration = await Registration.create({
      trainingType: new mongoose.Types.ObjectId(trainingType),
      childrenNames: Array.isArray(childrenNames)
        ? childrenNames
        : [childrenNames],
      contactPhone,
      childrenNumber,
      email,
      paymentAmount,
      paymentStatus,
      // expireAt: new Date(Date.now() + 25 * 60 * 1000),
      expireAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    console.log("Registration ID:", registration._id.toHexString());
    const id = registration._id.toHexString();

    const invoice = await createInvoiceFn(
      trainingType,
      contactPhone,
      id,
      paymentAmount
    );

    if (invoice?.status === 200) {
      const update = await Registration.findByIdAndUpdate(id, {
        invoiceId: invoice?.data.invoice_id,
      });

      res.status(201).json({
        message: "Бүртгэл амжилттай",
        data: { update, invoice },
      });
    } else {
      res.status(500).json({ message: "Invoice үүсгэхэд алдаа гарлаа" });
    }
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

export const getAllRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const registrations = await Registration.find({}).populate({
      path: "trainingType",
      select: "trainingType",
      populate: { path: "course_id", select: "name" },
    });
    res.status(200).json({ message: "Бүртгэлүүд олдлоо", registrations });
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

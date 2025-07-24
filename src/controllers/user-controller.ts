import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";
import { decodeToken, generateToken } from "../utils/jwt";
import mongoose, { model, Schema } from "mongoose";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Хоосон утга байж болохгүй." });
      return;
    }
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ message: "Хэрэглэгч олдсонгүй." });
      return;
    }

    const isCheck = bcrypt.compareSync(password, user.password.toString());
    if (!isCheck) {
      res.status(400).json({
        message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.",
      });
      return;
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      message: "Амжилттай нэвтэрлээ",
      token,
      user: { username, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      console.log("req ees irse zadalsan token", token);
      const user = decodeToken(token);
      console.log("user", user);
    }

    if (!username || !password || !role) {
      res.status(400).json({ message: "Бүх талбарыг бөглөнө үү." });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Энэ хэрэглэгч аль хэдийн бүртгэгдсэн байна." });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Хэрэглэгч амжилттай бүртгэгдлээ." });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ message: "Хэрэглэгч бүртгэхэд алдаа гарлаа." });
  }
};

export const currentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const usert = decodeToken(token);
      console.error(usert);
      const user = await User.findById(usert.id);
      res.status(200).json({
        role: user?.role,
        username: user?.username,
        message: "Success",
      });
    } else res.status(400).json({ message: "test" });
  } catch (error) {
    res.status(400).json({ message: "Failed to get user data" });
  }
};

export const createTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      firstname,
      lastname,
      password,
      email,
      contactPhone,
      role,
      active,
    } = req.body;
    if (
      !username ||
      !firstname ||
      !lastname ||
      !password ||
      !email ||
      !contactPhone ||
      !role ||
      !active
    ) {
      res.status(400).json({ message: "Бүх талбарыг бөглөнө үү." });
      return;
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Энэ хэрэглэгчийн нэр аль хэдийн ашиглагдаж байна." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
      email,
      contactPhone,
      role,
      active,
      create_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json({ message: "Багш амжилттай бүртгэгдлээ." });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ message: "Багш бүртгэхэд алдаа гарлаа." });
  }
};
export const getTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teachers = await User.find({});
    res.status(200).json({ message: "Багш нарын мэдээлэл олдлоо", teachers });
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

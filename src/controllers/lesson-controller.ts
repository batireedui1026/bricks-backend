import { Request, Response } from "express";
import Lesson from "../models/lesson.model";
import mongoose from "mongoose";
import User from "../models/user.model";

export const createLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, amount, description } = req.body;
    const lesson = await Lesson.create({ name, amount, description });

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, amount, description } = req.body;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({ message: "Хичээл олдсонгүй." });
      return;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { name, amount, description },
      { new: true }
    );

    res.status(200).json({
      message: "Хичээл амжилттай шинэчлэгдлээ",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
};
export const getLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await Lesson.find({});
    res.status(200).json({ message: "Хичээлүүд олдлоо", subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Алдаа гарла", error });
  }
};

import { Request, Response } from "express";
import Class from "../models/class.model";
import mongoose from "mongoose";
import { decodeToken } from "../utils/jwt";
import User from "../models/user.model";
import Lesson from "../models/lesson.model";
import Registration from "../models/register.model";
export const createClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      course_id,
      startDate,
      endDate,
      startTime,
      endTime,
      trainingDay,
      maxStudents,
      start_enroll_date,
      end_enroll_date,
      address,
      count_student,
      program,
    } = req.body;

    const teacher_id = req.user.id;
    const user = await User.findById(teacher_id);

    if (!user) {
      res.status(404).json({ message: "Хэрэглэгч олдсонгүй." });
      return;
    }
    if (
      !course_id ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !trainingDay ||
      !maxStudents ||
      !address ||
      !start_enroll_date ||
      !end_enroll_date ||
      !program
    ) {
      res.status(400).json({ message: "Бүх талбарыг бөглөнө үү." });
      return;
    }

    const newClass = await Class.create({
      teacherId: new mongoose.Types.ObjectId(user.id),
      course_id,
      startDate,
      endDate,
      startTime,
      endTime,
      trainingDay,
      maxStudents,
      start_enroll_date,
      end_enroll_date,
      address,
      count_student,
      program,
    });

    res.status(201).json({
      message: "Анги амжилттай үүсгэлээ.",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class registration:", error);
    res.status(500).json({ message: "Анги үүсгэхэд алдаа гарлаа." });
  }
};
export const getTeachersClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teacher_id = req.user.id;
    const teacherclass = await Class.find({ teacherId: teacher_id }).populate(
      "course_id"
    );
    res.status(200).json({
      message: "Багшийн ангиуд амжилттай татагдлаа.",
      data: teacherclass,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Багшийн ангийг авахад алдаа гарлаа." });
  }
};
export const updateClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Багш олдсонгүй." });
      return;
    }
    const existingClass = await Class.findById(id);
    if (!existingClass) {
      res.status(404).json({ message: "Анги олдсонгүй." });
      return;
    }

    const {
      course_id,
      startDate,
      endDate,
      startTime,
      endTime,
      trainingDay,
      maxStudents,
      start_enroll_date,
      end_enroll_date,
      address,
      count_student,
    } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        teacherId: userId,
        course_id,
        startDate,
        endDate,
        startTime,
        endTime,
        trainingDay,
        maxStudents,
        start_enroll_date,
        end_enroll_date,
        address,
        count_student,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Анги амжилттай шинэчлэгдлээ.",
      data: updatedClass,
    });
  } catch (error: any) {
    console.error("Error updating class:", error);
    res.status(500).json({
      message: "Анги шинэчлэхэд алдаа гарлаа.",
      details: error.message,
    });
  }
};
export const getClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const classes = await Class.find({
      teacherId: id,
      $expr: { $lt: ["$count_student", "$maxStudents"] },
      start_enroll_date: { $lte: now },
      end_enroll_date: { $gte: now },
    });
    console.log("class", classes);
    res.status(200).json({ message: "ангиуд олдлоо", classes });
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
    console.log("class", error);
  }
};
export const getClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classes = await Class.find({})
      .populate("teacherId")
      .populate("course_id");
    res.status(200).json({ message: "Бүртгэлүүд олдлоо", classes });
  } catch (error) {
    console.error("Error getting classes:", error);
    res.status(500).json({ message: "Анги авахад алдаа гарлаа." });
  }
};
export const getClassStudentList = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const now = new Date();
    const classes = await Class.find({
      teacherId: id,
      // start_enroll_date: { $lte: now },
      // end_enroll_date: { $gte: now },
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("course_id");
    const classes1 = await Class.find({
      teacherId: id,
      // startDate: { $lte: now },
      // endDate: { $gte: now },
    }).populate("course_id");
    const result = [];
    for (let i = 0; i < classes.length; i++) {
      const student = await Registration.find({
        trainingType: new mongoose.Types.ObjectId(classes[i]._id as string),
      });
      const obj = { classes: classes[i], student: student };
      result.push(obj);
    }

    for (let i = 0; i < classes1.length; i++) {
      const student = await Registration.find({
        trainingType: new mongoose.Types.ObjectId(classes1[i]._id as string),
      });
      const obj = { classes1: classes1[i], student: student };
      result.push(obj);
    }

    res.status(200).json({ message: "ангиуд олдлоо", result });
  } catch (err) {
    console.error(err);
  }
};

import mongoose, { model, Schema, Document } from "mongoose";

interface IClass extends Document {
  teacherId: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  trainingDay: String[];
  address: String;
  startTime: String;
  endTime: String;
  maxStudents: Number;
  start_enroll_date: Date;
  end_enroll_date: Date;
  count_student: Number;
  program: String;
  created_at: Date;
  updated_at: Date;
}

const classSchema = new Schema<IClass>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course_id: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    trainingDay: { type: [], required: true },
    maxStudents: { type: Number, default: 10 },
    address: { type: String, required: true },
    start_enroll_date: { type: Date, required: true },
    end_enroll_date: { type: Date, required: true },
    count_student: { type: Number, default: 0 },
    program: { type: String, required: true },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Class = model<IClass>("Class", classSchema);

export default Class;

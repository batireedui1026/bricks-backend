import { model, Schema } from "mongoose";
interface ILesson {
  name: String;
  amount: Number;
  description: String;
}
const lessonSchema = new Schema<ILesson>({
  name: {
    type: String,
    required: [true, "хичээл нэрийг заавал оруулна."],
  },
  amount: {
    type: Number,
    required: [true, "Хичээлийн үнийн дүнг заавал оруулна."],
  },
  description: {
    type: String,
    required: [true, "хичээл тайлбарыг заавал оруулна."],
  },
});
const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;

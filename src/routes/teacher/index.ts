import {
  createClass,
  getClass,
  getClasses,
  getClassStudentList,
  getTeachersClass,
  updateClass,
} from "../../controllers/class-controller";
import { teacherAuth } from "../../middlewares/teacher-auth";
const teacherRoute = (app: any) => {
  app.post("/api/v1/teacher/class", teacherAuth, createClass);
  app.get("/api/v1/teacher/classess", teacherAuth, getTeachersClass);
  app.put("/api/v1/teacher/class/:id", teacherAuth, updateClass);
  app.get("/api/v1/teacher/class/:id", getClass);
  app.get("/api/v1/teacher/class", getClasses);
  app.get("/api/v1/teacher/all/student", teacherAuth, getClassStudentList);
};
export default teacherRoute;

import {
  createLesson,
  updateLesson,
} from "../../controllers/lesson-controller";
import { createTeacher, getTeachers } from "../../controllers/user-controller";
import { adminAuth } from "../../middlewares/admin-auth";

const adminRoute = (app: any) => {
  app.post("/api/v1/admin/create-lesson", adminAuth, createLesson);
  app.post("/api/v1/admin/new-teacher", adminAuth, createTeacher);
  app.get("/api/v1/admin/get-teacher", adminAuth, getTeachers);
  app.put("/api/v1/admin/put-lesson/:id", adminAuth, updateLesson);
};
export default adminRoute;

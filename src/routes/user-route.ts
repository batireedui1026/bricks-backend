import { Router } from "express";
import { currentUser, login, signUp } from "../controllers/user-controller";
import { createTeacher } from "../controllers/user-controller";

const router = Router();

router.post("/login", login);
router.post("/signUp", signUp);
router.get("/current-user", currentUser);

export default router;

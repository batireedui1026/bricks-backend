import { Router } from "express";
import {
  createRegistration,
  getAllRegistration,
} from "../controllers/register-controller";
const router = Router();
router.route("/").post(createRegistration);
router.route("/").get(getAllRegistration);

export default router;

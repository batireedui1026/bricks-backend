import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cors from "cors";
import adminRoute from "./routes/admin";
import teacherRoute from "./routes/teacher/index";
dotenv.config();
import lessonRoute from "./routes/lesson-route";
import userRoute from "./routes/user-route";
import registrationRoute from "./routes/register-route";
import paymentRoute from "./routes/payment-route";
const PORT = process.env.PORT || "";
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/lesson", lessonRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/register", registrationRoute);

adminRoute(app);
teacherRoute(app);
paymentRoute(app);
connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log(`Сервер localhost:${PORT} дээр аслаа`);
});

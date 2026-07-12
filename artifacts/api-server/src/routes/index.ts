import { Router } from "express";
import healthRouter from "./health.js";
import chatRouter from "./chat.js";
import tripPlanRouter from "./trip-plan.js";

const router = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(tripPlanRouter);

export default router;

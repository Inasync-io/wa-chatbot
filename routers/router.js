import e from "express";
import { serviceRequests } from "../Controllers/whatsappCon.js";

const router = e.Router();

router.post("/service-requests", serviceRequests);

export default router;
import { Router } from "express";
import { extractInvoice, getInvoice } from "../controllers/invoice";

const router = Router();

router.post("/", extractInvoice);
router.get("/", getInvoice);

export default router;

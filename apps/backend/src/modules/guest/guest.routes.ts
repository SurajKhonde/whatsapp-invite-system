import { Router } from "express";
import { addGuests, getGuests } from "./guest.controller";

const router = Router();

router.post("/bulk", addGuests);
router.get("/", getGuests);

export default router;
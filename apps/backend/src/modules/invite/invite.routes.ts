import express from "express";
import { createInvite } from "./invite.controller";

const router = express.Router();

router.post("/invite-imagegenrator", createInvite);

export default router;
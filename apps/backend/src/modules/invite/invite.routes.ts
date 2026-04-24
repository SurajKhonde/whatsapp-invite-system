// src/modules/invite/invite.routes.ts

import express from "express";
import { createInvite } from "./invite.controller";

const router = express.Router();

router.post("/preview", createInvite);

export default router;
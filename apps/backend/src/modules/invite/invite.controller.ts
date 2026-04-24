// src/modules/invite/invite.controller.ts

import { Request, Response } from "express";
import { InviteService } from "./invite.service";

const inviteService = new InviteService();

export const createInvite = async (req: Request, res: Response) => {
  try {
    const fileName = await inviteService.generateAndSave(req.body);

    // ✅ Public URL
    const imageUrl = `/generated/${fileName}`;

    return res.json({
      success: true,
      imageUrl,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate invite" });
  }
};
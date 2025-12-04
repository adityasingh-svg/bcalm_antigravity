import { Router } from "express";
import { db } from "../db";
import { leads, insertLeadSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

router.post("/submit", async (req, res) => {
  try {
    const validatedData = insertLeadSchema.parse(req.body);
    
    const [lead] = await db.insert(leads).values({
      name: validatedData.name,
      phone: validatedData.phone,
      utmSource: validatedData.utmSource || null,
      utmMedium: validatedData.utmMedium || null,
      utmCampaign: validatedData.utmCampaign || null,
    }).returning();
    
    res.json({ success: true, leadId: lead.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Lead submission error:", error);
    res.status(500).json({ error: "Failed to submit lead" });
  }
});

export default router;

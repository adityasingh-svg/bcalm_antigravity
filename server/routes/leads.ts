import { Router } from "express";
import { db } from "../db";
import { leads, insertLeadSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const validatedData = insertLeadSchema.parse(req.body);
    
    const [newLead] = await db.insert(leads).values({
      name: validatedData.name,
      phone: validatedData.phone,
      utmSource: validatedData.utmSource || null,
      utmMedium: validatedData.utmMedium || null,
      utmCampaign: validatedData.utmCampaign || null,
    }).returning();
    
    res.status(201).json({ 
      success: true, 
      message: "Lead captured successfully",
      leadId: newLead.id 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    console.error("Error saving lead:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to save lead" 
    });
  }
});

export default router;

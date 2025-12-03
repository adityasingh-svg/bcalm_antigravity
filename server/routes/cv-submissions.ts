import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertCvSubmissionSchema } from "@shared/schema";
import { upload } from "../middleware/upload";
import path from "path";
import fs from "fs";

const router = Router();

const cvUploadDir = path.join(process.cwd(), "uploads/cv-submissions");
if (!fs.existsSync(cvUploadDir)) {
  fs.mkdirSync(cvUploadDir, { recursive: true });
}

router.post("/submit", upload.single("cv"), async (req: Request, res: Response) => {
  try {
    const { email, targetRole, utmSource, utmMedium, utmCampaign } = req.body;

    let cvFilePath: string | null = null;
    let cvFileName: string | null = null;
    let cvFileSize: number | null = null;
    let cvMimeType: string | null = null;

    if (req.file) {
      const newPath = path.join(cvUploadDir, req.file.filename);
      fs.renameSync(req.file.path, newPath);
      
      cvFilePath = `uploads/cv-submissions/${req.file.filename}`;
      cvFileName = req.file.originalname;
      cvFileSize = req.file.size;
      cvMimeType = req.file.mimetype;
    }

    const submissionData = {
      email,
      targetRole,
      cvFilePath,
      cvFileName,
      cvFileSize,
      cvMimeType,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
    };

    const validatedData = insertCvSubmissionSchema.parse(submissionData);
    const submission = await storage.createCvSubmission(validatedData);

    res.status(201).json({
      success: true,
      message: "CV submitted successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("CV submission error:", error);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error });
    }
    res.status(500).json({ error: "Failed to submit CV" });
  }
});

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getCvSubmissionStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching CV stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const submissions = await storage.getAllCvSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching CV submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;

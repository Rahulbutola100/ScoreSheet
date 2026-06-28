import express from "express";
import multer from "multer";
import { extractTextFromFile } from "../utils/extractText.js";
import { analyzeResumeMatch } from "../utils/matchEngine.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/match", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Please upload a resume file." });
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res
        .status(400)
        .json({ error: "Please paste a complete job description (at least a few sentences)." });
    }

    const resumeText = await extractTextFromFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    if (!resumeText || resumeText.length < 30) {
      return res.status(400).json({
        error: "Could not read meaningful text from this resume. Try a different file.",
      });
    }

    const analysis = await analyzeResumeMatch(resumeText, jobDescription);
    return res.json(analysis);
  } catch (err) {
    console.error("Match error:", err);
    return res.status(500).json({
      error: err.message || "Something went wrong while analyzing the resume.",
    });
  }
});

export default router;

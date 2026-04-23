import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { analyzeRoleFit } from "../services/ai.services.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ANALYZE */
export const analyze = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const userEmail = req.user?.email;

    if (!userEmail || !jobDescription || !req.file) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const data = new Uint8Array(fs.readFileSync(req.file.path));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(i => i.str).join(" ");
    }

    const result = await analyzeRoleFit(text, jobDescription);

    await prisma.analysis.create({
      data: {
        userEmail,
        jobDescription,
        result,
      },
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
};

/* HISTORY */
export const getHistory = async (req, res) => {
  try {
    const userEmail = req.user?.email;

    const data = await prisma.analysis.findMany({
      where: { userEmail },
      orderBy: { createdAt: "desc" },
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
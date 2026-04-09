import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { analyzeRoleFit } from "../services/ai.services.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const analyze = async (req, res) => {
  try {

    const { firstName, lastName, email, jobDescription } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !jobDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let profileText = "";

    // Parse uploaded PDF
    if (req.file) {

      const pdf = await getDocumentProxy(
        new Uint8Array(req.file.buffer)
      );

      const { text } = await extractText(pdf, { mergePages: true });

      profileText = text
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (!profileText) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Run AI analysis
    const result = await analyzeRoleFit(profileText, jobDescription);

    // Create or update user
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, firstName, lastName }
    });

    // Save analysis
    await prisma.analysis.create({
      data: {
        userEmail: email,
        jobDescription,
        result: result
      }
    });

    res.json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Analysis failed" });

  }
};

// This function extracts text from the uploaded resume and basic contact info
export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded",
      });
    }

    const data = new Uint8Array(fs.readFileSync(req.file.path));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      text += pageText + "\n";
    }

    // Extract email
    const emailMatch = text.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    // Try to detect name from first line
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const possibleName = lines[0]?.split(" ") || [];

    const firstName = possibleName[0] || "";
    const lastName = possibleName.slice(1).join(" ") || "";

    return res.status(200).json({
      firstName,
      lastName,
      email: emailMatch?.[0] || "",
      text,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);

    return res.status(500).json({
      message: "Failed to parse resume",
      error: error.message,
    });
  }
};


export const getHistory = async (req, res) => {

  try {

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const history = await prisma.analysis.findMany({
      where: { userEmail: email },
      orderBy: { createdAt: "desc" }
    });

    res.json(history);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });

  }
};
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeRoleFit = async (resumeText, jobDescription) => {
  const prompt = `
  You are an expert ATS system and technical recruiter.
  
  Compare the following resume and job description.
  
  Return ONLY valid JSON.
  
  {
    "fitScore": number (0-100),
    "matchingSkills": string[],
    "missingSkills": string[],
    "riskFactors": string[],
    "advice": string,
    "interviewQuestions": string[]
  }
  
  RULES:
  - Always return valid JSON
  - No explanations outside JSON
  - At least 3 matching + 3 missing skills
  - Fit score must be realistic
  
  RESUME:
  ${resumeText}
  
  JOB DESCRIPTION:
  ${jobDescription}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: {
      type: "json_object",
    },
  });

  let result;

  try {
    result = JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("JSON parse error:", err);

    result = {
      fitScore: 50,
      matchingSkills: [],
      missingSkills: [],
      riskFactors: ["Parsing failed"],
      advice: "Try again",
      interviewQuestions: [],
    };
  }

  return result;
};
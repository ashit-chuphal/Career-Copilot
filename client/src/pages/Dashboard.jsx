import { useState } from "react";
import axios from "axios";

// Use Vite's environment variable for development only
// const REACT_API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const analyze = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload resume and add job description");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const res = await axios.post(
        // Use relative URL for development; in production, it will be proxied
        // `${REACT_API_URL}/api/ai/analyze`,
        "/api/ai/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Debug API response
      console.log("API Response:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-wide">
          🚀 CareerCopilot Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Analyze your resume against job descriptions using AI
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="glass card-3d p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">
          Upload Resume (PDF)
        </h3>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="text-sm"
        />
      </div>

      {/* JOB DESCRIPTION */}
      <div className="glass card-3d p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">
          Job Description
        </h3>

        <textarea
          placeholder="Paste job description here..."
          className="w-full h-40 p-4 bg-transparent border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={analyze}
        className="glow-btn px-8 py-3 rounded-xl font-semibold"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="glass card-3d p-6 rounded-2xl mt-6">

          {/* SCORE */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">Fit Score</h2>

            <span
              className={`px-4 py-1 rounded-full text-sm font-bold ${
                result.fitScore >= 75
                  ? "bg-green-500"
                  : result.fitScore >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {result?.fitScore ?? "N/A"}%
            </span>
          </div>

          {/* MATCHING SKILLS */}
          {result.matchingSkills?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-green-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MISSING SKILLS */}
          {result.missingSkills?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ADVICE */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Advice</h3>
            <p className="text-gray-300">{result.advice}</p>
          </div>

          {/* INTERVIEW QUESTIONS */}
          {result.interviewQuestions?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">
                Interview Questions
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                {result.interviewQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import axios from "axios";

const REACT_API_URL = import.meta.env.VITE_API_URL;

const History = () => {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================= FETCH =================
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${REACT_API_URL}/api/ai/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this analysis?")) return;

    try {
      await axios.delete(
        `${REACT_API_URL}/api/ai/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelected(null);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ================= SELECTED RESULT =================
  const result =
    selected && typeof selected.result === "string"
      ? JSON.parse(selected.result)
      : selected?.result;

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Analysis History</h1>

      {/* ================= LIST VIEW ================= */}
      {!selected &&
        history.map((item) => {
          const parsed =
            typeof item.result === "string"
              ? JSON.parse(item.result)
              : item.result;

          return (
            <div
              key={item.id}
              className="glass card-3d p-5 rounded-xl cursor-pointer hover:scale-[1.02] transition"
              onClick={() => setSelected(item)}
            >
              <p>{new Date(item.createdAt).toLocaleString()}</p>
              <p className="mt-1">
                Fit Score: {parsed?.fitScore ?? "N/A"}%
              </p>
            </div>
          );
        })}

      {/* ================= DETAIL VIEW ================= */}
      {selected && (
        <div className="glass card-3d p-6 rounded-xl">

          {/* BACK */}
          <button
            onClick={() => setSelected(null)}
            className="mb-4 text-purple-400 hover:underline"
          >
            ← Back
          </button>

          {/* SCORE */}
          <h2 className="text-xl font-bold mb-4">
            Fit Score: {result?.fitScore ?? "N/A"}%
          </h2>

          {/* ADVICE */}
          <p className="mb-6 text-gray-300">
            {result?.advice}
          </p>

          {/* MATCHING SKILLS */}
          {result?.matchingSkills?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-green-600 px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MISSING SKILLS */}
          {result?.missingSkills?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* INTERVIEW QUESTIONS */}
          {result?.interviewQuestions?.length > 0 && (
            <div className="mb-4">
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

          {/* DELETE BUTTON */}
          <button
            onClick={() => deleteItem(selected.id)}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl mt-6 transition"
          >
            Delete Analysis
          </button>

        </div>
      )}
    </div>
  );
};

export default History;
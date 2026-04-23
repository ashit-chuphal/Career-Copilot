import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ai/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Analysis History</h1>

      {history.map((item) => (
        <div
          key={item.id}
          className="bg-slate-900 p-4 rounded-xl mb-4"
        >
          <p>{new Date(item.createdAt).toLocaleString()}</p>
          <p>Fit Score: {item.result?.fitScore || "N/A"}%</p>
        </div>
      ))}
    </div>
  );
};

export default History;
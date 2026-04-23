import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        activeTab === "signup"
          ? "http://localhost:5000/api/auth/register"
          : "http://localhost:5000/api/auth/login";

      const res = await axios.post(endpoint, formData);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] px-6">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl bg-[#0b1220] border border-[#1e293b] rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-10 w-1/2 bg-gradient-to-br from-[#1e293b] to-[#020617] text-white">

          <h1 className="text-4xl font-bold mb-4">CareerCopilot</h1>

          <p className="text-gray-400 mb-8">
            AI-powered resume analysis for smarter job applications
          </p>

          <div className="space-y-4 text-sm">
            <p>🚀 AI Resume Analysis</p>
            <p>📊 Job Match Score</p>
            <p>✅ ATS Optimization</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10 text-white">

          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-2 ${
                activeTab === "login"
                  ? "border-b-2 border-purple-500"
                  : ""
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 pb-2 ${
                activeTab === "signup"
                  ? "border-b-2 border-purple-500"
                  : ""
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-2">
            {activeTab === "login"
              ? "Welcome back 👋"
              : "Create your account"}
          </h2>

          <p className="text-gray-400 mb-6">
            {activeTab === "login"
              ? "Login to continue"
              : "Start your AI career journey"}
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl mb-6"
          >
            <FcGoogle /> Continue with Google
          </button>

          <div className="text-center text-gray-500 mb-4">OR</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {activeTab === "signup" && (
              <>
                <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700"
                />

                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700"
                />
              </>
            )}

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700"
            />

            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-semibold">
              {activeTab === "login" ? "Login" : "Create Account"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
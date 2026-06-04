import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
  const token = params.get("token");

  console.log("TOKEN FROM URL:", token);

  if (token) {
    localStorage.setItem("token", token);

    console.log(
      "TOKEN IN LOCAL STORAGE:",
      localStorage.getItem("token")
    );

    navigate("/dashboard");
  } else {
    navigate("/login");
  }
}, []);

  return <div className="text-white p-10">Logging in...</div>;
};

export default AuthSuccess;
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import MainPage from "./Pages/MainPage";
import LoginOrRegister from "./Pages/LoginOrRegister";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/Auth/verifyToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          navigate("/editor");
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);
  return (
    <Routes>
      <Route path="/editor" element={<MainPage />} />
      <Route path="/" element={<LoginOrRegister />} />
    </Routes>
  );
};

export default App;

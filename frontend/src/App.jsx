import React, { useEffect } from "react";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import Aurora from "./ReactBits/Aurora/Aurora";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log("is authenticated", isAuthenticated);
  console.log("user", user);
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-black">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

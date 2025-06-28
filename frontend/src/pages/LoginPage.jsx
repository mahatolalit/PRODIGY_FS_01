import React from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-700 bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center bg-[#e6e6e6] text-transparent bg-clip-text mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-white/80 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            className="w-full py-3 bg-[#e6e6e6] text-black font-semibold rounded-lg shadow-md focus:outline-none transition duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            Log In
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-700 bg-opacity-20 flex justify-center">
        <p className="text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#3972c9] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;

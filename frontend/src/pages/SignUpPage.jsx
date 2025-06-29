import React from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [fullName, setfullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
  const navigate = useNavigate();
  const {signup, error, isLoading} = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, fullName);
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-700 bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="mb-6 text-3xl font-bold text-center bg-gradient-to-r from-[#ddeeff] via-[#def0fd] to-[#bdc3c7] text-transparent bg-clip-text">
          Create an Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
          />
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

          {error && (
            <p className="text-red-500 font-semibold mt-2">{error}</p>
          )}
          <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isPasswordFocused ? 'opacity-100 scale-100 blur-0 max-h-40' : 'opacity-0 scale-95 blur-sm max-h-0'}`}
            >
                <PasswordStrengthMeter password={password} />
            </div>
          

          <motion.button
            className="mt-5 w-full py-3 bg-[#e6e6e6] text-black font-semibold rounded-lg shadow-md focus:outline-none transition duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !fullName || !email || !password}
          >
            {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-700 bg-opacity-20 flex justify-center">
        <p className="text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-[#3972c9] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;

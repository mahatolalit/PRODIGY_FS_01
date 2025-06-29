import { motion } from "framer-motion";
import Aurora from "../ReactBits/Aurora/Aurora";

const LoadingSpinner = () => {
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
            <motion.div
                className="w-16 h-16 border-4 border-t-4 border-t-[#e6e6e6] border-[#e6e6e6]/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default LoadingSpinner;
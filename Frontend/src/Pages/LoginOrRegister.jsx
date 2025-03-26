import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HoneycombBackground from "../components/HoneyCombBg.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import "./LoginOrRegister.css";

function App() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
            <HoneycombBackground />

            <AnimatePresence mode="wait">
                {isLogin ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute z-11 w-[600px] h-[400px] bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg shadow-lg flex items-center justify-center"
                    >
                        <Login setIsLogin={setIsLogin} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute z-10 w-[600px] h-[400px] bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg shadow-lg flex items-center justify-center"
                    >
                        <Register setIsLogin={setIsLogin} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;

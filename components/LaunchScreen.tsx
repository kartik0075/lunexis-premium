"use client";
import { motion } from "framer-motion";

export default function LaunchScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-black text-white flex items-center justify-center text-4xl z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      Lunexis
    </motion.div>
  );
}
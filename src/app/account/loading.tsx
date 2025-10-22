"use client";
import { motion } from "framer-motion";

export default function GlobalLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-bg-primary text-primary-text z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full"
      />
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-6 text-lg font-semibold tracking-wide"
      >
        Loading...
      </motion.h2>
    </motion.div>
  );
}
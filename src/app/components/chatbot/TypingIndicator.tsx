"use client";

import { motion } from "motion/react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 p-3.5 bg-[#F7F5F2] rounded-2xl rounded-tl-sm w-fit max-w-[80%] border border-black/[0.04]">
      <motion.div
        className="w-1.5 h-1.5 bg-[#6B7280] rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-[#6B7280] rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-[#6B7280] rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      />
    </div>
  );
}

'use client'
// app/loading.tsx — Global loading UI (shown during route transitions)
import Image from "next/image"
import {motion} from 'framer-motion'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0B0E]">
      <div className="flex flex-col items-center gap-2">
        {/* Animated logo */}
        <motion.div 
           initial={{ opacity:0 }}
           animate={{ opacity:1 }}  
           transition={{ duration:0.5, ease:'easeOut' }}
          className="w-96 h-96 flex items-center justify-center">
          <Image src="/logo.png" alt="logo" width={300} height={300} />
        </motion.div>
        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-[#2A3348] border-t-[#4F8EF7] rounded-full animate-spin" />
        <p className="text-xs text-[#5C6882] tracking-wider uppercase">Loading</p>
      </div>
    </div>
  );
}

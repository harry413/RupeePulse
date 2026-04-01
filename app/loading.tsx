// app/loading.tsx — Global loading UI (shown during route transitions)

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0B0E]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-[#0A0B0E] animate-pulse"
          style={{ background: 'linear-gradient(135deg, #00D4A0, #4F8EF7)' }}
        >
          R
        </div>
        {/* Spinner */}
        <div className="w-6 h-6 border-2 border-[#2A3348] border-t-[#4F8EF7] rounded-full animate-spin" />
        <p className="text-xs text-[#5C6882] tracking-wider uppercase">Loading</p>
      </div>
    </div>
  );
}

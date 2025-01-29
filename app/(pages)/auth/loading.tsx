export default function () {
  return (
    <div
      className="bg-[rgba(255,255,255,0.025)] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.04)] 
    ring-1 ring-[rgba(255,255,255,0.025)] flex flex-col max-w-[460px] p-5 gap-4 w-full mx-auto mt-10"
    >
      <div className="w-24 h-6 bg-gray-700 rounded-md mx-auto animate-pulse" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-700 rounded-md animate-pulse" />
          <div className="flex-1 h-10 bg-gray-700 rounded-md animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-700 rounded-md animate-pulse" />
          <div className="flex-1 h-10 bg-gray-700 rounded-md animate-pulse" />
        </div>

        <div className="w-full h-10 bg-gray-700 rounded-md animate-pulse" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-grow h-px bg-gray-700" />
        <div className="w-8 h-4 bg-gray-700 rounded animate-pulse" />
        <div className="flex-grow h-px bg-gray-700" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full h-10 bg-gray-700 rounded-md animate-pulse" />

        <div className="w-full h-10 bg-gray-700 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

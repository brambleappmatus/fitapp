export default function GoalsProgress() {
  const progress = 75; // Example progress percentage

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Goals</h3>
      <div className="relative">
        <svg className="w-32 h-32" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray={`${progress}, 100`}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-2xl font-bold text-gray-800">{progress}m</span>
          <span className="block text-sm text-gray-500">Goal</span>
        </div>
      </div>
    </div>
  );
}
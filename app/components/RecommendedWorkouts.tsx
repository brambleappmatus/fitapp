export default function RecommendedWorkouts() {
  const workouts = [
    {
      title: 'Fitness For Beginners',
      trainer: 'Kevin Reynolds',
      duration: '25m'
    },
    {
      title: 'HIIT & Fitness Expertise',
      trainer: 'Justin Sanders',
      duration: '45m'
    },
    {
      title: 'Advanced Gym',
      trainer: 'Elizabeth Oliver',
      duration: '35m'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recommended</h3>
        <button className="text-sm text-blue-600">View all</button>
      </div>
      <div className="space-y-4">
        {workouts.map((workout, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800">
                {workout.title}
              </h4>
              <p className="text-xs text-gray-500">{workout.trainer}</p>
            </div>
            <span className="text-sm text-gray-500">{workout.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
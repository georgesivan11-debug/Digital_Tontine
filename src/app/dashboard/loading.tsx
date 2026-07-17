export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="h-8 bg-gray-200 dark:bg-blue-900/50 rounded-lg w-1/4 mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-gray-200 dark:bg-blue-900/50 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 dark:bg-blue-900/50 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 dark:bg-blue-900/50 rounded-2xl"></div>
      </div>
      
      <div className="h-[400px] bg-gray-200 dark:bg-blue-900/50 rounded-2xl mt-8"></div>
    </div>
  );
}

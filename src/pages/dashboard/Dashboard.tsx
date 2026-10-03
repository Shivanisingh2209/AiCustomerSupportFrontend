const Dashboard = () => {
  const userName = localStorage.getItem("userName");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-purple-700">
        Dashboard
      </h1>

      <p className="mt-3 text-gray-600">
        Welcome {userName || "User"}
      </p>
    </div>
  );
};

export default Dashboard;
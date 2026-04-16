function StatCard({ title, value, color = "pink" }: any) {
  const colors: any = {
    pink: "text-pink-600",
    green: "text-green-500",
    yellow: "text-yellow-500",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-pink-100">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className={`text-2xl font-bold ${colors[color]}`}>{value}</h2>
    </div>
  );
}
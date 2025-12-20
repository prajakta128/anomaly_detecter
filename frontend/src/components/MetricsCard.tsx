interface MetricsCardProps {
  title: string;
  value: string | number;
  colorClass?: string; // optional background color
}

export default function MetricsCard({ title, value, colorClass = "bg-blue-100" }: MetricsCardProps) {
  return (
    <div className={`${colorClass} p-4 rounded-lg shadow-lg text-center transition transform hover:scale-105`}>
      <span className="block text-gray-700 font-medium">{title}</span>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

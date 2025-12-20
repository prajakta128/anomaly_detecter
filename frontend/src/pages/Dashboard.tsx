import { useState } from "react";
import { saveAs } from "file-saver"; // make sure file-saver is installed: pnpm add file-saver

// Metric Card Component
const MetricCard = ({ title, value, textColor }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
    <span className={`block font-semibold mb-2 ${textColor}`}>{title}</span>
    <h3 className={`text-3xl font-bold ${textColor}`}>{value}</h3>
  </div>
);

// Graph Card Component
const GraphCard = ({ title, src }: any) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    <img src={src} alt={title} className="rounded-md w-full h-auto" />
  </div>
);

function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [graphs, setGraphs] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const uploadCSV = async () => {
    if (!file) return alert("Please select a CSV file.");
    setStatus("Uploading and analyzing...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) return setStatus("Error: " + data.error);
      setMetrics({
        total: data.total_transactions,
        anomalies: data.anomaly_count,
        risk: data.high_risk_percent,
      });
      setGraphs(data.graphs);
      setStatus("Analysis complete!");
    } catch (err) {
      console.error(err);
      setStatus("Error processing file.");
    }
  };

  const downloadCSV = () => {
    if (!metrics) return;
    const csvContent = `Total Transactions,${metrics.total}\nAnomalies Detected,${metrics.anomalies}\nHigh Risk %,${metrics.risk}\n`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "analysis_metrics.csv");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* Header */}
      <header className="max-w-6xl mx-auto text-center py-8">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
          Fraud & Anomaly Detection Dashboard
        </h1>
        <p className="text-gray-600 text-lg">CSV-based Transaction Risk Analysis</p>
      </header>

      {/* Upload Section */}
      <section className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Transaction CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-4 block w-full text-gray-700"
        />
        <button
          onClick={uploadCSV}
          className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition mb-3"
        >
          Analyze Transactions
        </button>
        {metrics && (
          <button
            onClick={downloadCSV}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Download Metrics CSV
          </button>
        )}
        <p className="mt-3 text-gray-700 font-medium">{status}</p>
      </section>

      {/* Metrics Section */}
      {metrics && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          <MetricCard title="Total Transactions" value={metrics.total} textColor="text-gray-900" />
          <MetricCard title="Anomalies Detected" value={metrics.anomalies} textColor="text-red-600" />
          <MetricCard title="High Risk %" value={`${metrics.risk}%`} textColor="text-yellow-600" />
        </section>
      )}

      {/* Graphs Section */}
      {graphs && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          <GraphCard title="Risk Score Distribution" src={`http://127.0.0.1:5000${graphs.risk_distribution}`} />
          <GraphCard title="Amount vs Risk" src={`http://127.0.0.1:5000${graphs.amount_vs_risk}`} />
          <GraphCard title="Anomaly Breakdown" src={`http://127.0.0.1:5000${graphs.anomaly_pie}`} />
          <GraphCard title="Risk Level Count" src={`http://127.0.0.1:5000${graphs.risk_bar}`} />
          <GraphCard title="Transaction Frequency Over Time" src={`http://127.0.0.1:5000${graphs.time_series}`} />
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-gray-500 mb-6">
        ML-powered anomaly & fraud detection system
      </footer>
    </div>
  );
}

export default Dashboard;

import { useState } from "react";
import { uploadCSV } from "../services/api";

type UploadResult = {
  total_transactions: number;
  anomaly_count: number;
  high_risk_percent: number;
  graphs: {
    risk_distribution: string;
    amount_vs_risk: string;
    anomaly_pie: string;
    risk_bar: string;
    time_series: string;
  };
};

type Props = {
  onResult: (data: UploadResult) => void;
};

const UploadCSV = ({ onResult }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await uploadCSV(file);
      onResult(data);
    } catch (err) {
      setError("Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h2>Upload Transactions CSV</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br />
      <br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UploadCSV;

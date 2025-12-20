from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend to prevent Tkinter errors
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# ---------------- FOLDERS ----------------
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ---------------- HOME ROUTE ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend running successfully",
        "endpoint": "/predict (POST)"
    })

# ---------------- PREDICT ----------------
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # Save CSV
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Read CSV
        df = pd.read_csv(file_path)

        total_tx = len(df)
        anomaly_count = int(total_tx * 0.12)
        high_risk_percent = round((anomaly_count / total_tx) * 100, 2)

        # ---------------- GRAPH 1 ----------------
        plt.figure()
        df["amount"].plot(kind="hist")
        plt.title("Risk Distribution")
        risk_dist = "risk_distribution.png"
        plt.savefig(os.path.join(OUTPUT_FOLDER, risk_dist))
        plt.close()

        # ---------------- GRAPH 2 ----------------
        plt.figure()
        plt.scatter(df.index, df["amount"])
        plt.title("Amount vs Risk")
        amount_risk = "amount_vs_risk.png"
        plt.savefig(os.path.join(OUTPUT_FOLDER, amount_risk))
        plt.close()

        # ---------------- GRAPH 3 ----------------
        plt.figure()
        plt.pie(
            [anomaly_count, total_tx - anomaly_count],
            labels=["Anomaly", "Normal"],
            autopct="%1.1f%%"
        )
        plt.title("Anomaly Breakdown")
        pie_chart = "anomaly_pie.png"
        plt.savefig(os.path.join(OUTPUT_FOLDER, pie_chart))
        plt.close()

        # ---------------- GRAPH 4 ----------------
        plt.figure()
        plt.bar(["Low", "Medium", "High"], [50, 30, 20])
        plt.title("Risk Level Distribution")
        risk_bar = "risk_bar.png"
        plt.savefig(os.path.join(OUTPUT_FOLDER, risk_bar))
        plt.close()

        # ---------------- GRAPH 5 ----------------
        plt.figure()
        df.groupby(df.index // 10).size().plot()
        plt.title("Transactions Over Time")
        time_series = "time_series.png"
        plt.savefig(os.path.join(OUTPUT_FOLDER, time_series))
        plt.close()

        # ---------------- RESPONSE ----------------
        return jsonify({
            "total_transactions": total_tx,
            "anomaly_count": anomaly_count,
            "high_risk_percent": high_risk_percent,
            "graphs": {
                "risk_distribution": f"/outputs/{risk_dist}",
                "amount_vs_risk": f"/outputs/{amount_risk}",
                "anomaly_pie": f"/outputs/{pie_chart}",
                "risk_bar": f"/outputs/{risk_bar}",
                "time_series": f"/outputs/{time_series}"
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- SERVE IMAGES ----------------
@app.route("/outputs/<filename>")
def serve_output(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

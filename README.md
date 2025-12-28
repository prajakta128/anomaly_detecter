# Anomaly Detector Prototype 🔍

**Simple and friendly guide for technical and non-technical users**

---

## What is this project? 💡
An easy-to-use prototype that finds unusual or suspicious transactions in a CSV file (for example, payment or banking transactions). The system flags possible fraud and gives a simple explanation and a risk score so you can review the most concerning transactions quickly.

- Built with a Python backend (Flask) that analyzes data and a React + Vite frontend for uploading files and viewing results.
- Example data files are included in `backend/uploads/` so you can try the app right away.

---

## Who is this for? 🎯
- Non-technical users: You can upload a CSV file and see which transactions might be risky — no coding required.
- Technical users: Developers and data scientists can run and modify the model, add features, or integrate it into other systems.

---

## Quick overview (non-technical explanation) 🧠
- Imagine the system as a smart auditor that reads a list of transactions, looks for patterns that don't match a user's normal activity (like an unusually large purchase, sudden activity from a different country, or many rapid transactions), and ranks them by how risky they look.
- The system uses several automated checks (an ensemble of models) and produces simple outputs: a risk score (0–100), a short human-readable explanation, and summary graphs.

---

## What you get (high-level features) ✅
- Upload CSV of transactions and run an automatic analysis
- Risk scores and human-friendly explanations for flagged transactions
- Summary report (JSON) and a detailed results CSV
- Helpful visuals (PNG charts) saved to `backend/outputs/`
- Designed to work with optional extra columns (geolocation, IP, device info) to improve detection

---

## Quick start — run locally (Windows) 🛠️
### Prerequisites
- Python 3.8+ and pip
- Node.js and npm (or pnpm if you prefer)

### Backend (Python / Flask)
1. Open PowerShell and go to the backend folder:
   ```powershell
   cd backend
   ```
2. Create a virtual environment and activate it (PowerShell):
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   (If activation is blocked: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`)

3. Install Python dependencies:
   ```powershell
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```powershell
   python app.py
   ```
   The backend will be available at: `http://127.0.0.1:5000`

### Frontend (React + Vite)
1. Open a new terminal and go to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install Node dependencies:
   ```powershell
   npm install
   # or, if the project uses pnpm: pnpm install
   ```
3. Start the dev server:
   ```powershell
   npm run dev
   # or pnpm dev
   ```
   The frontend will usually run on `http://localhost:5173` (Vite default).

---

## How to use the app (once running) 🧭
1. Open the frontend in your browser (e.g., `http://localhost:5173`).
2. Use the **Upload** component to choose a transactions CSV file (or use one of the sample files in `backend/uploads/`).
3. Click **Upload & Analyze**. The backend returns a summary and links to several graphs saved in `backend/outputs/`.
4. Download the detailed results CSV (saved by backend model code if you run the model directly) to review flagged transactions and explanations.

---

## Data & CSV format (what's expected) 📄
Minimum columns required:
- `user_id` — identifies the account or person
- `transaction_amount` — amount of the transaction
- `timestamp` (or `transaction_time`) — when it happened

Optional columns that improve detection:
- `merchant_id`, `merchant_category`, `country`, `latitude`, `longitude`, `device_id`, `ip_address`, `failed_login_attempts`, `is_new_payee`, etc.

Tip: Sample CSVs are in `backend/uploads/` (e.g., `fraud_raw_transactions.csv`) — use these to test quickly.

---

## How it works (technical summary) ⚙️
- Preprocessing: standardizes timestamps and important column names
- Feature engineering: builds many features (amount transforms, timing features, velocity windows, geo checks, device/IP signals)
- Models: an unsupervised ensemble — Isolation Forest, DBSCAN, and Elliptic Envelope — votes to decide anomalies
- Scoring: a risk score (0–100) that combines model confidence and rule-based penalties (e.g., impossible travel, many failed logins)
- Explanations: short human-readable reasons for flagged transactions (e.g., "Impossible travel detected", "Unusually high amount")
- Outputs: CSV with `risk_score`, `is_anomaly`, `explanation`, a JSON report, and charts

---

## Troubleshooting & common fixes ⚠️
- If `npm start` fails, use the correct Vite script: `npm run dev`.
- If Python packages fail to install, upgrade pip and retry: `python -m pip install --upgrade pip` then `pip install -r requirements.txt`.
- On Windows PowerShell, if you cannot run activation script: set execution policy (one-time):
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
  ```
- If frontend can't reach backend, ensure the backend is running at `127.0.0.1:5000` and CORS is enabled (the Flask app already enables CORS).
- If ports are in use, either stop the conflicting process or run the server on a different port.

---

## Where files are saved 🗂️
- Uploaded CSVs: `backend/uploads/`
- Generated charts and immediate outputs: `backend/outputs/`
- Model example output (CSV/JSON) when running `anomaly_model.py` directly: `fraud_detection_results.csv`, `*_report.json`, and `*_HIGH_RISK.csv` in the working directory

---

## For developers: notes & tips 🔧
- Main model logic: `backend/model/anomaly_model.py` — you can run it directly to run a full analysis on `fraud_raw_transactions.csv`.
- Backend API endpoints: `GET /` and `POST /predict` in `backend/app.py`.
- Frontend upload code lives in `frontend/src/components/UploadCSV.tsx` and calls `frontend/src/services/api.ts`.
- To add features: update `engineer_features` in the `EliteFraudDetector` class, then retrain.

---

## Contributing & contact 🤝
Contributions are welcome — open an issue or a pull request with a short description of the change. If you want help improving the README or adding a quick demo, say so and I'll help outline it.

---

## License
This repository is provided as a prototype for learning and demonstration. If you want a license added, specify one (e.g., MIT) and it can be added.

---

Thank you for trying the Anomaly Detector Prototype! If you'd like, I can also add a short demo GIF, a quick video walkthrough, or a CONTRIBUTING.md file — tell me which one and I'll prepare it. ✨

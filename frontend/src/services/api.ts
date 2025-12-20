import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Upload CSV file to Flask backend
 */
export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default api;

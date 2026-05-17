import axios from "axios";

const BASE_URL = "http://localhost:8000/api/habit";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAllHabits = () => api.get("/getall");
export const createHabit = (data) => api.post("/create", data);
export const updateHabit = (id, data) => api.put(`/update/${id}`, data);
export const deleteHabit = (id) => api.delete(`/delete/${id}`);
export const checkinHabit = (id) => api.post(`/checkin/${id}`, { date: new Date().toISOString().split("T")[0] });

export default api;

// Frontend/src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <- должен быть установлен в Vercel
  withCredentials: true, // если бекенд использует куки/сессии
});

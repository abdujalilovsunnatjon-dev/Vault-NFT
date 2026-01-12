import axios from "axios";


export const api = axios.create({
  baseURL: "https://vault-nft-backend.onrender.com",
  withCredentials: true,
});

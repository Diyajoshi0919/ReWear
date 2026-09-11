import axios from "axios";

const API = axios.create({
  baseURL: "https://rewearserverlatest.onrender.com/api", // ⚠️ Your backend running port
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

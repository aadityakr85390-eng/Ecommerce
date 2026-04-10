import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API?.replace(/\/+$/, "") || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE,
  // For local dev, cookies aren't required. Keeping this false avoids
  // opaque CORS/network errors in some Windows setups.
  withCredentials: false,
});


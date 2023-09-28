import axios from "axios";

let URL: string;
if (process.env.NODE_ENV !== "production") {
  URL = "http://127.0.0.1:5000/api/v1";
} else {
  URL = `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/v1`;
}

const api = axios.create({
  baseURL: URL,
});

export default api;

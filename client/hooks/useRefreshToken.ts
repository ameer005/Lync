import axios from "axios";
import useStore from "../store/useStore";

let URL = `${process.env.BACKEND_URL}/api/v1`;

if (process.env.NODE_ENV !== "production") {
  URL = "http://127.0.0.1:5000/api/v1";
}

const useRefreshToken = () => {
  const setToken = useStore((state) => state.setToken);
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const refresh = async () => {
    try {
      const response = await api.get("/auth/refresh");
      setToken(response.data.token);

      return response.data.token;
    } catch (err) {
      console.log(err);
    }
  };

  return refresh;
};

export default useRefreshToken;

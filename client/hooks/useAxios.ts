import axios from "axios";
import useStore from "../store/useStore";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

let URL: string;
if (process.env.NODE_ENV !== "production") {
  URL = "http://127.0.0.1:5000/api/v1";
} else {
  URL = `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/v1`;
}

const useAxios = () => {
  const token = useStore((state) => state.token);
  const removeUser = useStore((state) => state.removeUser);
  const refresh = useRefreshToken();

  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevReq = error?.config;
        if (error.response.status === 401 && !prevReq?.sent) {
          prevReq.sent = true;
          const newAccessToken = await refresh();
          prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(prevReq);
        }

        if (error.response.status !== 401) {
          return Promise.reject(error);
        }

        removeUser();
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refresh, token]);

  return api;
};

export default useAxios;

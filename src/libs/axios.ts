// libs/axios.ts
import axios from "axios";
import i18n from "./i18n";
// import { notification } from "ant-design-vue";

const { getCookie } = useCookie();

const locale = i18n.global.locale.value || "uz";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    "Accept-Language": locale,
  },
});

http.interceptors.request.use(
  (config) => {
    const token = getCookie("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // notification.error({
    //   description:
    //     (error.response?.data?.error as string) || "An error occurred",
    // } as any);
    console.error('HTTP Error:', error.response?.data?.error || "An error occurred");
    return Promise.reject(error);
  }
);

export default http;

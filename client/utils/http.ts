import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const http = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    let accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    if (accessToken && refreshToken) {
      config.headers["access-token"] = accessToken;
      config.headers["refresh_token"] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    console.log(response);

    // 处理响应数据
    if (response.status === 200 || 201) {
      return response; // 直接返回 data 部分
    } else {
      const errorMessage = response.data?.message || "请求失败";
      throw new Error(errorMessage);
    }
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error.response?.data?.message || error.message);
  }
);

export default http;

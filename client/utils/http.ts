import axios, { AxiosResponse, AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "@/constants/env";

interface UserData {
  __v: number;
  _id: string;
  avatar: {
    public_id: string;
    url: string;
  };
  createdAt: string;
  email: string;
  isVerified: boolean;
  name: string;
  products: any[]; // 根据需要定义具体的产品类型
  role: string;
  updatedAt: string;
}

export interface ApiResponse extends AxiosResponse {
  data: any;
  message: string;
  success: boolean;
}

const http: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    const userString = await AsyncStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      config.headers["access-token"] = user?.access_token || "";
      config.headers["refresh-token"] = user?.refresh_token || "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 处理响应数据
    if (response.status === 200 || 201) {
      return response.data; // 直接返回 data 部分
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

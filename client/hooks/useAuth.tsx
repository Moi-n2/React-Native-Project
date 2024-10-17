import React, { useEffect, useState } from "react";
import http, { ApiResponse } from "@/utils/http";
import useStore from "@/utils/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Avatar {
  public_id: string;
  url: string;
}

export interface User {
  __v: number;
  _id: string;
  avatar: Avatar;
  createdAt: string;
  email: string;
  isVerified: boolean;
  name: string;
  products: any[]; // 根据需要定义具体的产品类型
  role: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  cart: [];
  address: [];
  access_token: string;
  refresh_token: string;
  orders: [];
}

export default function useAuth() {
  // const [loading, setLoading] = useState<boolean>(false);
  const { setLoading, setUser } = useStore();
  // const [user, setUser] = useState<User | null>(null);
  // const [error, setError] = useState<string>("");

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const res: ApiResponse = await http.get("/me");
      if (res.success) {
        const data = res.data;
        if (data.length) {
          setUser(data);
        }

        setLoading(false);
      }
    } catch (error) {
      setUser(null);
      setLoading(false);
    }
  };

  return { fetchUserInfo };
}

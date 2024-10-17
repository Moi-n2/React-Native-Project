import http, { ApiResponse } from "@/utils/http";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Product } from "./useProduct";

export default function useDetail() {
  const { id } = useLocalSearchParams();
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState<string>("");
  const [detail, setDetail] = useState<Product | null>(null);

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setIsloading(true);
      const res: ApiResponse = await http.get(`/product/${id}`);

      if (res.success) {
        setDetail(res.data);
        setIsloading(false);
      }
    } catch (error) {
      setError(error as string);
      setIsloading(false);
    }
  };
  return { isloading, error, detail, setIsloading };
}

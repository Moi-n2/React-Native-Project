import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import Loader from "@/components/Loader";
import useStore from "@/utils/store";
import useAuth from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function index() {
  const { loading, user } = useStore();
  const { fetchUserInfo } = useAuth();
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        // <Redirect href="/(routes)/my-order" />
        <Redirect href={!user ? "/(routes)/welcome" : "/(tabs)/home"} />
      )}
    </>
  );
}

import { View, Text } from "react-native";
import React, { useState } from "react";
import { Redirect } from "expo-router";
import Loader from "@/components/Loader";

export default function index() {
  const [loading, setloading] = useState(false);
  const [islogin, setIslogin] = useState(false);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Redirect href={"/(routes)/login"} />
        // <Redirect href={!islogin ? "/(routes)/welcome" : "/(tabs)"} />
      )}
    </>
  );
}

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Button, Pressable, Text, View } from "react-native";
import "react-native-reanimated";
import { ToastProvider } from "react-native-toast-notifications";
import Ionicons from "@expo/vector-icons/Ionicons";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Prata: require("../assets/fonts/Prata-Regular.ttf"),
    OutFitBlack: require("../assets/fonts/Outfit-Black.ttf"),
    OutfitRegular: require("../assets/fonts/Outfit-Regular.ttf"),
    OutfitBold: require("../assets/fonts/Outfit-Bold.ttf"),
    OutfitExtraBold: require("../assets/fonts/Outfit-ExtraBold.ttf"),
    OutfitExtraLight: require("../assets/fonts/Outfit-ExtraLight.ttf"),
    OutfitLight: require("../assets/fonts/Outfit-Light.ttf"),
    OutfitMedium: require("../assets/fonts/Outfit-Medium.ttf"),
    OutfitSemiBold: require("../assets/fonts/Outfit-SemiBold.ttf"),
    OutfitThin: require("../assets/fonts/Outfit-Thin.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(routes)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ToastProvider>
  );
}

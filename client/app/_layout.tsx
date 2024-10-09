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
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Prata: require("../assets/fonts/Prata-Regular.ttf"),
    OutFitBlack: require("../assets/fonts/Outfit-Black.ttf"),
    OutfitRegular: require("../assets/fonts/Outfit-Regular.ttf"),
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
        <Stack.Screen name="(routes)/welcome" />
        <Stack.Screen name="(routes)/login" />
        <Stack.Screen name="(routes)/sign-up" />
        <Stack.Screen name="(routes)/forgot-password" />
        <Stack.Screen
          name="(routes)/verify-account"
          options={() => ({
            title: "",
            headerLeft: () => (
              <Pressable
                onPress={() => router.back()}
                className="flex-row justify-between items-center text-center "
              >
                <Ionicons name="chevron-back" size={22} color="black" />
                <Text className="text-lg self-end">Back</Text>
              </Pressable>
            ),
            headerShown: true,
          })}
        />
      </Stack>
    </ToastProvider>
  );
}

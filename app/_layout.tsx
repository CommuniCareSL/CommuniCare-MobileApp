import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import { NavigationContainer } from '@react-navigation/native';

// Import i18n setup and the I18nextProvider
import { I18nextProvider } from "react-i18next";
import i18n from "../hooks/i18n";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

    const [fontsLoaded, error] = useFonts({
      "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="complaintdetails/[complaintid]" options={{ headerShown: false }} />       
        </Stack>
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default RootLayout;

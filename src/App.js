import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import AppRoutes from "../src/router/AppRoutes";

export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
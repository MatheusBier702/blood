import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import AppRoutes from "../src/router/AppRoutes";
import { GlobalContext, GlobalStorage } from "./pages/IMC/ContextGlobal";

export default function App() {
  return (
    <GlobalStorage>
      <NavigationContainer>
        <AppRoutes />
        <StatusBar style="auto" />
      </NavigationContainer>
    </GlobalStorage>
  );
}

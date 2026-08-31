import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Imc from "../pages/IMC/Imc";
import Home from "../pages/Home";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Imc"
        component={Imc}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

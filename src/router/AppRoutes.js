import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Imc from "../pages/IMC/Imc";
import Home from "../pages/Home";
import { Agua } from "../pages/Agua/agua";
import { Sangue } from "../pages/Sangue/sangue";
import { Remedio } from "../pages/Remedio/remedio";
import { Alergias } from "../pages/Alergias/alergias";
import { Glicemia } from "../pages/Glicemia/glicemia";
import { Pressao } from "../pages/Pressao/pressao";
import { Vacinas } from "../pages/Vacinas/vacinas";
import { Meditacao } from "../pages/Meditacao/meditacao";
import { Frutas } from "../pages/Frutas/frutas";
import { Dica } from "../pages/Dica/dica";
import { Emergencia } from "../pages/Emergencia/emergencia";
import GlobalStorageAgua from '../pages/Agua/GlobalContextAgua'

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
      <Stack.Screen
        name="Agua"
        component={Agua}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Sangue"
        component={Sangue}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Remedio"
        component={Remedio}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Alergias"
        component={Alergias}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Glicemia"
        component={Glicemia}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Pressao"
        component={Pressao}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Vacinas"
        component={Vacinas}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Meditacao"
        component={Meditacao}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Fruta"
        component={Frutas}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Dica"
        component={Dica}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Emergencia"
        component={Emergencia}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
}

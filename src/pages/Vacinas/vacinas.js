import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalStorageVacinas } from "./GlobalContextVacinas";
import { VisaoGeral } from "./VisaoGeral/VisaoGeral";
import { DetalheVacina } from "./DetalheVacina/DetalheVacina";
import { ProximasDoses } from "./ProximasDoses/ProximasDoses";
import { HistoricoVacinas } from "./HistoricoVacinas/HistoricoVacinas";
import { RegistrarAplicacao } from "./RegistrarAplicacao/RegistrarAplicacao";

// A rota "Vacinas" do AppRoutes abre esta pilha interna (mesmo padrão das abas
// Alergias, Glicemia e Pressão): as telas compartilham o mesmo contexto e o botão
// voltar do Header funciona normalmente (da primeira tela, volta para a Home).
const Stack = createNativeStackNavigator();

export const Vacinas = () => {
  return (
    <GlobalStorageVacinas>
      <Stack.Navigator initialRouteName="VacinasInicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="VacinasInicio" component={VisaoGeral} />
        <Stack.Screen name="DetalheVacina" component={DetalheVacina} />
        <Stack.Screen name="ProximasDoses" component={ProximasDoses} />
        <Stack.Screen name="HistoricoVacinas" component={HistoricoVacinas} />
        <Stack.Screen name="RegistrarAplicacao" component={RegistrarAplicacao} />
      </Stack.Navigator>
    </GlobalStorageVacinas>
  );
};

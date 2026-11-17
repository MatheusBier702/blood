import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalStorageAlergias } from "./GlobalContextAlergias";
import { VisaoGeral } from "./VisaoGeral/VisaoGeral";
import { MinhasAlergias } from "./MinhasAlergias/MinhasAlergias";
import { DetalheAlergia } from "./DetalheAlergia/DetalheAlergia";
import { CadastroAlergia } from "./CadastroAlergia/CadastroAlergia";
import { HistoricoReacoes } from "./HistoricoReacoes/HistoricoReacoes";
import { Documentos } from "./Documentos/Documentos";
import { Alertas } from "./Alertas/Alertas";

// A rota "Alergias" do AppRoutes abre esta pilha interna. Assim todas as telas
// da aba compartilham o mesmo contexto e o botão voltar do Header funciona
// normalmente (da primeira tela, ele volta para a Home).
const Stack = createNativeStackNavigator();

export const Alergias = () => {
  return (
    <GlobalStorageAlergias>
      <Stack.Navigator initialRouteName="AlergiasInicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AlergiasInicio" component={VisaoGeral} />
        <Stack.Screen name="MinhasAlergias" component={MinhasAlergias} />
        <Stack.Screen name="DetalheAlergia" component={DetalheAlergia} />
        <Stack.Screen name="CadastroAlergia" component={CadastroAlergia} />
        <Stack.Screen name="HistoricoReacoes" component={HistoricoReacoes} />
        <Stack.Screen name="DocumentosAlergias" component={Documentos} />
        <Stack.Screen name="AlertasAlergias" component={Alertas} />
      </Stack.Navigator>
    </GlobalStorageAlergias>
  );
};

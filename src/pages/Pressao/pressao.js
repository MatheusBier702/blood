import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalStoragePressao } from "./GlobalContextPressao";
import { VisaoGeral } from "./VisaoGeral/VisaoGeral";
import { RegistrarPressao } from "./RegistrarPressao/RegistrarPressao";
import { HistoricoPressao } from "./HistoricoPressao/HistoricoPressao";
import { DetalhePressao } from "./DetalhePressao/DetalhePressao";
import { GraficoPressao } from "./Grafico/GraficoPressao";
import { RelatorioPressao } from "./Relatorio/RelatorioPressao";
import { AlertasPressao } from "./Alertas/AlertasPressao";
import { MetasPressao } from "./Metas/MetasPressao";

// A rota "Pressao" do AppRoutes abre esta pilha interna (mesmo padrão das abas
// Alergias e Glicemia): todas as telas compartilham o mesmo contexto e o botão
// voltar do Header funciona normalmente (da primeira tela, ele volta para a Home).
const Stack = createNativeStackNavigator();

export const Pressao = () => {
  return (
    <GlobalStoragePressao>
      <Stack.Navigator initialRouteName="PressaoInicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PressaoInicio" component={VisaoGeral} />
        <Stack.Screen name="RegistrarPressao" component={RegistrarPressao} />
        <Stack.Screen name="HistoricoPressao" component={HistoricoPressao} />
        <Stack.Screen name="DetalhePressao" component={DetalhePressao} />
        <Stack.Screen name="GraficoPressao" component={GraficoPressao} />
        <Stack.Screen name="RelatorioPressao" component={RelatorioPressao} />
        <Stack.Screen name="AlertasPressao" component={AlertasPressao} />
        <Stack.Screen name="MetasPressao" component={MetasPressao} />
      </Stack.Navigator>
    </GlobalStoragePressao>
  );
};

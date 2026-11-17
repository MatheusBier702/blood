import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalStorageGlicemia } from "./GlobalContextGlicemia";
import { VisaoGeral } from "./VisaoGeral/VisaoGeral";
import { RegistrarGlicemia } from "./RegistrarGlicemia/RegistrarGlicemia";
import { HistoricoGlicemia } from "./HistoricoGlicemia/HistoricoGlicemia";
import { DetalheMedicao } from "./DetalheMedicao/DetalheMedicao";
import { GraficoGlicemia } from "./Grafico/GraficoGlicemia";
import { RelatorioGlicemia } from "./Relatorio/RelatorioGlicemia";
import { MetasGlicemia } from "./Metas/MetasGlicemia";

// A rota "Glicemia" do AppRoutes abre esta pilha interna (mesmo padrão da aba
// Alergias): todas as telas compartilham o mesmo contexto e o botão voltar do
// Header funciona normalmente (da primeira tela, ele volta para a Home).
const Stack = createNativeStackNavigator();

export const Glicemia = () => {
  return (
    <GlobalStorageGlicemia>
      <Stack.Navigator initialRouteName="GlicemiaInicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GlicemiaInicio" component={VisaoGeral} />
        <Stack.Screen name="RegistrarGlicemia" component={RegistrarGlicemia} />
        <Stack.Screen name="HistoricoGlicemia" component={HistoricoGlicemia} />
        <Stack.Screen name="DetalheMedicao" component={DetalheMedicao} />
        <Stack.Screen name="GraficoGlicemia" component={GraficoGlicemia} />
        <Stack.Screen name="RelatorioGlicemia" component={RelatorioGlicemia} />
        <Stack.Screen name="MetasGlicemia" component={MetasGlicemia} />
      </Stack.Navigator>
    </GlobalStorageGlicemia>
  );
};

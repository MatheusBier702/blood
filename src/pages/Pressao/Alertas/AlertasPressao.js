import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { OrientacaoEmergencia } from "../CardPressao/CardPressao";
import { Botao, Link, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import {
  ORDEM_ALERTAS,
  REFERENCIAS,
  TIPOS_ALERTA,
  formatarDataHora,
  formatarFrequencia,
  formatarPressao,
  rotuloContexto,
  rotuloSintoma,
  temMetas,
} from "../dadosPressao";

const FILTROS = [
  { valor: "pendentes", rotulo: "Pendentes" },
  { valor: "todos", rotulo: "Histórico completo" },
];

export const AlertasPressao = ({ navigation }) => {
  const { alertas, alertasPendentes, marcarAlertaVisto, metas } = React.useContext(GlobalContextPressao);
  const [filtro, setFiltro] = React.useState("pendentes");
  const [tipo, setTipo] = React.useState("todos");

  const base = filtro === "pendentes" ? alertasPendentes : alertas;
  const lista = base.filter((a) => tipo === "todos" || a.tipo === tipo);
  const urgentePendente = alertasPendentes.some((a) => a.tipo === "urgente");
  const tiposPresentes = ORDEM_ALERTAS.filter((t) => alertas.some((a) => a.tipo === t));

  return (
    <View style={styles.container}>
      <Header titulo="Alertas" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>ALERTAS E ACOMPANHAMENTO</Text>
          <Text style={styles.titulo}>Medições que merecem atenção</Text>
          <Text style={styles.subtitulo}>
            Avisos com base nas suas medições, nas suas metas e nas referências clínicas. Eles não são diagnóstico: uma
            medição isolada não define hipertensão.
          </Text>

          {urgentePendente && <OrientacaoEmergencia />}

          <View style={styles.painel}>
            <Text style={styles.cardNome}>Como os avisos funcionam</Text>
            <Text style={styles.cardTexto}>
              • Muito elevada: {REFERENCIAS.muitoElevada.sistolica}/{REFERENCIAS.muitoElevada.diastolica} mmHg ou mais.
            </Text>
            <Text style={styles.cardTexto}>
              • Baixa: menos de {REFERENCIAS.baixa.sistolica}/{REFERENCIAS.baixa.diastolica} mmHg.
            </Text>
            <Text style={styles.cardTexto}>• Sintomas como dor no peito ou falta de ar: procure atendimento imediato.</Text>
            <Text style={styles.cardTexto}>
              • Fora da meta: {temMetas(metas) ? "comparação com as metas do seu profissional de saúde." : "aparece depois que você cadastrar suas metas."}
            </Text>
            {!temMetas(metas) && (
              <View style={{ marginTop: 10 }}>
                <Link texto="Cadastrar metas" onPress={() => navigation.navigate("MetasPressao")} />
              </View>
            )}
          </View>

          <SeletorOpcoes opcoes={FILTROS} valor={filtro} onChange={setFiltro} />
          {tiposPresentes.length > 1 && (
            <SeletorOpcoes
              opcoes={[{ valor: "todos", rotulo: "Todos os tipos" }, ...tiposPresentes.map((t) => ({ valor: t, rotulo: TIPOS_ALERTA[t].rotulo }))]}
              valor={tipo}
              onChange={setTipo}
            />
          )}
          <Text style={[styles.legenda, { marginTop: 8, marginBottom: 10 }]}>
            {lista.length} {lista.length === 1 ? "alerta" : "alertas"}
          </Text>

          {lista.length === 0 ? (
            <Vazio
              texto={
                filtro === "pendentes"
                  ? "Nenhum alerta pendente. Continue registrando suas medições."
                  : "Nenhuma medição gerou alerta até agora."
              }
            />
          ) : (
            lista.map(({ medicao, tipo: t, visto }) => {
              const info = TIPOS_ALERTA[t];
              return (
                <View
                  key={medicao.id}
                  style={[styles.alerta, { backgroundColor: info.fundo, borderColor: info.fundo }, visto && styles.alertaVisto]}
                >
                  <Text style={[styles.alertaTitulo, { color: info.texto }]}>
                    {info.rotulo}
                    {visto ? " · visto" : ""}
                  </Text>
                  <Text style={[styles.alertaValor, { color: info.texto }]}>{formatarPressao(medicao)} mmHg</Text>
                  <Text style={[styles.legenda, { color: info.texto }]}>
                    {formatarDataHora(medicao)} · {rotuloContexto(medicao.contexto)}
                    {formatarFrequencia(medicao) ? ` · FC ${formatarFrequencia(medicao)}` : ""}
                  </Text>
                  {(medicao.sintomas || []).length > 0 && (
                    <Text style={[styles.alertaTexto, { color: info.texto, fontWeight: "700" }]}>
                      Sintomas: {medicao.sintomas.map(rotuloSintoma).join(", ")}
                    </Text>
                  )}
                  <Text style={[styles.alertaTexto, { color: info.texto }]}>{info.orientacao}</Text>
                  {!!medicao.observacoes && (
                    <Text style={[styles.alertaTexto, { color: color.textoSuave }]}>Obs.: {medicao.observacoes}</Text>
                  )}
                  <View style={styles.cardAcoes}>
                    <Link texto="Ver medição" onPress={() => navigation.navigate("DetalhePressao", { id: medicao.id })} />
                    <Link
                      texto={visto ? "Marcar como pendente" : "Marcar como visto"}
                      onPress={() => marcarAlertaVisto(medicao.id, !visto)}
                    />
                  </View>
                </View>
              );
            })
          )}

          <Botao texto="+ Registrar nova medição" variante="secundario" onPress={() => navigation.navigate("RegistrarPressao")} />
        </View>
      </ScrollView>
    </View>
  );
};

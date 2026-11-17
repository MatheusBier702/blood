import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/VacinasStyle";
import { GlobalContextVacinas } from "../GlobalContextVacinas";
import { CardVacina } from "../CardVacina/CardVacina";
import { DataNascimento } from "../DataNascimento/DataNascimento";
import { Aviso, Botao, Link, Secao, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import { FAIXAS, recomendacoesDaFaixa } from "../calendarioVacinas";
import { SITUACOES, descreverIdade } from "../situacaoVacinas";
import { formatarData } from "../../Alergias/dadosAlergias";

const FILTROS = [{ valor: "todas", rotulo: "Todas" }, ...Object.entries(SITUACOES).map(([valor, s]) => ({ valor, rotulo: s.rotulo }))];

export const VisaoGeral = ({ navigation }) => {
  const { perfil, idadeMeses, faixaAtual, situacoes, proximasDoses, faixa, setFaixa, carregando, erro, recarregar, aplicacoes } =
    React.useContext(GlobalContextVacinas);
  const [filtro, setFiltro] = React.useState("todas");
  const [editandoNascimento, setEditandoNascimento] = React.useState(false);

  const faixaInfo = FAIXAS.find((f) => f.valor === faixa) ?? FAIXAS[0];
  const lista = faixa ? recomendacoesDaFaixa(faixa) : [];
  const rotina = lista.filter((r) => r.tipo === "rotina");
  const especiais = lista.filter((r) => r.tipo === "especial");
  const passaFiltro = (r) => filtro === "todas" || situacoes[r.id]?.situacao === filtro;

  // O resumo conta só as vacinas de rotina: as especiais dependem de cada grupo.
  const contagem = Object.fromEntries(Object.keys(SITUACOES).map((s) => [s, 0]));
  rotina.forEach((r) => {
    contagem[situacoes[r.id].situacao] += 1;
  });

  const abrir = (recomendacao) => navigation.navigate("DetalheVacina", { id: recomendacao.id });

  const atalhos = [
    {
      rota: "ProximasDoses",
      titulo: "Próximas doses",
      texto: "Doses atrasadas e as próximas datas.",
      total: proximasDoses.length,
    },
    { rota: "HistoricoVacinas", titulo: "Histórico", texto: "Todas as aplicações e datas.", total: aplicacoes.length },
  ];

  return (
    <View style={styles.container}>
      <Header titulo="Vacinas" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>CALENDÁRIO DE VACINAÇÃO</Text>
          <Text style={styles.titulo}>Vacinas por faixa etária</Text>
          <Text style={styles.subtitulo}>
            Acompanhe as vacinas do Calendário Nacional de Vacinação do Ministério da Saúde e o andamento da sua
            caderneta.
          </Text>

          {!!erro && <Aviso erro texto={erro} acao={recarregar} rotuloAcao="Tentar de novo" />}

          {carregando ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={color.colorModelFour} />
            </View>
          ) : (
            <>
              <View style={styles.perfil}>
                <Image source={require("../../../screen/assets/vacina.png")} style={styles.perfilIcone} resizeMode="contain" />
                <View style={styles.perfilCorpo}>
                  <Text style={styles.cardNome}>{perfil?.nome || "Paciente"}</Text>
                  <Text style={styles.cardTexto}>
                    {perfil?.dataNascimento
                      ? `${descreverIdade(idadeMeses)} · nascimento em ${formatarData(perfil.dataNascimento)}`
                      : "Informe a data de nascimento para calcular a situação das vacinas."}
                  </Text>
                  {!!faixaAtual && (
                    <Text style={styles.legenda}>Faixa atual: {FAIXAS.find((f) => f.valor === faixaAtual).rotulo}</Text>
                  )}
                  <View style={{ marginTop: 8 }}>
                    <Link texto="Alterar data de nascimento" onPress={() => setEditandoNascimento(true)} />
                  </View>
                </View>
              </View>

              <Botao texto="+ Registrar aplicação" onPress={() => navigation.navigate("RegistrarAplicacao")} />

              <Secao titulo="Acompanhamento" />
              <View style={styles.menu}>
                {atalhos.map((atalho) => (
                  <Pressable
                    key={atalho.rota}
                    onPress={() => navigation.navigate(atalho.rota)}
                    accessibilityRole="button"
                    accessibilityLabel={atalho.titulo}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.pressionado]}
                  >
                    <View style={styles.menuContador}>
                      <Text style={styles.menuContadorTexto}>{atalho.total}</Text>
                    </View>
                    <Text style={styles.menuTitulo}>{atalho.titulo}</Text>
                    <Text style={styles.menuTexto}>{atalho.texto}</Text>
                  </Pressable>
                ))}
              </View>

              <Secao titulo="Faixa etária" />
              <SeletorOpcoes opcoes={FAIXAS} valor={faixa} onChange={(v) => { setFaixa(v); setFiltro("todas"); }} />
              <Text style={[styles.legenda, { marginTop: 8 }]}>
                {faixaInfo.idade}
                {faixa === faixaAtual ? " · faixa atual do paciente" : ""}
              </Text>

              <View style={styles.resumoSituacoes}>
                {Object.entries(SITUACOES).map(([valor, info]) => (
                  <Pressable
                    key={valor}
                    onPress={() => setFiltro((atual) => (atual === valor ? "todas" : valor))}
                    accessibilityRole="button"
                    accessibilityLabel={`${contagem[valor]} ${info.rotulo}, filtrar`}
                    accessibilityState={{ selected: filtro === valor }}
                    style={({ pressed }) => [
                      styles.resumoSituacao,
                      { backgroundColor: info.fundo },
                      filtro === valor && { borderWidth: 2, borderColor: info.texto, padding: 12 },
                      pressed && styles.pressionado,
                    ]}
                  >
                    <Text style={[styles.resumoSituacaoValor, { color: info.texto }]}>{contagem[valor]}</Text>
                    <Text style={[styles.resumoSituacaoRotulo, { color: info.texto }]}>{info.rotulo}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={[styles.legenda, { marginTop: 8 }]}>
                O resumo conta as vacinas de rotina desta faixa. Toque em uma situação para filtrar.
              </Text>

              <SeletorOpcoes opcoes={FILTROS} valor={filtro} onChange={setFiltro} />

              <Secao titulo="Vacinas de rotina" />
              {rotina.filter(passaFiltro).length === 0 ? (
                <Vazio texto="Nenhuma vacina de rotina com essa situação nesta faixa." />
              ) : (
                rotina
                  .filter(passaFiltro)
                  .map((r) => <CardVacina key={r.id} recomendacao={r} calculo={situacoes[r.id]} onPress={abrir} />)
              )}

              {especiais.length > 0 && (
                <>
                  <Secao titulo="Recomendações especiais" />
                  <Text style={[styles.legenda, { marginBottom: 10 }]}>
                    Indicadas só para grupos específicos (como gestantes ou pessoas com certas condições de saúde),
                    não para todas as pessoas desta faixa.
                  </Text>
                  {especiais.filter(passaFiltro).length === 0 ? (
                    <Vazio texto="Nenhuma recomendação especial com essa situação." />
                  ) : (
                    especiais
                      .filter(passaFiltro)
                      .map((r) => <CardVacina key={r.id} recomendacao={r} calculo={situacoes[r.id]} onPress={abrir} />)
                  )}
                </>
              )}

              <Text style={[styles.legenda, { marginTop: 16 }]}>
                Fonte: Ministério da Saúde, Instrução Normativa do Calendário Nacional de Vacinação 2026. O calendário
                oficial agrupa adolescentes e jovens de 10 a 24 anos e adultos de 25 a 59 anos. A situação é calculada
                com base nas doses registradas aqui; confira sempre sua caderneta na unidade de saúde.
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <DataNascimento visivel={editandoNascimento} onFechar={() => setEditandoNascimento(false)} />
    </View>
  );
};

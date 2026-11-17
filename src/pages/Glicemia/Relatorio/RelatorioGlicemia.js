import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { GlobalContext } from "../../IMC/ContextGlobal";
import { GlobalContextGlicemia } from "../GlobalContextGlicemia";
import { Aviso, Botao, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import { GraficoLinha } from "../Grafico/GraficoLinha";
import { exportarRelatorioPdf, montarHtmlRelatorio } from "./relatorioPdf";
import {
  MOMENTOS,
  PERIODOS,
  compararComMeta,
  estatisticas,
  filtrarPeriodo,
  formatarData,
  formatarDataHora,
  inicioDoPeriodo,
  mediasSemanais,
  momentoDaMedicao,
} from "../dadosGlicemia";

const Linha = ({ celulas, cabecalho = false }) => (
  <View style={[styles.tabelaLinha, cabecalho && styles.tabelaCabecalho]}>
    {celulas.map((texto, i) => (
      <Text
        key={i}
        style={[
          styles.tabelaCelula,
          cabecalho && styles.tabelaCelulaTitulo,
          i > 0 && styles.tabelaCelulaDireita,
          i === 0 && { flex: 2 },
        ]}
      >
        {texto}
      </Text>
    ))}
  </View>
);

const arred = (n) => (n == null ? "—" : String(Math.round(n)));
const dois = (n) => String(n).padStart(2, "0");
const isoDe = (d) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;

export const RelatorioGlicemia = () => {
  const { nome } = React.useContext(GlobalContext);
  const { medicoes, metas, periodo, setPeriodo } = React.useContext(GlobalContextGlicemia);
  const [exportando, setExportando] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(null); // { texto, erro }

  const dados = React.useMemo(() => {
    const agora = new Date();
    const lista = filtrarPeriodo(medicoes, periodo, agora);
    const porMomento = MOMENTOS.map((m) => {
      const doMomento = lista.filter((item) => item.momento === m.valor);
      const comparadas = doMomento.map((item) => compararComMeta(item, metas)).filter(Boolean);
      return {
        valor: m.valor,
        rotulo: m.rotulo,
        ...estatisticas(doMomento),
        // Só calcula quando o paciente tem meta para esse momento.
        dentroDaMeta: comparadas.length
          ? Math.round((comparadas.filter((s) => s === "dentro").length / comparadas.length) * 100)
          : null,
      };
    }).filter((m) => m.quantidade > 0);
    return {
      agora,
      inicio: inicioDoPeriodo(periodo, agora),
      lista,
      resumo: estatisticas(lista),
      porMomento,
      semanas: mediasSemanais(lista, periodo, agora),
    };
  }, [medicoes, metas, periodo]);

  const { resumo, lista, porMomento, semanas } = dados;
  const semanasComDados = semanas.filter((s) => s.quantidade > 0);
  const primeira = semanasComDados[0];
  const ultimaSemana = semanasComDados[semanasComDados.length - 1];
  const diferenca =
    semanasComDados.length >= 2 ? Math.round(ultimaSemana.media) - Math.round(primeira.media) : null;

  const exportar = async () => {
    if (exportando || !lista.length) return;
    setExportando(true);
    setMensagem(null);
    try {
      const html = montarHtmlRelatorio({
        nome,
        periodo,
        inicio: dados.inicio,
        fim: dados.agora,
        resumo,
        porMomento,
        semanas,
        metas,
        medicoes: lista.map((m) => ({ ...m, quando: momentoDaMedicao(m).getTime() })),
      });
      const resultado = await exportarRelatorioPdf(html);
      setMensagem({
        texto:
          resultado === "web"
            ? "Relatório aberto em uma nova aba. Na janela de impressão, escolha \"Salvar como PDF\"."
            : "PDF gerado. Escolha onde salvar ou com quem compartilhar.",
      });
    } catch (e) {
      setMensagem({ erro: true, texto: e?.message || "Não foi possível gerar o PDF. Tente novamente." });
    } finally {
      setExportando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header titulo="Relatórios" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>RELATÓRIO</Text>
          <Text style={styles.titulo}>Resumo da sua glicemia</Text>
          <Text style={styles.subtitulo}>
            Últimos {periodo} dias, de {formatarData(isoDe(dados.inicio))} até hoje.
          </Text>

          <SeletorOpcoes rotulo="Período" opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />

          {lista.length === 0 ? (
            <View style={{ marginTop: 16 }}>
              <Vazio texto="Nenhuma medição nesse período. Escolha um período maior ou registre uma medição." />
            </View>
          ) : (
            <>
              <View style={styles.resumo}>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{arred(resumo.media)}</Text>
                  <Text style={styles.resumoRotulo}>média (mg/dL)</Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{resumo.quantidade}</Text>
                  <Text style={styles.resumoRotulo}>medições</Text>
                </View>
              </View>
              <View style={styles.resumo}>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{resumo.menor.valor}</Text>
                  <Text style={styles.resumoRotulo}>menor valor</Text>
                  <Text style={styles.legenda}>{formatarDataHora(resumo.menor)}</Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{resumo.maior.valor}</Text>
                  <Text style={styles.resumoRotulo}>maior valor</Text>
                  <Text style={styles.legenda}>{formatarDataHora(resumo.maior)}</Text>
                </View>
              </View>

              <Text style={[styles.secao, { marginTop: 22 }]}>Evolução glicêmica</Text>
              <GraficoLinha medicoes={lista} dias={periodo} />
              {diferenca != null && (
                <Text style={[styles.legenda, { marginTop: 8 }]}>
                  Média da semana mais recente com medições: {Math.round(ultimaSemana.media)} mg/dL; da primeira semana do
                  período: {Math.round(primeira.media)} mg/dL (
                  {diferenca === 0 ? "sem diferença" : `${diferenca > 0 ? "+" : ""}${diferenca} mg/dL`}).
                </Text>
              )}

              <Text style={[styles.secao, { marginTop: 22, marginBottom: 10 }]}>Média por semana</Text>
              <View style={styles.tabela}>
                <Linha cabecalho celulas={["Semana", "Qtd.", "Média", "Menor", "Maior"]} />
                {semanas.map((s) => (
                  <Linha
                    key={s.de}
                    celulas={[
                      `${formatarData(s.de).slice(0, 5)} a ${formatarData(s.ate).slice(0, 5)}`,
                      String(s.quantidade),
                      arred(s.media),
                      s.menor ? String(s.menor.valor) : "—",
                      s.maior ? String(s.maior.valor) : "—",
                    ]}
                  />
                ))}
              </View>

              <Text style={[styles.secao, { marginTop: 22, marginBottom: 10 }]}>Por momento da medição</Text>
              <View style={styles.tabela}>
                <Linha cabecalho celulas={["Momento", "Qtd.", "Média", "Na meta"]} />
                {porMomento.map((m) => (
                  <Linha
                    key={m.valor}
                    celulas={[m.rotulo, String(m.quantidade), arred(m.media), m.dentroDaMeta != null ? `${m.dentroDaMeta}%` : "—"]}
                  />
                ))}
              </View>
              <Text style={[styles.legenda, { marginTop: 8 }]}>
                "Na meta" compara cada medição com as metas que você cadastrou. Momentos sem meta aparecem com "—".
              </Text>

              {!!mensagem && <Aviso erro={mensagem.erro} texto={mensagem.texto} />}
              <Botao texto={exportando ? "Gerando PDF…" : "Exportar relatório em PDF"} onPress={exportar} desativado={exportando} />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

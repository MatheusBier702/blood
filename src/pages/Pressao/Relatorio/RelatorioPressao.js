import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContext } from "../../IMC/ContextGlobal";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { Aviso, Botao, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import { GraficoLinhasPressao } from "../Grafico/GraficoLinhasPressao";
import { exportarRelatorioPdf, montarHtmlRelatorioPressao } from "./relatorioPdfPressao";
import {
  CONTEXTOS,
  MINIMO_PARA_MEDIA,
  PERIODOS,
  estatisticasPressao,
  filtrarPeriodo,
  formatarData,
  formatarDataHora,
  inicioDoPeriodo,
  isoDe,
  mediaFormatada,
  momentoDaMedicao,
  semanasPressao,
} from "../dadosPressao";

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

const Extremo = ({ rotulo, registro, campo }) => (
  <View style={styles.resumoItem}>
    <Text style={styles.resumoValor}>{registro ? registro[campo] : "—"}</Text>
    <Text style={styles.resumoRotulo}>{rotulo}</Text>
    {!!registro && <Text style={styles.legenda}>{formatarDataHora(registro)}</Text>}
  </View>
);

const arred = (n) => (n == null ? "—" : String(Math.round(n)));

export const RelatorioPressao = () => {
  const { nome } = React.useContext(GlobalContext);
  const { medicoes, metas, periodo, setPeriodo } = React.useContext(GlobalContextPressao);
  const [exportando, setExportando] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(null);

  const dados = React.useMemo(() => {
    const agora = new Date();
    const lista = filtrarPeriodo(medicoes, periodo, agora);
    return {
      agora,
      inicio: inicioDoPeriodo(periodo, agora),
      lista,
      resumo: estatisticasPressao(lista),
      semanas: semanasPressao(lista, periodo, agora),
      porContexto: CONTEXTOS.map((c) => ({
        valor: c.valor,
        rotulo: c.rotulo,
        ...estatisticasPressao(lista.filter((m) => m.contexto === c.valor)),
      })).filter((c) => c.quantidade > 0),
    };
  }, [medicoes, periodo]);

  const { lista, resumo, semanas, porContexto } = dados;
  const media = mediaFormatada(resumo);
  const comDados = semanas.filter((s) => s.quantidade > 0);
  const primeira = comDados[0];
  const ultima = comDados[comDados.length - 1];

  const exportar = async () => {
    if (exportando || !lista.length) return;
    setExportando(true);
    setMensagem(null);
    try {
      const html = montarHtmlRelatorioPressao({
        nome,
        periodo,
        inicio: dados.inicio,
        fim: dados.agora,
        resumo,
        semanas,
        porContexto,
        metas,
        medicoes: lista.map((m) => ({ ...m, quando: momentoDaMedicao(m).getTime() })),
      });
      const resultado = await exportarRelatorioPdf(html);
      setMensagem({
        texto:
          resultado === "web"
            ? 'Relatório aberto em uma nova aba. Na janela de impressão, escolha "Salvar como PDF".'
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
          <Text style={styles.titulo}>Resumo da sua pressão</Text>
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
                  <Text style={styles.resumoValor}>{media ?? "—"}</Text>
                  <Text style={styles.resumoRotulo}>média (mmHg)</Text>
                  {!media && <Text style={styles.legenda}>A partir de {MINIMO_PARA_MEDIA} medições.</Text>}
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{resumo.quantidade}</Text>
                  <Text style={styles.resumoRotulo}>medições</Text>
                  <Text style={styles.legenda}>
                    FC média: {resumo.frequencia.quantidade ? `${arred(resumo.frequencia.media)} bpm` : "—"}
                  </Text>
                </View>
              </View>

              <Text style={[styles.secao, { marginTop: 22, marginBottom: 2 }]}>Sistólica (máxima)</Text>
              <View style={styles.resumo}>
                <Extremo rotulo="maior" registro={resumo.maiorSistolica} campo="sistolica" />
                <Extremo rotulo="menor" registro={resumo.menorSistolica} campo="sistolica" />
              </View>
              <Text style={[styles.legenda, { marginTop: 6 }]}>Média sistólica: {arred(resumo.sistolica.media)} mmHg</Text>

              <Text style={[styles.secao, { marginTop: 22, marginBottom: 2 }]}>Diastólica (mínima)</Text>
              <View style={styles.resumo}>
                <Extremo rotulo="maior" registro={resumo.maiorDiastolica} campo="diastolica" />
                <Extremo rotulo="menor" registro={resumo.menorDiastolica} campo="diastolica" />
              </View>
              <Text style={[styles.legenda, { marginTop: 6 }]}>Média diastólica: {arred(resumo.diastolica.media)} mmHg</Text>

              <Text style={[styles.secao, { marginTop: 22 }]}>Evolução no período</Text>
              <GraficoLinhasPressao medicoes={lista} dias={periodo} metas={metas} />
              {comDados.length >= 2 && (
                <Text style={[styles.legenda, { marginTop: 8 }]}>
                  Primeira semana com medições: {arred(primeira.sistolica.media)}/{arred(primeira.diastolica.media)} mmHg ·
                  semana mais recente: {arred(ultima.sistolica.media)}/{arred(ultima.diastolica.media)} mmHg.
                </Text>
              )}

              <Text style={[styles.secao, { marginTop: 22, marginBottom: 10 }]}>Média por semana</Text>
              <View style={styles.tabela}>
                <Linha cabecalho celulas={["Semana", "Qtd.", "Média", "FC"]} />
                {semanas.map((s) => (
                  <Linha
                    key={s.de}
                    celulas={[
                      `${formatarData(s.de).slice(0, 5)} a ${formatarData(s.ate).slice(0, 5)}`,
                      String(s.quantidade),
                      s.quantidade ? `${arred(s.sistolica.media)}/${arred(s.diastolica.media)}` : "—",
                      s.frequencia.quantidade ? arred(s.frequencia.media) : "—",
                    ]}
                  />
                ))}
              </View>

              <Text style={[styles.secao, { marginTop: 22, marginBottom: 10 }]}>Por contexto</Text>
              <View style={styles.tabela}>
                <Linha cabecalho celulas={["Contexto", "Qtd.", "Média"]} />
                {porContexto.map((c) => (
                  <Linha
                    key={c.valor}
                    celulas={[c.rotulo, String(c.quantidade), `${arred(c.sistolica.media)}/${arred(c.diastolica.media)}`]}
                  />
                ))}
              </View>

              {!!mensagem && <Aviso erro={mensagem.erro} texto={mensagem.texto} />}
              <Botao
                texto={exportando ? "Gerando PDF…" : "Exportar relatório em PDF"}
                onPress={exportar}
                desativado={exportando}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

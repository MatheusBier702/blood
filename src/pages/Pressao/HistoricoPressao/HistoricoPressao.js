import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { CardPressao } from "../CardPressao/CardPressao";
import { Botao, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import { BRACOS, CONTEXTOS, formatarData } from "../dadosPressao";

const POR_PAGINA = 30;
const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const tituloDoDia = (iso) => {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  const ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);
  if (data.toDateString() === hoje.toDateString()) return `HOJE · ${formatarData(iso)}`;
  if (data.toDateString() === ontem.toDateString()) return `ONTEM · ${formatarData(iso)}`;
  return `${DIAS_SEMANA[data.getDay()].toUpperCase()} · ${formatarData(iso)}`;
};

export const HistoricoPressao = ({ navigation }) => {
  const { medicoes, metas } = React.useContext(GlobalContextPressao);
  const [contexto, setContexto] = React.useState("todos");
  const [braco, setBraco] = React.useState("todos");
  const [limite, setLimite] = React.useState(POR_PAGINA);

  const lista = medicoes.filter(
    (m) => (contexto === "todos" || m.contexto === contexto) && (braco === "todos" || m.braco === braco)
  );
  const visiveis = lista.slice(0, limite);

  // Agrupa por dia, mantendo a ordem (mais recente primeiro).
  const grupos = [];
  for (const medicao of visiveis) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.data === medicao.data) ultimo.itens.push(medicao);
    else grupos.push({ data: medicao.data, itens: [medicao] });
  }

  const filtrar = (definir) => (valor) => {
    definir(valor);
    setLimite(POR_PAGINA);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Histórico" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>HISTÓRICO</Text>
          <Text style={styles.titulo}>Medições anteriores</Text>
          <Text style={styles.subtitulo}>Da mais recente para a mais antiga. Toque em uma medição para ver os detalhes.</Text>

          <Botao texto="+ Registrar pressão" onPress={() => navigation.navigate("RegistrarPressao")} />

          <SeletorOpcoes
            rotulo="Contexto"
            opcoes={[{ valor: "todos", rotulo: "Todos" }, ...CONTEXTOS]}
            valor={contexto}
            onChange={filtrar(setContexto)}
          />
          <SeletorOpcoes
            rotulo="Braço"
            opcoes={[{ valor: "todos", rotulo: "Os dois" }, ...BRACOS]}
            valor={braco}
            onChange={filtrar(setBraco)}
          />
          <Text style={[styles.legenda, { marginTop: 8 }]}>
            {lista.length} {lista.length === 1 ? "medição" : "medições"}
          </Text>

          {lista.length === 0 ? (
            <View style={{ marginTop: 10 }}>
              <Vazio
                texto={medicoes.length === 0 ? "Nenhuma medição registrada ainda." : "Nenhuma medição com esses filtros."}
              />
            </View>
          ) : (
            grupos.map((grupo) => (
              <View key={grupo.data}>
                <Text style={styles.grupoData}>{tituloDoDia(grupo.data)}</Text>
                {grupo.itens.map((medicao) => (
                  <CardPressao
                    key={medicao.id}
                    medicao={medicao}
                    metas={metas}
                    mostrarData={false}
                    onPress={(item) => navigation.navigate("DetalhePressao", { id: item.id })}
                  />
                ))}
              </View>
            ))
          )}

          {lista.length > limite && (
            <Botao
              texto={`Mostrar mais (${lista.length - limite} restantes)`}
              variante="secundario"
              onPress={() => setLimite((atual) => atual + POR_PAGINA)}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

import React from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../screen/components/Header";
import color from "../../screen/Colors/cor";
import { styles } from "../../screen/css/UbsStyle";
import { MapaUbs } from "./MapaUbs/MapaUbs";
import { CardUbs } from "./CardUbs/CardUbs";
import { RotaUbs } from "./RotaUbs/RotaUbs";
import { useUbs } from "./useUbs";

const MODOS = [
  { valor: "pe", rotulo: "A pé" },
  { valor: "carro", rotulo: "De carro" },
];

const Aviso = ({ texto, erro = false, acao, rotuloAcao }) => (
  <View style={[styles.aviso, erro && styles.avisoErro]}>
    <Text style={[styles.avisoTexto, erro && styles.avisoTextoErro]}>{texto}</Text>
    {!!acao && (
      <Pressable onPress={acao} accessibilityRole="button" hitSlop={6}>
        <Text style={styles.botaoTexto}>{rotuloAcao}</Text>
      </Pressable>
    )}
  </View>
);

export const Ubs = () => {
  const ubs = useUbs();
  const scroll = React.useRef(null);

  const selecionar = (id) => {
    ubs.selecionar(id);
    scroll.current?.scrollTo({ y: 0, animated: true });
  };

  const textoStatus = !ubs.posicao
    ? "Procurando sua localização…"
    : `Localização ao vivo${ubs.posicao.precisao ? ` · precisão de ${ubs.posicao.precisao} m` : ""}${
        ubs.municipio ? ` · ${ubs.municipio}` : ""
      }`;

  return (
    <View style={styles.container}>
      <Header titulo="UBS Próximas" voltar />

      <View style={styles.mapaArea}>
        <MapaUbs estado={ubs.estadoMapa} onSelecionar={selecionar} style={styles.mapa} />
        {!!ubs.posicao && (
          <Pressable
            style={({ pressed }) => [styles.botaoCentralizar, pressed && styles.pressionado]}
            onPress={ubs.centralizarMapa}
            accessibilityRole="button"
            accessibilityLabel="Centralizar o mapa em você"
          >
            <Text style={styles.botaoCentralizarTexto}>Onde estou</Text>
          </Pressable>
        )}
      </View>

      <ScrollView ref={scroll} contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>GEOLOCALIZAÇÃO</Text>
          <Text style={styles.titulo}>Unidades Básicas de Saúde perto de você</Text>
          {ubs.permissao === "ok" && (
            <View style={styles.status}>
              {!!ubs.posicao && <View style={styles.pontoAoVivo} />}
              <Text style={styles.legenda}>{textoStatus}</Text>
            </View>
          )}

          <View style={styles.modos} accessibilityRole="radiogroup">
            {MODOS.map(({ valor, rotulo }) => {
              const ativo = ubs.modo === valor;
              return (
                <Pressable
                  key={valor}
                  style={[styles.modo, ativo && styles.modoAtivo]}
                  onPress={() => ubs.setModo(valor)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativo }}
                >
                  <Text style={[styles.modoTexto, ativo && styles.modoTextoAtivo]}>{rotulo}</Text>
                </Pressable>
              );
            })}
          </View>

          {ubs.permissao === "pedindo" && <Aviso texto="Permita o acesso à sua localização para ver as UBSs próximas." />}
          {ubs.permissao === "negada" && (
            <Aviso
              erro
              texto={
                Platform.OS === "web"
                  ? "O navegador bloqueou a localização. Libere o acesso no ícone ao lado do endereço do site e tente de novo."
                  : "Sem permissão de localização não conseguimos encontrar as UBSs. Libere o acesso nas configurações do celular."
              }
              acao={ubs.tentarDeNovo}
              rotuloAcao="Tentar de novo"
            />
          )}
          {!!ubs.erro && <Aviso erro texto={ubs.erro} acao={ubs.tentarDeNovo} rotuloAcao="Tentar de novo" />}
          {!!ubs.aviso && <Aviso texto={ubs.aviso} />}

          <RotaUbs
            unidade={ubs.selecionada}
            rota={ubs.rota}
            carregando={ubs.carregandoRota}
            erro={ubs.erroRota}
            modo={ubs.modo}
            onFechar={() => ubs.selecionar(ubs.selecionada?.id)}
          />

          {ubs.carregando && (
            <View style={styles.carregando}>
              <ActivityIndicator color={color.colorModelFour} />
              <Text style={styles.legenda}>
                Buscando UBSs perto de você… Na primeira vez em uma cidade isso pode levar até 1 minuto.
              </Text>
            </View>
          )}

          {ubs.unidades.length > 0 && (
            <>
              <Text style={styles.secao}>Mais próximas</Text>
              {ubs.unidades.map((unidade, i) => (
                <CardUbs
                  key={unidade.id}
                  unidade={unidade}
                  numero={i + 1}
                  ativa={ubs.selecionada?.id === unidade.id}
                  modo={ubs.modo}
                  onSelecionar={selecionar}
                />
              ))}
              {ubs.pendentes > 0 && (
                <Text style={styles.legenda}>
                  Conferindo o endereço de mais {ubs.pendentes} {ubs.pendentes === 1 ? "unidade" : "unidades"}; a lista
                  se atualiza sozinha.
                </Text>
              )}
              <Text style={styles.fonte}>
                Fonte: {ubs.fonte}. Rotas: Valhalla com dados do OpenStreetMap. Ligue antes de ir para confirmar o
                horário de atendimento. Em emergências, ligue 192 (SAMU).
              </Text>
            </>
          )}

          {!ubs.carregando && !ubs.erro && !!ubs.posicao && !!ubs.municipio && ubs.unidades.length === 0 && (
            <Aviso texto="Não encontramos UBSs cadastradas perto de você." />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

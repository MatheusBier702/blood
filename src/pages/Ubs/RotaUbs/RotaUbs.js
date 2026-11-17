import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/UbsStyle";
import { abrirNoAppDeMapas, formatarDistancia, formatarTempo } from "../formatar";

export const RotaUbs = ({ unidade, rota, carregando, erro, modo, onFechar }) => {
  const [verPassos, setVerPassos] = React.useState(false);
  if (!unidade) return null;

  return (
    <View style={styles.rota}>
      <Text style={styles.rotaTitulo}>{unidade.nome}</Text>
      {carregando && !rota ? (
        <View style={styles.carregando}>
          <ActivityIndicator color={color.branco} />
          <Text style={styles.rotaDetalhe}>Traçando a rota…</Text>
        </View>
      ) : rota ? (
        <>
          <Text style={styles.rotaResumo}>
            {formatarTempo(rota.tempoMin)} · {formatarDistancia(rota.distanciaKm)}
          </Text>
          <Text style={styles.rotaDetalhe}>
            Rota {modo === "carro" ? "de carro" : "a pé"}, atualizada enquanto você se move.
          </Text>
        </>
      ) : (
        !!erro && <Text style={styles.rotaDetalhe}>{erro}</Text>
      )}

      <View style={styles.rotaAcoes}>
        <Pressable
          style={({ pressed }) => [styles.rotaBotao, pressed && styles.pressionado]}
          onPress={() => abrirNoAppDeMapas(unidade, modo)}
          accessibilityRole="link"
        >
          <Text style={styles.rotaBotaoTexto}>Abrir no app de mapas</Text>
        </Pressable>
        {!!rota?.passos?.length && (
          <Pressable
            style={({ pressed }) => [styles.rotaBotao, styles.rotaBotaoSecundario, pressed && styles.pressionado]}
            onPress={() => setVerPassos((v) => !v)}
            accessibilityRole="button"
          >
            <Text style={[styles.rotaBotaoTexto, styles.rotaBotaoTextoSecundario]}>
              {verPassos ? "Esconder passos" : "Ver passo a passo"}
            </Text>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [styles.rotaBotao, styles.rotaBotaoSecundario, pressed && styles.pressionado]}
          onPress={onFechar}
          accessibilityRole="button"
        >
          <Text style={[styles.rotaBotaoTexto, styles.rotaBotaoTextoSecundario]}>Fechar</Text>
        </Pressable>
      </View>

      {verPassos && !!rota?.passos?.length && (
        <View style={styles.passos}>
          {rota.passos.map((passo, i) => (
            <View key={i} style={styles.passo}>
              <Text style={styles.passoNumero}>{i + 1}.</Text>
              <Text style={styles.passoTexto}>
                {passo.instrucao}
                {passo.distanciaKm > 0 ? ` (${formatarDistancia(passo.distanciaKm)})` : ""}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

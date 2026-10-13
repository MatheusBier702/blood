import { useState } from "react";
import { View, Text, Image, Pressable, Modal, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import color from "../../../screen/Colors/cor";

export default function FotoPerfil() {
  const [imagem, setImagem] = useState(null);
  const [opcoes, setOpcoes] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const escolherDaGaleria = async () => {
    if (ocupado) return;
    setOpcoes(false);
    setOcupado(true);
    setErro("");
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!resultado.canceled && resultado.assets?.[0]?.uri) {
        setImagem(resultado.assets[0].uri);
      }
    } catch {
      setErro("Não foi possível abrir a galeria. Tente novamente.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setOpcoes(true)}
        disabled={ocupado}
        accessibilityRole="button"
        accessibilityLabel="Alterar foto do perfil"
      >
        <Image
          style={styles.foto}
          source={
            imagem
              ? { uri: imagem }
              : require("../../../screen/assets/fotoPerfil.png")
          }
        />
        <Text style={styles.link}>
          {ocupado ? "Selecionando…" : "Alterar foto"}
        </Text>
      </Pressable>

      <Modal
        visible={opcoes}
        transparent
        animationType="fade"
        onRequestClose={() => setOpcoes(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.opcoes} accessibilityViewIsModal>
           
            <Pressable
              style={styles.botao}
              onPress={escolherDaGaleria}
              accessibilityRole="button"
            >
              <Text style={styles.botaoTexto}>Galeria</Text>
            </Pressable>
            
          </View>
        </View>
      </Modal>
      {!!erro && (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  foto: { width: 120, height: 120, borderRadius: 60, resizeMode: "cover" },
  link: {
    color: color.colorModelFour,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  opcoes: {
    backgroundColor: color.branco,
    width: "100%",
    maxWidth: 280,
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  botao: {
    backgroundColor: color.colorModelFour,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  desativado: { opacity: 0.5 },
  botaoTexto: { color: color.branco, fontWeight: "600" },
  erro: { color: color.vermelho, textAlign: "center", marginTop: 10 },
});

import React from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/AlergiasStyle";
import { CORES_GRAVIDADE, rotuloGravidade } from "../dadosAlergias";

// Peças pequenas reutilizadas pelas telas da aba Alergias.

export const Botao = ({ texto, onPress, variante = "principal", style, desativado = false }) => {
  const extra = {
    secundario: [styles.botaoSecundario, styles.botaoSecundarioTexto],
    perigo: [styles.botaoPerigo, styles.botaoPerigoTexto],
  }[variante] ?? [null, null];

  return (
    <Pressable
      onPress={onPress}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desativado }}
      style={({ pressed }) => [
        styles.botao,
        extra[0],
        style,
        desativado && { opacity: 0.5 },
        pressed && styles.pressionado,
      ]}
    >
      <Text style={[styles.botaoTexto, extra[1]]}>{texto}</Text>
    </Pressable>
  );
};

export const BotaoPequeno = ({ texto, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => [styles.botaoPequeno, pressed && styles.pressionado]}
  >
    <Text style={styles.botaoPequenoTexto}>{texto}</Text>
  </Pressable>
);

export const Link = ({ texto, onPress, cor }) => (
  <Pressable onPress={onPress} accessibilityRole="button" hitSlop={6}>
    {({ pressed }) => (
      <Text style={[styles.link, cor && { color: cor }, pressed && { opacity: 0.6 }]}>{texto}</Text>
    )}
  </Pressable>
);

export const EtiquetaGravidade = ({ gravidade }) => {
  const cores = CORES_GRAVIDADE[gravidade] ?? CORES_GRAVIDADE.desconhecida;
  return (
    <View style={[styles.chip, { backgroundColor: cores.fundo }]}>
      <Text style={[styles.chipTexto, { color: cores.texto }]}>{rotuloGravidade(gravidade)}</Text>
    </View>
  );
};

export const Chip = ({ texto }) => (
  <View style={styles.chip}>
    <Text style={styles.chipTexto}>{texto}</Text>
  </View>
);

export const Aviso = ({ texto, erro = false, acao, rotuloAcao }) => (
  <View style={[styles.aviso, erro && styles.avisoErro]}>
    <Text style={[styles.avisoTexto, erro && styles.avisoTextoErro]}>{texto}</Text>
    {!!acao && (
      <View style={{ marginTop: 8 }}>
        <Link texto={rotuloAcao} onPress={acao} />
      </View>
    )}
  </View>
);

export const Vazio = ({ texto, rotuloAcao, acao }) => (
  <View style={styles.vazio}>
    <Text style={styles.vazioTexto}>{texto}</Text>
    {!!acao && (
      <View style={{ marginTop: 12 }}>
        <BotaoPequeno texto={rotuloAcao} onPress={acao} />
      </View>
    )}
  </View>
);

export const Secao = ({ titulo, rotuloAcao, acao }) => (
  <View style={styles.secaoLinha}>
    <Text style={styles.secao}>{titulo}</Text>
    {!!acao && <Link texto={rotuloAcao} onPress={acao} />}
  </View>
);

export const CampoDetalhe = ({ rotulo, valor, ultimo = false }) => (
  <View style={[styles.campoDetalhe, ultimo && styles.campoDetalheUltimo]}>
    <Text style={styles.campoDetalheRotulo}>{rotulo}</Text>
    <Text style={styles.campoDetalheValor}>{valor || "Não informado"}</Text>
  </View>
);

// Campo de texto com rótulo e mensagem de erro.
export const Campo = ({ rotulo, obrigatorio = false, erro, multiline = false, style, ...props }) => (
  <View style={styles.campo}>
    <Text style={styles.rotulo}>
      {rotulo}
      {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
    </Text>
    <TextInput
      placeholderTextColor={color.textoSuave}
      accessibilityLabel={rotulo}
      multiline={multiline}
      style={[styles.input, multiline && styles.inputMultilinha, !!erro && styles.inputErro, style]}
      {...props}
    />
    {!!erro && <Text style={styles.erroCampo}>{erro}</Text>}
  </View>
);

// Grupo de opções em "chips" (o ativo fica verde, como os modos da aba UBS).
export const SeletorOpcoes = ({ rotulo, opcoes, valor, onChange, obrigatorio = false, erro }) => (
  <View style={styles.campo}>
    {!!rotulo && (
      <Text style={styles.rotulo}>
        {rotulo}
        {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
      </Text>
    )}
    <View style={styles.opcoes} accessibilityRole="radiogroup">
      {opcoes.map((opcao) => {
        const ativo = valor === opcao.valor;
        return (
          <Pressable
            key={String(opcao.valor)}
            onPress={() => onChange(opcao.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativo }}
            style={({ pressed }) => [styles.filtro, ativo && styles.filtroAtivo, pressed && styles.pressionado]}
          >
            <Text style={[styles.filtroTexto, ativo && styles.filtroTextoAtivo]}>{opcao.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
    {!!erro && <Text style={styles.erroCampo}>{erro}</Text>}
  </View>
);

// Mantém o último valor preenchido, para o conteúdo não sumir durante a
// animação de saída do modal (quando a tela já limpou o estado).
const useUltimoValor = (valor) => {
  const ref = React.useRef(valor);
  if (valor) ref.current = valor;
  return ref.current;
};

// Janela modal no mesmo estilo do AddCopo (aba Água), com rolagem para formulários.
export const JanelaModal = ({ visivel, onFechar, titulo, children }) => {
  const tituloVisivel = useUltimoValor(titulo);
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <View style={styles.overlay}>
        <View style={styles.modal} accessibilityViewIsModal>
          <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
            {!!tituloVisivel && <Text style={styles.modalTitulo}>{tituloVisivel}</Text>}
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const Confirmacao = ({ visivel, titulo, texto, rotuloConfirmar = "Excluir", onConfirmar, onCancelar }) => (
  <JanelaModal visivel={visivel} onFechar={onCancelar} titulo={titulo}>
    <TextoConfirmacao texto={texto} />
    <Botao texto={rotuloConfirmar} variante="perigo" onPress={onConfirmar} style={{ marginTop: 20 }} />
    <Cancelar onPress={onCancelar} />
  </JanelaModal>
);

const TextoConfirmacao = ({ texto }) => <Text style={styles.modalTexto}>{useUltimoValor(texto)}</Text>;

export const Cancelar = ({ onPress, texto = "Cancelar" }) => (
  <Pressable style={styles.cancelar} onPress={onPress} accessibilityRole="button">
    <Text style={styles.cancelarTexto}>{texto}</Text>
  </Pressable>
);

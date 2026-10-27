import React from "react";
import { View, Text, Pressable } from "react-native";
import { GlobalContext } from "../../IMC/ContextGlobal";
import { CampoSenha } from "../Campo/CampoSenha";
import { CampoLogin } from "../Campo/CampoLogin";
import { TipoSanguineoLogin } from "../TipoSanguineo/TipoSanguineoLogin";
import { cadastrarUsuario, entrarUsuario } from "../../../services/api";
import { styles } from "../../../screen/css/LoginStyle";

export const FormularioLogin = ({ onEntrar }) => {
  const [senha, setSenha] = React.useState("");
  const [cadastro, setCadastro] = React.useState(false);
  const [carregando, setCarregando] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const {
    nome, setNome,
    tipoSangue, setTipoSangue,
    peso, setPeso,
    altura, setAltura,
    contador, setContador,
    email, setEmail,
  } = React.useContext(GlobalContext);

  const enviar = async () => {
    if (carregando) return;
    setErro("");
    setCarregando(true);
    try {
      const resposta = cadastro
        ? await cadastrarUsuario({ nome, email, senha, tipo_sangue: tipoSangue,
            idade: contador || null, peso, altura })
        : await entrarUsuario({ email, senha });
      const usuario = resposta.usuario;
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTipoSangue(usuario.tipo_sangue || "");
      setContador(usuario.idade || 0);
      setPeso(usuario.peso == null ? "" : String(usuario.peso));
      setAltura(usuario.altura == null ? "" : String(usuario.altura));
      setSenha("");
      onEntrar();
    } catch (error) {
      setErro(error.response?.data?.error || "NÃ£o foi possÃ­vel conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.formulario}>
      {cadastro && <CampoLogin
        titulo="Nome"
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
        editable={!carregando}
      />}

      <CampoLogin
        titulo="Email"
        placeholder="Seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!carregando}

      />

      <CampoSenha value={senha} onChangeText={setSenha} />
      {cadastro && <>
      <CampoLogin
        titulo="Idade"
        placeholder="Sua idade"
        value={String(contador || "")}
        onChangeText={setContador}

      />
      <TipoSanguineoLogin value={tipoSangue} onChange={setTipoSangue} />
      <CampoLogin
        titulo="Peso (kg)"
        placeholder="Ex: 70"
        value={peso}
        onChangeText={setPeso}

      />
      <CampoLogin
        titulo="Altura (cm)"
        placeholder="Ex: 170"
        value={altura}
        onChangeText={setAltura}

      />
      </>}
      {!!erro && <Text style={styles.erro} accessibilityRole="alert">{erro}</Text>}
      <Pressable
        onPress={enviar}
        disabled={carregando}
        accessibilityState={{ disabled: carregando, busy: carregando }}
        accessibilityRole="button"
        style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
      >
        <Text style={styles.botaoTexto}>{carregando ? "Aguarde..." : cadastro ? "Cadastrar" : "Entrar"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" disabled={carregando}
        onPress={() => { setCadastro(!cadastro); setErro(""); setSenha(""); }}>
        <Text style={styles.textoVerSenha}>
          {cadastro ? "JÃ¡ tenho conta. Entrar" : "NÃ£o tenho conta. Cadastrar"}
        </Text>
      </Pressable>
    </View>
  );
};

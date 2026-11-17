import React from "react";
import { GlobalContextVacinas } from "../GlobalContextVacinas";
import { Botao, Campo, Cancelar, JanelaModal } from "../../Alergias/Componentes/Componentes";
import { dataParaIso, isoParaTexto, mascaraData } from "../../Alergias/dadosAlergias";

// Modal para informar o nome e a data de nascimento usados no cálculo das situações.
export const DataNascimento = ({ visivel, onFechar }) => {
  const { perfil, salvarPerfil } = React.useContext(GlobalContextVacinas);
  const [nome, setNome] = React.useState("");
  const [data, setData] = React.useState("");
  const [erro, setErro] = React.useState("");

  React.useEffect(() => {
    if (!visivel) return;
    setNome(perfil?.nome ?? "");
    setData(isoParaTexto(perfil?.dataNascimento));
    setErro("");
  }, [visivel, perfil]);

  const salvar = async () => {
    const iso = dataParaIso(data);
    if (!iso) {
      setErro("Data inválida. Use DD/MM/AAAA e não use datas futuras.");
      return;
    }
    const ok = await salvarPerfil({ nome: nome.trim() || "Paciente", dataNascimento: iso });
    if (ok) onFechar();
  };

  return (
    <JanelaModal visivel={visivel} onFechar={onFechar} titulo="Dados do paciente">
      <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Nome do paciente" maxLength={80} />
      <Campo
        rotulo="Data de nascimento"
        obrigatorio
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        value={data}
        onChangeText={(t) => {
          setData(mascaraData(t));
          setErro("");
        }}
        erro={erro}
        maxLength={10}
      />
      <Botao texto="Salvar" onPress={salvar} />
      <Cancelar onPress={onFechar} />
    </JanelaModal>
  );
};

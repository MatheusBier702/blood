import React from "react";
import { GlobalContext } from "../IMC/ContextGlobal";
import * as servico from "../../services/alergias";
import { ordenarPorGravidade } from "./dadosAlergias";

export const GlobalContextAlergias = React.createContext();

const maisRecentePrimeiro = (a, b) => (b.data || "").localeCompare(a.data || "");

export const GlobalStorageAlergias = ({ children }) => {
  // Nome e tipo sanguíneo vêm do contexto global (preenchidos no login/perfil)
  // e aparecem no cartão de alertas para os profissionais de saúde.
  const { nome, tipoSangue } = React.useContext(GlobalContext);

  const [alergias, setAlergias] = React.useState([]);
  const [reacoes, setReacoes] = React.useState([]);
  const [documentos, setDocumentos] = React.useState([]);
  const [informacoes, setInformacoes] = React.useState([]);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  const recarregar = React.useCallback(async () => {
    setErro("");
    try {
      const [listaAlergias, listaReacoes, listaDocumentos, listaInformacoes] = await Promise.all([
        servico.listarAlergias(),
        servico.listarReacoes(),
        servico.listarDocumentos(),
        servico.listarInformacoes(),
      ]);
      setAlergias(ordenarPorGravidade(listaAlergias));
      setReacoes([...listaReacoes].sort(maisRecentePrimeiro));
      setDocumentos([...listaDocumentos].sort(maisRecentePrimeiro));
      setInformacoes(listaInformacoes);
    } catch {
      setErro("Não foi possível carregar suas alergias. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    recarregar();
  }, [recarregar]);

  // Executa uma alteração e recarrega as listas. Devolve o item salvo
  // (ou null em caso de erro) para a tela decidir o que fazer em seguida.
  const executar = async (acao) => {
    try {
      const resultado = await acao();
      await recarregar();
      return resultado ?? true;
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
      return null;
    }
  };

  const salvarAlergia = (dados) => executar(() => servico.salvarAlergia(dados));
  const removerAlergia = (id) => executar(() => servico.removerAlergia(id));

  // Ao registrar uma reação mais recente, a "última reação" da alergia
  // vinculada é atualizada automaticamente.
  const salvarReacao = (dados) =>
    executar(async () => {
      const salva = await servico.salvarReacao(dados);
      const alergia = alergias.find((item) => item.id === dados.alergiaId);
      if (alergia && (!alergia.ultimaReacao || dados.data > alergia.ultimaReacao)) {
        await servico.salvarAlergia({ id: alergia.id, ultimaReacao: dados.data });
      }
      return salva;
    });
  const removerReacao = (id) => executar(() => servico.removerReacao(id));

  const salvarDocumento = (dados) => executar(() => servico.salvarDocumento(dados));
  const removerDocumento = (id) => executar(() => servico.removerDocumento(id));

  const salvarInformacao = (dados) => executar(() => servico.salvarInformacao(dados));
  const removerInformacao = (id) => executar(() => servico.removerInformacao(id));

  const graves = alergias.filter((item) => item.gravidade === "grave");
  const buscarAlergia = (id) => alergias.find((item) => item.id === id);

  return (
    <GlobalContextAlergias.Provider
      value={{
        nome,
        tipoSangue,
        alergias,
        graves,
        reacoes,
        documentos,
        informacoes,
        carregando,
        erro,
        setErro,
        recarregar,
        buscarAlergia,
        salvarAlergia,
        removerAlergia,
        salvarReacao,
        removerReacao,
        salvarDocumento,
        removerDocumento,
        salvarInformacao,
        removerInformacao,
      }}
    >
      {children}
    </GlobalContextAlergias.Provider>
  );
};

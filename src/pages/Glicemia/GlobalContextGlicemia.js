import React from "react";
import * as servico from "../../services/glicemia";
import { maisRecentePrimeiro } from "./dadosGlicemia";

export const GlobalContextGlicemia = React.createContext();

export const GlobalStorageGlicemia = ({ children }) => {
  const [medicoes, setMedicoes] = React.useState([]);
  const [metas, setMetas] = React.useState({});
  // Período escolhido (7, 30 ou 90 dias), compartilhado entre visão geral, gráfico e relatório.
  const [periodo, setPeriodo] = React.useState(7);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  const recarregar = React.useCallback(async () => {
    setErro("");
    try {
      const [lista, metasSalvas] = await Promise.all([servico.listarMedicoes(), servico.buscarMetas()]);
      setMedicoes([...lista].sort(maisRecentePrimeiro));
      setMetas(metasSalvas || {});
    } catch {
      setErro("Não foi possível carregar suas medições. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    recarregar();
  }, [recarregar]);

  // Executa uma alteração e recarrega. Devolve o item salvo (ou null em caso de erro).
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

  const salvarMedicao = (dados) => executar(() => servico.salvarMedicao(dados));
  const removerMedicao = (id) => executar(() => servico.removerMedicao(id));
  const salvarMetas = (novas) => executar(() => servico.salvarMetas(novas));
  const buscarMedicao = (id) => medicoes.find((item) => item.id === id);

  return (
    <GlobalContextGlicemia.Provider
      value={{
        medicoes,
        metas,
        periodo,
        setPeriodo,
        carregando,
        erro,
        setErro,
        recarregar,
        buscarMedicao,
        salvarMedicao,
        removerMedicao,
        salvarMetas,
      }}
    >
      {children}
    </GlobalContextGlicemia.Provider>
  );
};

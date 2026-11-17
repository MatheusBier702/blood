import React from "react";
import * as servico from "../../services/pressao";
import { ORDEM_ALERTAS, alertaDaMedicao, maisRecentePrimeiro } from "./dadosPressao";

export const GlobalContextPressao = React.createContext();

export const GlobalStoragePressao = ({ children }) => {
  const [medicoes, setMedicoes] = React.useState([]);
  const [metas, setMetas] = React.useState({});
  const [alertasVistos, setAlertasVistos] = React.useState([]);
  // Período escolhido (7, 30 ou 90 dias), compartilhado entre visão geral, gráfico e relatório.
  const [periodo, setPeriodo] = React.useState(30);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  const recarregar = React.useCallback(async () => {
    setErro("");
    try {
      const [lista, metasSalvas, vistos] = await Promise.all([
        servico.listarMedicoes(),
        servico.buscarMetas(),
        servico.listarAlertasVistos(),
      ]);
      setMedicoes([...lista].sort(maisRecentePrimeiro));
      setMetas(metasSalvas || {});
      setAlertasVistos(vistos || []);
    } catch {
      setErro("Não foi possível carregar suas medições. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    recarregar();
  }, [recarregar]);

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
  const marcarAlertaVisto = (id, visto = true) => executar(() => servico.marcarAlertaVisto(id, visto));
  const buscarMedicao = (id) => medicoes.find((item) => item.id === id);

  // Alertas calculados a partir das medições e das metas (mais recentes primeiro).
  const alertas = React.useMemo(
    () =>
      medicoes
        .map((medicao) => ({ medicao, tipo: alertaDaMedicao(medicao, metas) }))
        .filter((item) => item.tipo)
        .map((item) => ({ ...item, visto: alertasVistos.includes(item.medicao.id) })),
    [medicoes, metas, alertasVistos]
  );
  const alertasPendentes = alertas.filter((a) => !a.visto);
  const alertaMaisGrave = [...alertasPendentes].sort(
    (a, b) => ORDEM_ALERTAS.indexOf(a.tipo) - ORDEM_ALERTAS.indexOf(b.tipo)
  )[0];

  return (
    <GlobalContextPressao.Provider
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
        alertas,
        alertasPendentes,
        alertaMaisGrave,
        marcarAlertaVisto,
      }}
    >
      {children}
    </GlobalContextPressao.Provider>
  );
};

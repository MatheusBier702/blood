import React from "react";
import * as servico from "../../services/vacinas";
import { RECOMENDACOES } from "./calendarioVacinas";
import { calcularSituacao, faixaDaIdade, idadeEmMeses } from "./situacaoVacinas";

export const GlobalContextVacinas = React.createContext();

const maisRecentePrimeiro = (a, b) => b.data.localeCompare(a.data);
const MESES_A_FRENTE = 24;

export const GlobalStorageVacinas = ({ children }) => {
  const [perfil, setPerfil] = React.useState(null);
  const [aplicacoes, setAplicacoes] = React.useState([]);
  // Faixa escolhida na navegação (começa na faixa da idade do paciente).
  const [faixa, setFaixa] = React.useState(null);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  const recarregar = React.useCallback(async () => {
    setErro("");
    try {
      const [p, lista] = await Promise.all([servico.buscarPerfil(), servico.listarAplicacoes()]);
      setPerfil(p);
      setAplicacoes([...lista].sort(maisRecentePrimeiro));
      setFaixa((atual) => atual ?? (p?.dataNascimento ? faixaDaIdade(idadeEmMeses(p.dataNascimento)) : "crianca"));
    } catch {
      setErro("Não foi possível carregar sua caderneta de vacinação. Tente novamente.");
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

  const salvarAplicacao = (dados) => executar(() => servico.salvarAplicacao(dados));
  const removerAplicacao = (id) => executar(() => servico.removerAplicacao(id));
  const salvarPerfil = async (dados) => {
    const salvo = await executar(() => servico.salvarPerfil(dados));
    if (salvo?.dataNascimento) setFaixa(faixaDaIdade(idadeEmMeses(salvo.dataNascimento)));
    return salvo;
  };

  // Situação de todas as recomendações (recalculada quando muda o perfil ou o histórico).
  const situacoes = React.useMemo(() => {
    const hoje = new Date();
    return Object.fromEntries(
      RECOMENDACOES.map((r) => [r.id, calcularSituacao(r, perfil?.dataNascimento, aplicacoes, hoje)])
    );
  }, [perfil, aplicacoes]);

  const idadeMeses = perfil?.dataNascimento ? idadeEmMeses(perfil.dataNascimento) : null;

  // Próximas doses: as atrasadas e as previstas para os próximos 24 meses, por data.
  const proximasDoses = React.useMemo(() => {
    const hoje = new Date();
    const limite = new Date(hoje.getFullYear(), hoje.getMonth() + MESES_A_FRENTE, hoje.getDate());
    const vistas = new Set();
    return RECOMENDACOES.map((recomendacao) => ({ recomendacao, calculo: situacoes[recomendacao.id] }))
      .filter(({ calculo }) => calculo?.proximaData && (calculo.proximaAtrasada || calculo.proximaData <= limite))
      // Uma mesma vacina pode aparecer em duas faixas (ex.: hepatite B); mostra uma vez só.
      .filter(({ recomendacao, calculo }) => {
        const chave = `${recomendacao.vacina}-${calculo.proximaRotulo}-${calculo.proximaData.toDateString()}`;
        if (vistas.has(chave)) return false;
        vistas.add(chave);
        return true;
      })
      .sort((a, b) => a.calculo.proximaData - b.calculo.proximaData);
  }, [situacoes]);

  return (
    <GlobalContextVacinas.Provider
      value={{
        perfil,
        idadeMeses,
        faixaAtual: idadeMeses != null ? faixaDaIdade(idadeMeses) : null,
        aplicacoes,
        situacoes,
        proximasDoses,
        faixa,
        setFaixa,
        carregando,
        erro,
        recarregar,
        salvarAplicacao,
        removerAplicacao,
        salvarPerfil,
      }}
    >
      {children}
    </GlobalContextVacinas.Provider>
  );
};

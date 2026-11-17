import axios from "axios";
import { NativeModules, Platform } from "react-native";

// As rotas /api/ubs existem em dois lugares (como o proxy de frutas):
//  1. no Metro, o mesmo servidor que entrega o app em desenvolvimento;
//  2. no servidor Express da API (porta 3000, `node server.js`).
// O app tenta o primeiro e, se não houver conexão (por exemplo, o Expo que abriu a
// página foi fechado), tenta o segundo. O endereço que funcionou fica memorizado.

const PORTA_API = 3000;

function enderecosPossiveis() {
  const configurado = process.env.EXPO_PUBLIC_API_URL;
  if (configurado) return [configurado.replace(/\/$/, "")];
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const api = `${protocol}//${hostname}:${PORTA_API}`;
    return String(port) === String(PORTA_API) ? [""] : ["", api];
  }
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (scriptURL && /^https?:\/\//.test(scriptURL)) {
    const url = new URL(scriptURL);
    return [url.origin, `http://${url.hostname}:${PORTA_API}`];
  }
  if (Platform.OS === "android") return [`http://10.0.2.2:${PORTA_API}`];
  throw new Error("Configure EXPO_PUBLIC_API_URL para buscar as UBSs.");
}

let enderecoQueFuncionou = null;

// Faz o GET no primeiro servidor que responder. Passa para o próximo quando não há
// resposta nenhuma (sem conexão) ou quando o servidor não tem a rota; os demais erros
// (400, 503, 502...) são devolvidos como estão, para o app mostrar a mensagem certa.
async function obter(caminho, params, timeout) {
  const lista = enderecosPossiveis();
  const ordem = enderecoQueFuncionou != null && lista.includes(enderecoQueFuncionou)
    ? [enderecoQueFuncionou, ...lista.filter((e) => e !== enderecoQueFuncionou)]
    : lista;
  let ultimoErro = null;
  for (const base of ordem) {
    try {
      const resposta = await axios.get(`${base}${caminho}`, { params, timeout });
      enderecoQueFuncionou = base;
      return resposta.data;
    } catch (erro) {
      const semConexao = !erro.response && erro.code !== "ECONNABORTED";
      // 404 sem a mensagem da nossa API = esse servidor não tem as rotas de UBS.
      const semARota = erro.response?.status === 404 && !erro.response?.data?.error;
      if (!semConexao && !semARota) throw erro;
      ultimoErro = erro;
    }
  }
  throw ultimoErro;
}

const coordenada = ({ lat, lon }) => `${lat.toFixed(6)},${lon.toFixed(6)}`;

// A primeira busca de uma cidade grande baixa a lista do CNES; o servidor responde
// em até ~1 minuto (ou avisa que ainda está preparando).
export const buscarUbsProximas = async (origem, modo) =>
  obter("/api/ubs/proximas", { origem: coordenada(origem), modo }, 120000);

export const buscarRotaUbs = async (origem, destino, modo) =>
  obter("/api/ubs/rota", { origem: coordenada(origem), destino: coordenada(destino), modo }, 30000);

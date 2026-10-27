import axios from "axios";
import { NativeModules, Platform } from "react-native";

function enderecoApi() {
  const configurado = process.env.EXPO_PUBLIC_API_URL;
  if (configurado) return configurado.replace(/\/$/, "");
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (scriptURL && /^https?:\/\//.test(scriptURL)) {
    return `http://${new URL(scriptURL).hostname}:3000`;
  }
  return Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
}

export const api = axios.create({ baseURL: enderecoApi(), timeout: 15000 });
export const cadastrarUsuario = async (dados) => (await api.post("/api/cadastro", dados)).data;
export const entrarUsuario = async (dados) => (await api.post("/api/login", dados)).data;

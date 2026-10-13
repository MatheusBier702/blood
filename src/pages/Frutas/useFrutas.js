import React from "react";
import { Platform, NativeModules } from "react-native";
import axios from "axios";

const frutas = [
  { nome: "Orange", api: "orange", imagem: require("../../screen/assets/frutas/orange.png") },
  { nome: "Strawberry", api: "strawberry", imagem: require("../../screen/assets/frutas/strawberry.png") },
  { nome: "Apple", api: "apple", imagem: require("../../screen/assets/frutas/apple.png") },
  { nome: "Lemon", api: "lemon", imagem: require("../../screen/assets/frutas/lemon.png") },
  { nome: "Banana", api: "banana", imagem: require("../../screen/assets/frutas/banana.png") },
  { nome: "Mango", api: "mango", imagem: require("../../screen/assets/frutas/mango.png") },
];
const normalizar = (texto) =>
  texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const useFrutas = () => {
  const [fruta, setFruta] = React.useState("");
  const [resultado, setResultado] = React.useState(null);
  const [selecionada, setSelecionada] = React.useState(null);
  const [carregando, setCarregando] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const requisicao = React.useRef(0);
  React.useEffect(
    () => () => {
      requisicao.current += 1;
    },
    []
  );

  const buscar = async (texto = fruta) => {
    if (!texto.trim()) {
      setErro("Escreva o nome da fruta em português ou inglês.");
      return;
    }
    const conhecida = frutas.find(
      (item) =>
        normalizar(item.nome) === normalizar(texto) ||
        item.api === normalizar(texto)
    );
    const id = ++requisicao.current;
    setSelecionada(conhecida || {
      nome: texto.trim(),
      imagem: require("../../screen/assets/frutas/fruit.png"),
    });
    setResultado(null);
    setErro("");
    setCarregando(true);
    try {
      const nome = encodeURIComponent(conhecida ? conhecida.api : texto.trim());
      let base = process.env.EXPO_PUBLIC_API_URL || "";
      if (Platform.OS !== "web" && !base) {
        const scriptURL = NativeModules.SourceCode?.scriptURL;
        if (!scriptURL || !/^https?:\/\//.test(scriptURL)) {
          throw new Error("Configure EXPO_PUBLIC_API_URL para acessar o servidor de frutas.");
        }
        base = new URL(scriptURL).origin;
      }
      const url = `${base.replace(/\/$/, "")}/api/frutas/${nome}${conhecida ? "" : "?traduzir=1"}`;
      const response = await axios.get(url, { timeout: 25000 });
      if (id !== requisicao.current) return;
      if (!response.data?.nutritions)
        throw new Error("Response missing nutritional data");
      setResultado(response.data);
      const imagemFruta = frutas.find((item) => item.api === normalizar(response.data.name || ""));
      setSelecionada({
        nome: texto.trim(),
        imagem: imagemFruta?.imagem || require("../../screen/assets/frutas/fruit.png"),
      });
    } catch (error) {
      if (id !== requisicao.current) return;
      setErro(
        error.response?.status === 404
          ? "Fruta não encontrada. Tente outro nome."
          : error.response?.data?.error || (error.message.startsWith("Configure ") ? error.message : "Não foi possível consultar a fruta. Tente novamente.")
      );
    } finally {
      if (id === requisicao.current) setCarregando(false);
    }
  };

  return { fruta, setFruta, resultado, selecionada, carregando, erro, buscar };
};

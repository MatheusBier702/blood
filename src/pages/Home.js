import React from "react";
import { View, FlatList, Pressable, Text } from "react-native";
import { Cards } from "../screen/components/Cards";
import Header from "../screen/components/Header";
import { useNavigation } from "@react-navigation/native";

const Home = () => {

    const navigation = useNavigation();

    const informacoes = [
    {
      nome: "Sangue",
      slug: "Sangue",
      descricao: "Aprenda sobre o sangue e sua importância para o corpo.",
      imagem: require("../screen/assets/sangue.png"),
    },
    {
      nome: "Água",
      slug: "Agua",
      descricao:
        "Descubra por que a água é importante para manter o corpo saudável.",
      imagem: require("../screen/assets/agua.png"),
    },
    {
      nome: "Remédio",
      slug: "Remedio",
      descricao: "Saiba como usar os medicamentos de forma correta e segura.",
      imagem: require("../screen/assets/remedio.png"),
    },
    {
      nome: "Alergias",
      slug: "Alergias",
      descricao: "Entenda o que são alergias e como elas podem afetar o corpo.",
      imagem: require("../screen/assets/alergia.png"),
    },
    {
      nome: "Glicemia",
      slug: "Glicemia",
      descricao:
        "Aprenda o que é a glicemia e por que controlar o açúcar no sangue é importante.",
      imagem: require("../screen/assets/glicemia.png"),
    },
    {
      nome: "Pressão",
       slug: "Pressao",
      descricao: "Entenda a pressão arterial e sua importância para a saúde.",
      imagem: require("../screen/assets/pressao.png"),
    },
    {
      nome: "IMC",
       slug: "Imc",
      descricao:
        "Descubra o que é o IMC e como ele pode ajudar a acompanhar seu peso.",
      imagem: require("../screen/assets/imc.png"),
    },
    {
      nome: "Vacinas",
       slug: "Vacinas",
      descricao:
        "Aprenda como as vacinas ajudam a proteger o corpo contra doenças.",
      imagem: require("../screen/assets/vacina.png"),
    },
    {
      nome: "Meditação",
       slug: "Meditacao",
      descricao:
        "Conheça os benefícios da meditação para a mente e o bem-estar.",
      imagem: require("../screen/assets/meditacao.png"),
    },
    {
      nome: "Fruta",
       slug: "Fruta",
      descricao:
        "Descubra como as frutas podem contribuir para uma alimentação saudável.",
      imagem: require("../screen/assets/fruta.png"),
    },
    {
      nome: "Dica",
      slug: "Dica",
      descricao:
        "Confira dicas simples para cuidar melhor da sua saúde no dia a dia.",
      imagem: require("../screen/assets/dica.png"),
    },
    {
      nome: "Emergência",
      slug: "Emergencia",
      descricao: "Saiba o que fazer e como agir em situações de emergência.",
      imagem: require("../screen/assets/emergencia.png"),
    },
  ];

  return (
    <View style={{ flex: 1 }}>

      <Header />

      <Pressable onPress={() => navigation.navigate("Perfil")}
      style={{
        padding: 15,
        margin: 20,
        backgroundColor: "#12B76A",
        borderRadius: 12,
        }}>

      <Text style={{
         color: "#fff",
          textAlign: "center",
           fontWeight: "bold"
            }}>Meu Perfil</Text>
     
      </Pressable>
      <FlatList
        data={informacoes}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <Cards
            nome={item.nome}
            descricao={item.descricao}
            imagem={item.imagem}
            slug={item.slug}
          />
        )}
      />

    </View>
  );
};

export default Home
import React from "react";
import { View, StyleSheet } from 'react';

import FotoPerfil from "./fotoPerfil/fotoPerfil";
import DadosPerfil from "./dadosPerfil/dadosPerfil";
import Header from "../../screen/components/Header";


export default function Perfil(){

    return (
        <View style={styles.container}>

            <Header titulo="Perfil" voltar />

            <FotoPerfil />

            <DadosPerfil />

        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
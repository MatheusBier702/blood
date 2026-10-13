# Busca de frutas com DeepL

Preencha `DEEPL_API_KEY` no arquivo `.env.local` na raiz do projeto. Esse arquivo
já é ignorado pelo Git. Nunca coloque a chave em uma variável EXPO_PUBLIC.

Reinicie o Expo com `npm run web`. Nomes em português passam pela DeepL antes
da Fruityvice. As seis frutas cadastradas em inglês são consultadas diretamente.
Traduções repetidas são armazenadas em memória até o servidor reiniciar.

No Expo Go local, a aplicação usa o endereço do Metro para acessar o proxy.
Em builds publicados, configure EXPO_PUBLIC_API_URL com o endereço do backend
que executa `node server.js`. O proxy do Metro existe apenas em desenvolvimento.

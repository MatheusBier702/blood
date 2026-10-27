# Cadastro e login com MySQL

A aplicaÃ§Ã£o usa Expo (8081), a API Express (3000) e MySQL/XAMPP (3307).
O backend segue CommonJS e os componentes do aplicativo continuam em JavaScript.

1. Instale as dependÃªncias na raiz com `npm install`.
2. Execute `server/schema.sql` no MySQL/phpMyAdmin para criar o banco e a tabela.
   Se jÃ¡ houver uma tabela `usuarios`, faÃ§a uma migraÃ§Ã£o para incluir `idade`,
   `peso` e `altura`; `CREATE TABLE IF NOT EXISTS` nÃ£o altera tabelas existentes.
3. Copie `server/.env.example` para `server/.env` e ajuste suas credenciais.
4. Inicie a API com `npm run server` (ou `node server/index.js`).
5. Inicie o aplicativo em outro terminal com `npm start` ou `npm run web`.

No celular, use a mesma rede do computador e libere a porta 3000 no firewall.
O app usa o host do Metro na porta 3000. Para outro endereÃ§o ou builds publicados,
configure `EXPO_PUBLIC_API_URL=http://IP-DO-COMPUTADOR:3000` em `.env.local`
e reinicie o Expo. No emulador Android, o fallback Ã© `http://10.0.2.2:3000`.
Em hospedagem, configure a URL HTTPS da API.

- `POST /api/cadastro`: nome, email, senha (8 a 128 caracteres), tipo_sangue,
  idade, peso (kg) e altura (cm). Campos de perfil sÃ£o opcionais.
- `POST /api/login`: email e senha. Retorna o perfil sem o hash da senha.
- Email Ã© Ãºnico; as consultas usam parÃ¢metros e as senhas usam scrypt com sal.
- O botÃ£o Cadastrar/Entrar sÃ³ abre a Home apÃ³s confirmaÃ§Ã£o da API.
- O login valida credenciais e carrega o perfil em memÃ³ria; nÃ£o emite token de
  sessÃ£o nem protege recursos adicionais. Novas rotas privadas exigirÃ£o sessÃ£o.
- Senhas em texto de implementaÃ§Ãµes antigas precisam ser redefinidas ou migradas.

# Busca de frutas com DeepL

Preencha `DEEPL_API_KEY` no arquivo `.env.local` na raiz do projeto. Esse arquivo
jÃƒÂ¡ ÃƒÂ© ignorado pelo Git. Nunca coloque a chave em uma variÃƒÂ¡vel EXPO_PUBLIC.

Reinicie o Expo com `npm run web`. Nomes em portuguÃƒÂªs passam pela DeepL antes
da Fruityvice. As seis frutas cadastradas em inglÃƒÂªs sÃƒÂ£o consultadas diretamente.
TraduÃƒÂ§ÃƒÂµes repetidas sÃƒÂ£o armazenadas em memÃƒÂ³ria atÃƒÂ© o servidor reiniciar.

No Expo Go local, a aplicaÃƒÂ§ÃƒÂ£o usa o endereÃƒÂ§o do Metro para acessar o proxy.
Em builds publicados, configure EXPO_PUBLIC_API_URL com o endereÃƒÂ§o do backend
que executa `node server.js`. O proxy do Metro existe apenas em desenvolvimento.

Validação das rotas: `node --test server/usuarios.test.cjs` (banco simulado).

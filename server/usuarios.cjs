const { Router } = require('express');
const { randomBytes, scrypt: derivar, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(derivar);
const tipos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

async function criarHash(senha) {
  const sal = randomBytes(16).toString('hex');
  const hash = await scrypt(senha, sal, 64);
  return `${sal}:${hash.toString('hex')}`;
}

async function conferirSenha(senha, armazenada) {
  const [sal, hash] = String(armazenada).split(':');
  if (!sal || !/^[a-f0-9]{128}$/.test(hash || '')) return false;
  const calculada = await scrypt(senha, sal, 64);
  return timingSafeEqual(Buffer.from(hash, 'hex'), calculada);
}

function criarRotasUsuarios(db) {
  const router = Router();
  router.post('/cadastro', async (req, res) => {
    const dados = req.body || {};
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';
    const { senha, tipo_sangue } = dados;
    if (!nome || nome.length > 100 || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || typeof senha !== 'string' || senha.length < 8 || senha.length > 128) {
      return res.status(400).json({ error: 'Informe nome, email válido e senha de 8 a 128 caracteres.' });
    }
    if (tipo_sangue && !tipos.includes(tipo_sangue)) {
      return res.status(400).json({ error: 'Tipo sanguíneo inválido.' });
    }
    const perfil = {};
    for (const [campo, maximo] of [['idade', 130], ['peso', 1000], ['altura', 300]]) {
      const valor = dados[campo];
      perfil[campo] = valor == null || valor === '' ? null : Number(String(valor).replace(',', '.'));
      if (perfil[campo] !== null && (!Number.isFinite(perfil[campo]) || perfil[campo] <= 0
        || perfil[campo] > maximo || (campo === 'idade' && !Number.isInteger(perfil[campo])))) {
        return res.status(400).json({ error: `Informe um valor válido para ${campo}.` });
      }
    }
    try {
      const hash = await criarHash(senha);
      const [resultado] = await db.execute(
        'INSERT INTO usuarios (nome, email, senha, tipo_sangue, idade, peso, altura) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nome, email, hash, tipo_sangue || null, perfil.idade, perfil.peso, perfil.altura]
      );
      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: resultado.insertId,
        usuario: { id: resultado.insertId, nome, email, tipo_sangue: tipo_sangue || null, ...perfil } });
    } catch (erro) {
      if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email já cadastrado.' });
      console.error('Erro no cadastro:', erro.code);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário. Tente novamente.' });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, senha } = req.body || {};
    if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha || senha.length > 128) {
      return res.status(400).json({ error: 'Informe email e senha.' });
    }
    try {
      const [rows] = await db.execute(
        'SELECT id, nome, email, senha, tipo_sangue, idade, peso, altura FROM usuarios WHERE email = ?',
        [email.trim().toLowerCase()]
      );
      if (!rows.length || !(await conferirSenha(senha, rows[0].senha))) {
        return res.status(401).json({ error: 'Email ou senha incorretos.' });
      }
      const { senha: hash, ...usuario } = rows[0];
      return res.json({ message: 'Login realizado com sucesso!', usuario });
    } catch (erro) {
      console.error('Erro no login:', erro.code);
      return res.status(500).json({ error: 'Erro ao realizar login. Tente novamente.' });
    }
  });
  return router;
}

module.exports = { criarRotasUsuarios };

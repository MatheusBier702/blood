const test = require('node:test');
const assert = require('node:assert/strict');
const { criarApp } = require('./index');

test('cadastro e login pela API', async () => {
  let usuario;
  const banco = { async execute(sql, valores) {
    if (sql.startsWith('INSERT')) {
      if (usuario) throw Object.assign(new Error(), { code: 'ER_DUP_ENTRY' });
      const [nome, email, senha, tipo_sangue, idade, peso, altura] = valores;
      usuario = { id: 1, nome, email, senha, tipo_sangue, idade, peso, altura };
      return [{ insertId: 1 }];
    }
    return [usuario && valores[0] === usuario.email ? [usuario] : []];
  } };
  const servidor = criarApp(banco).listen(0, '127.0.0.1');
  await new Promise(resolve => servidor.once('listening', resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const post = async (rota, dados) => {
    const res = await fetch(`${base}/api/${rota}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados),
    });
    return { status: res.status, dados: await res.json() };
  };
  try {
    assert.equal((await post('cadastro', {})).status, 400);
    assert.equal((await post('cadastro', { nome: 'Ana', email: 'ana@example.com', senha: '12345678', tipo_sangue: 'Z+' })).status, 400);
    assert.equal((await post('login', {})).status, 400);
    const cadastro = { nome: 'Ana', email: ' ANA@example.com ', senha: '12345678', tipo_sangue: 'O+', idade: 25, peso: '60,5', altura: 170 };
    const criado = await post('cadastro', cadastro);
    assert.equal(criado.status, 201);
    assert.equal(criado.dados.usuario.peso, 60.5);
    assert.equal(criado.dados.usuario.email, 'ana@example.com');
    assert.equal(criado.dados.usuario.senha, undefined);
    assert.notEqual(usuario.senha, cadastro.senha);
    assert.equal((await post('cadastro', cadastro)).status, 409);
    assert.equal((await post('login', { email: 'ana@example.com', senha: 'incorreta' })).status, 401);
    assert.equal((await post('login', { email: 'outra@example.com', senha: '12345678' })).status, 401);
    const login = await post('login', { email: 'ANA@example.com', senha: '12345678' });
    assert.equal(login.status, 200);
    assert.equal(login.dados.usuario.nome, 'Ana');
    assert.equal(login.dados.usuario.senha, undefined);
    const malformado = await fetch(`${base}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(malformado.status, 400);
    const frutas = await fetch(`${base}/api/frutas/apple`, { method: 'OPTIONS' });
    assert.equal(frutas.status, 204);
  } finally {
    await new Promise(resolve => servidor.close(resolve));
  }
});

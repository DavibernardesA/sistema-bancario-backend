require('dotenv').config()
const express = require('express');
const usuario = require('../controllers/usuario');
const conta = require('../controllers/conta');
const { usuarioLogado } = require('../middlewares/auth');

const rotas = express();

rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.post('/login', usuario.login);

rotas.use(usuarioLogado);

rotas.get('/perfil', usuario.perfil);
rotas.put('/perfil', usuario.editarPerfil);
rotas.delete('/perfil/delete', usuario.deletarPerfil);

rotas.put('/depositar', conta.depositar);
rotas.get('/perfil/depositos', conta.acessarDepositos);
rotas.post('/sacar', conta.sacar);
rotas.get('/perfil/saques', conta.acessarSaques);
rotas.post('/transferir', conta.transferir);
rotas.get('/perfil/saldo', conta.acessarSaldo);
rotas.get('/perfil/extrato', conta.emitirExtrato);

module.exports = rotas;

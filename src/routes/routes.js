require('dotenv').config()
const express = require('express');
const usuario = require('../controllers/usuario');
const login = require('../controllers/login')
const conta = require('../controllers/conta');
const { usuarioLogado } = require('../middlewares/auth');

const rotas = express();

rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.post('/login', login.login);


rotas.get('/perfil', usuarioLogado, usuario.perfil);
rotas.put('/perfil', usuarioLogado, usuario.editarPerfil);
rotas.delete('/perfil/delete', usuario.deletarPerfil);

rotas.put('/depositar', usuarioLogado, conta.depositar);
rotas.get('/perfil/depositos', usuarioLogado, conta.acessarDepositos);
rotas.post('/sacar', usuarioLogado, conta.sacar);
rotas.get('/perfil/saques', usuarioLogado, conta.acessarSaques);
rotas.post('/transferir', usuarioLogado, conta.transferir);
rotas.get('/perfil/saldo', usuarioLogado, conta.acessarSaldo);
rotas.get('/perfil/extrato', usuarioLogado, conta.emitirExtrato);

module.exports = rotas;

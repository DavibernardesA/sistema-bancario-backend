require('dotenv').config()
const express = require('express');
const limitingRequests = require('../config/security/limitingRequests');
const cors = require('cors');

const usuario = require('../controllers/usuario');
const login = require('../controllers/login')
const conta = require('../controllers/conta');
const usuarioLogado = require('../middlewares/auth');
const { validateBodyRequest } = require('../config/validation/schemaUser');
const { schemaCadastro, schemaLogin } = require('../middlewares/validateBody')

const rotas = express();

rotas.use(limitingRequests)
rotas.use(cors());

rotas.post('/usuario', validateBodyRequest(schemaCadastro), usuario.cadastrarUsuario);
rotas.post('/login', validateBodyRequest(schemaLogin), login.login);

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

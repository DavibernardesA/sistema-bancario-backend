const express = require('express');
const usuario = require('../controllers/usuario');
const { usuarioLogado } = require('../middlewares/auth');

const rotas = express();

rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.post('/login', usuario.login);

rotas.use(usuarioLogado);

rotas.get('/perfil', usuario.perfil);
rotas.put('/perfil', usuario.editarPerfil);
rotas.delete('/perfil/delete', usuario.deletarPerfil);

module.exports = rotas;

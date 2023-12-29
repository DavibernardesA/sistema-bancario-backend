const jwt = require('jsonwebtoken');
const knex = require('../config/connections/connect');
const senhaJwt = require('../config/security/paswordJwt');
const bcrypt = require('bcrypt');
const chat = require('../config/chat/statusCode');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = await knex('usuarios')
      .where({ nome })
      .orWhere({ email })
      .first();

    if (usuarioExistente) {
      return res.status(400).json(chat.error400)
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const saldo = 0;
    const [usuarioCadastrado] = await knex('usuarios')
      .insert({ nome, email, senha: senhaCriptografada, saldo })
      .returning('*');

    delete usuarioCadastrado.senha;

    return res.status(201).json(usuarioCadastrado);

  } catch (error) {
    console.error(error.message);
    return res.status(500).json(chat.error500);
  }
};


const perfil = (req, res) => {
  try {
    const usuario = req.user
    delete usuario.senha
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const editarPerfil = async (req, res) => {
  const usuario = req.user;
  const id = usuario.id;
  const { nome, email, senha } = req.body;

  try {
    const usuarioObj = {
      email: email || usuario.email,
      nome: nome || usuario.nome,
      senha: senha || usuario.senha,
    };

    await knex('usuarios')
      .where('id', id)
      .update({
        email: usuarioObj.email,
        nome: usuarioObj.nome,
        senha: usuarioObj.senha,
      });

    return res.status(201).json(chat.status201);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const deletarPerfil = async (req, res) => {
  const usuario = req.user;
  const id = usuario.id;
  const { senha, confirmarSenha } = req.body;

  if (!senha || !confirmarSenha) {
    return res.status(400).json(chat.error400);
  }

  try {
    const [usuarioCadastrado] = await knex('usuarios').where({ id });

    if (!usuarioCadastrado) {
      return res.status(404).json(chat.error404);
    }

    const senhaCorrespondente = await bcrypt.compare(senha, usuarioCadastrado.senha);

    if (!senhaCorrespondente) {
      return res.status(401).json(chat.error401);
    }

    await knex('usuarios').where({ id }).del();

    return res.status(204).json();

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const usuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, senhaJwt);

    const [usuarioCadastrado] = await knex('usuarios').where({ id });

    if (!usuarioCadastrado) {
      return res.status(401).json({ message: 'Não autorizado.' });
    }

    req.user = usuarioCadastrado;

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Não autorizado.' });
  }
}

module.exports = {
  cadastrarUsuario,
  perfil,
  editarPerfil,
  deletarPerfil,
  usuarioLogado
};

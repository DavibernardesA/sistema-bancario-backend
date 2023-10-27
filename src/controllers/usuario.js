const pool = require("../config/connections/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordJwt = require("../config/security/paswordJwt");
const chat = require('../config/chat/statusCode');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const saldo = 0;
    const { rows: usuariosCadastrados } = await pool.query('insert into usuarios (nome, email, senha, saldo) values ($1, $2, $3, $4) returning *', [nome,
      email, senhaCriptografada, saldo]);

    const usuarioCadastrado = usuariosCadastrados[0];
    delete usuarioCadastrado.senha;

    return res.status(201).json(usuarioCadastrado);

  } catch (error) {
    console.log(error.message);
    return res.json(chat.error500);
  }
}

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email, !senha) {
    return res.status(400).json(chat.error400);
  }

  try {
    const { rowCount: emailCadastrado, rows: usuariosCadastrados } = await pool.query('select * from usuarios where email = $1', [email]);

    if (emailCadastrado < 1) {
      return res.status(404).json(chat.error404)
    }

    const usuarioCadastrado = usuariosCadastrados[0];
    const conferirSenha = await bcrypt.compare(senha, usuarioCadastrado.senha);

    if (!conferirSenha) {
      return res.status(401).json(chat.error401);
    }


    const token = jwt.sign({ id: usuarioCadastrado.id }, passwordJwt, { expiresIn: "8h" });

    return res.json({ token });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
}

const perfil = (req, res) => {
  try {
    return res.status(200).json(req.user);
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

    const usuarioAtualizado = await pool.query(
      "update usuarios set email = $1, nome = $2, senha = $3 where id = $4",
      [usuarioObj.email, usuarioObj.nome, usuarioObj.senha, id]
    );

    return res.status(201).json(req.user);

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
    const { rows: usuariosCadastrados } = await pool.query(
      'select * from usuarios where id = $1',
      [id]
    );

    if (usuariosCadastrados.length === 0) {
      return res.status(404).json(chat.error404);
    }

    const usuarioCadastrado = usuariosCadastrados[0];
    const senhaCorrespondente = await bcrypt.compare(senha, usuarioCadastrado.senha);

    if (!senhaCorrespondente) {
      return res.status(401).json(chat.error401);
    }

    await pool.query('delete from usuarios where id = $1', [id]);

    return res.status(204).json();

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

module.exports = {
  cadastrarUsuario,
  login,
  perfil,
  editarPerfil,
  deletarPerfil
}

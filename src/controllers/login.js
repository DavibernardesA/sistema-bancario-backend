const chat = require('../config/chat/statusCode');
const knex = require("../config/connections/connect");
const jwt = require("jsonwebtoken");
const passwordJwt = require("../config/security/paswordJwt");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json(chat.error400);
  }

  try {
    const usuariosCadastrados = await knex('usuarios').where({ email }).select('*');

    if (usuariosCadastrados.length < 1) {
      return res.status(404).json(chat.error404);
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

module.exports = {
  login
}

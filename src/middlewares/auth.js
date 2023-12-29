const jwt = require('jsonwebtoken');
const knex = require('../config/connections/connect');
const senhaJwt = require('../config/security/paswordJwt');

const usuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, senhaJwt);

    const usuario = await knex('usuarios').where({ id }).select('*').first();

    if (!usuario) {
      return res.status(401).json({ message: 'Não autorizado.' });
    }

    req.user = usuario;

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Não autorizado.' });
  }
};

module.exports = usuarioLogado;

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

    const rows = await knex('usuarios').where('id', id).select('*');

    if (rows.length < 1) {
      return res.status(401).json({ message: 'Não autorizado.' });
    }

    req.user = rows[0];

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Não autorizado.' });
  }
}

module.exports = {
  usuarioLogado
};

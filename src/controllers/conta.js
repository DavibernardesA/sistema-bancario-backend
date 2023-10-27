const chat = require('../config/chat/statusCode');
const pool = require("../config/connections/connect");
const { obterDataAtual } = require('../config/functions/function');

const depositar = async (req, res) => {
  const usuario = req.user;
  const usuario_id = usuario.id;
  const { valor } = req.body;
  const dataAtual = obterDataAtual();

  if (!valor) {
    return res.status(400).json(chat.error400);
  }

  if (valor < 1) {
    return res.status(400).json({ mensagem: "O valor de deposito deve exceder zero." })
  }

  try {
    const deposito = await pool.query('insert into depositos (valor, data, usuario_id) values ($1, $2, $3)', [valor, dataAtual, usuario_id]);

    const novoSaldo = usuario.saldo + valor;
    const atualizarSaldo = await pool.query('update usuarios set saldo = saldo + $1 where id = $2', [novoSaldo, usuario_id]);

    return res.status(204).json();

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const acessarDepositos = async (req, res) => {
  const usuario = req.user;
  try {
    const { rows: depositos, rowCount: numeroDeDepositos } = await pool.query('select * from depositos where usuario_id = $1', [usuario.id])

    if (numeroDeDepositos < 1) {
      return res.status(404).json({ mensagem: 'Você não tem depositos registrados.' })
    }
    const resultado = {
      numeroDeDepositos: numeroDeDepositos,
      depositos
    }

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

module.exports = {
  depositar,
  acessarDepositos,
  sacar,
  acessarSaques
}

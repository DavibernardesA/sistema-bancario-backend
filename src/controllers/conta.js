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
    const atualizarSaldo = await pool.query('update usuarios set saldo = $1 where id = $2', [novoSaldo, usuario_id]);

    return res.status(204).json();

  } catch (error) {
    console.log(error.message);
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

const sacar = async (req, res) => {
  const usuario = req.user;
  const usuario_id = usuario.id;
  const { valor } = req.body;
  const dataAtual = obterDataAtual();

  if (!valor) {
    return res.status(400).json(chat.error400);
  }

  if (valor < 1) {
    return res.status(400).json({ mensagem: 'O valor do saque deve exceder zero.' })
  }

  if (valor > usuario.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar o saque.' });
  }

  try {
    const saque = await pool.query('insert into saques (valor, data, usuario_id) values ($1, $2, $3)', [valor, dataAtual, usuario_id,]);

    const novoSaldo = usuario.saldo - valor;
    await pool.query('update usuarios set saldo = $1 where id = $2', [novoSaldo, usuario_id]);

    return res.status(204).json();

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
}

const acessarSaques = async (req, res) => {
  const usuario = req.user;
  try {
    const { rows: saques, rowCount: numeroDeSaques } = await pool.query('select * from saques where usuario_id = $1', [usuario.id])

    if (numeroDeSaques < 1) {
      return res.status(404).json({ mensagem: 'Você não tem saques registrados.' })
    }

    const resultado = {
      numeroDeSaques: numeroDeSaques,
      saques
    }

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const transferir = async (req, res) => {
  const usuario = req.user;
  const { valor, destinatario_id } = req.body;
  const remetente_id = usuario.id;
  const dataAtual = obterDataAtual();

  if (!valor || !destinatario_id) {
    return res.status(400).json(chat.error400);
  }

  if (valor < 1) {
    return res.status(400).json({ mensagem: 'O valor do saque deve exceder zero.' })
  }

  const { rows: destinatario } = await pool.query('select saldo from usuarios where id = $1', [destinatario_id]);

  if (destinatario.length === 0) {
    return res.status(404).json({ mensagem: 'Destinatário não encontrado.' });
  }

  try {

    const saldoRemetente = usuario.saldo;

    if (valor > saldoRemetente) {
      return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar a transferência.' });
    }

    await pool.query('insert into transferencias (usuario_id_origem, numero_conta_destino, valor, data) values ($1, $2, $3, $4)', [remetente_id, destinatario_id, valor, dataAtual]);

    const novoSaldoRemetente = saldoRemetente - valor;
    await pool.query('update usuarios set saldo = $1 where id = $2', [novoSaldoRemetente, remetente_id]);

    const saldoDestinatario = destinatario[0].saldo;
    const novoSaldoDestinatario = saldoDestinatario + valor;

    await pool.query('update usuarios set saldo = $1 where id = $2', [novoSaldoDestinatario, destinatario_id]);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const acessarSaldo = (req, res) => {
  try {
    const saldo = req.user.saldo;
    return res.status(200).json(saldo);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
}

const emitirExtrato = async (req, res) => {
  const usuario = req.user;

  try {
    const saldo = usuario.saldo;

    const { rows: transferenciasEmitidas } = await pool.query(
      'select * from transferencias where usuario_id_origem = $1',
      [usuario.id]
    );

    const { rows: transferenciasRecebidas } = await pool.query(
      'select * from transferencias where numero_conta_destino = $1',
      [usuario.id]
    );

    const { rows: depositos } = await pool.query(
      'select * from depositos where usuario_id = $1',
      [usuario.id]
    );

    const { rows: saques } = await pool.query(
      'select * from saques where usuario_id = $1',
      [usuario.id]
    );

    const numeroDeMovimentacoes = transferenciasEmitidas.length + transferenciasRecebidas.length + depositos.length + saques.length;

    const extrato = {
      numeroDeMovimentacoes: numeroDeMovimentacoes,
      saldo,
      transferenciasEmitidas,
      transferenciasRecebidas,
      depositos,
      saques,
    };

    return res.status(200).json(extrato);
  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

module.exports = {
  depositar,
  acessarDepositos,
  sacar,
  acessarSaques,
  transferir,
  acessarSaldo,
  emitirExtrato
}

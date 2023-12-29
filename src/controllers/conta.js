const chat = require('../config/chat/statusCode');
const knex = require('../config/connections/connect');
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
    return res.status(400).json({ mensagem: 'O valor de depósito deve exceder zero.' });
  }

  try {
    await knex('depositos').insert({ valor, data: dataAtual, usuario_id });

    const novoSaldo = usuario.saldo + valor;
    await knex('usuarios').where({ id: usuario_id }).update({ saldo: novoSaldo });

    return res.status(201).json(chat.status201);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
};

const acessarDepositos = async (req, res) => {
  const usuario = req.user;
  try {
    const depositos = await knex('depositos').select('*').where({ usuario_id: usuario.id });

    if (depositos.length < 1) {
      return res.status(404).json({ mensagem: 'Você não tem depósitos registrados.' });
    }

    const resultado = {
      "Número de depositos": depositos.length,
      depositos,
    };

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const sacar = async (req, res) => {
  const usuario = req.user;
  const usuario_id = usuario.id;
  const { valor } = req.body;
  const dataAtual = obterDataAtual();

  if (!valor) {
    return res.status(400).json(chat.error400);
  }

  if (valor < 1) {
    return res.status(400).json({ mensagem: 'O valor do saque deve exceder zero.' });
  }

  if (valor > usuario.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar o saque.' });
  }

  try {
    await knex('saques').insert({ valor, data: dataAtual, usuario_id });

    const novoSaldo = usuario.saldo - valor;
    await knex('usuarios').where({ id: usuario_id }).update({ saldo: novoSaldo });

    return res.status(201).json(chat.status201);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(chat.error500);
  }
};

const acessarSaques = async (req, res) => {
  const usuario = req.user;
  try {
    const saques = await knex('saques').select('*').where({ usuario_id: usuario.id });

    if (saques.length < 1) {
      return res.status(404).json({ mensagem: 'Você não tem saques registrados.' });
    }

    const resultado = {
      numeroDeSaques: saques.length,
      saques,
    };

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json(chat.error500);
  }
};

const transferir = async (req, res) => {
  const usuario = req.user;
  const { valor, destinatario_id } = req.body;
  const remetente_id = usuario.id;
  const dataAtual = obterDataAtual();

  if (!valor || !destinatario_id) {
    return res.status(400).json(chat.error400);
  }

  if (valor < 1) {
    return res.status(400).json({ mensagem: 'O valor do saque deve exceder zero.' });
  }

  const destinatario = await knex('usuarios').select('saldo').where({ id: destinatario_id });

  if (destinatario.length === 0) {
    return res.status(404).json({ mensagem: 'Destinatário não encontrado.' });
  }

  try {
    const saldoRemetente = usuario.saldo;

    if (valor > saldoRemetente) {
      return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar a transferência.' });
    }

    await knex('transferencias').insert({ usuario_id_origem: remetente_id, numero_conta_destino: destinatario_id, valor, data: dataAtual });

    const novoSaldoRemetente = saldoRemetente - valor;
    await knex('usuarios').where({ id: remetente_id }).update({ saldo: novoSaldoRemetente });

    const saldoDestinatario = destinatario[0].saldo;
    const novoSaldoDestinatario = saldoDestinatario + valor;

    await knex('usuarios').where({ id: destinatario_id }).update({ saldo: novoSaldoDestinatario });

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
};

const emitirExtrato = async (req, res) => {
  const usuario = req.user;

  try {
    const saldo = usuario.saldo;

    const transferenciasEmitidas = await knex('transferencias').select('*').where({ usuario_id_origem: usuario.id });
    const transferenciasRecebidas = await knex('transferencias').select('*').where({ numero_conta_destino: usuario.id });
    const depositos = await knex('depositos').select('*').where({ usuario_id: usuario.id });
    const saques = await knex('saques').select('*').where({ usuario_id: usuario.id });

    const numeroDeMovimentacoes = transferenciasEmitidas.length + transferenciasRecebidas.length + depositos.length + saques.length;

    const extrato = {
      numeroDeMovimentacoes,
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
  emitirExtrato,
};

const validarCadastro = async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  const { rowCount: emailCadastrado } = await pool.query('select * from usuarios where email = $1', [email]);

  if (emailCadastrado) {
    return res.status(400).json(chat.error400);
  }

  next()
}

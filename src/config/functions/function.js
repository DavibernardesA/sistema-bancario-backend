function obterDataAtual() {
  const data = new Date();
  return data.toLocaleString('pt-BR');
}

module.exports = {
  obterDataAtual,

}

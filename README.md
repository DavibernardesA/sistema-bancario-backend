# sistema-bancario-backend
## Sistema Bancário API🌐


<table>
  <tr>
    <td>
      <img src="SUA IMAGEM AQUI" alt="" style="width: 100%; height: auto;">
      <div style="text-align: center;">Funcionalidades no Insomnia</div>
    </td>
    <td>
      <img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/0ef1e8e5-a929-41c0-9425-576bd1a6764e" alt="" style="width: 100%; height: auto;">
      <div style="text-align: center;">Organização das pastas</div>
    </td>
  </tr>
</table>

## Descrição
Este é um sistema bancário API que fornece serviços e funcionalidades essenciais para uma aplicação financeira. Foi desenvolvido como parte do meu portfólio para demonstrar minhas habilidades na criação de APIs.

## Técnicas e tecnologias utilizadas🛠️
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)


## Recursos✔️

Funcionalidades:

**Usuário**

- Cadastrar usuário

- login

- Visualizar conta

- Editar cadastro do usuário

- Excluir cadastro do usuário

**Conta Bancária**

- Depositar em uma conta bancária

- Sacar de uma conta bancária

- Transferir valores entre contas bancárias

- Consultar saldo da conta bancária

- Emitir extrato de uma conta bancária

Instruções para criação do banco de dados presentes no arquivo '/src/config/database/dump.sql' :

```
dump.sql

```


## Como Usar👆
npm install para instalar pacotes utilizados para construção desta API:

- 'pg' - criação do Pool para conexão com o banco de dados;

- 'Bcrypt' - Responsável pela segurança da informação "senha" do usuário

- 'jsonwebtoken' - Responsável pela criação de um token para autenticação do usuário

- 'express' - Criação da API

## IMPORTANTE!

No arquivo "conexao.js" presente na pasta "src" será necessário editar as informações de usuário necessárias para acessar o banco de dados local:

```
const { Pool } = require('pg');

const pool = new Pool({
  user: "SEU USUÁRIO AQUI",
  host: "localhost",
  database: "projetosistemabancario",
  password: "SUA SENHA AQUI",
  port: 5432
});

const query = (text, param)=>{
  return pool.query(text, param);
}

module.exports = { query }
```

Após instalação de pacotes e edição do arquivo "conexao.js", execute o comando:

    npm run dev



**Agora a API já está funcionando!**

## Rotas e Endpoints - Usuário

- Cadastro de usuário:
  
  Método **POST**
  
  ''**/usuario**'' - Recebe  dados do usuário a ser cadastrado pelo corpo da requisição.

- Login do usuário:
  
  Método **POST**
  
  "**/login**" - Recebe email e senha cadastrados pelo usuário fazendo validações. Para efetuar o login a API valida a senha informada no corpo da requisição da rota com a HASH criada pelo pacote "secure-password" que está guardada no banco de dados como a "senha" do usuário. Ao validar as informações, o pacote "jsonwebtoken" cria um elemento "token" que será usado para transmitir as informações do usuário para outras rotas.

- Autenticação:
  
    O arquivo "pessoaLogada.js" é um middleware responsável pela criação do "token" no momento do **Login**. Este token é utilizado para fazer a autenticação do usuário para que possa acessar **todas** rotas exceto: "/cadastrar" e "/login".

Visualizar perfil do usuário:
  
  Método **GET** 
  
  "**/perfil**" - Responde a requisição mostrando os dados do usuário recebidos pela requisição e suas publicações.

  - Editar cadastro do usuário:
  
  Método **PUT**
  
  "**/perfil**" - Recebe as informações do usuário através do "token" criado quando o usuário efetua o login, e permite alteração do cadastro no banco de dados. **A edição de todos os campos são obrigatórias**.

- Excluir cadastro do usuário:
  
  Método **DELETE**
  
  "**/perfil/delete**" - Recebe as informações do usuário através do "token" criado quando usuário efetua o login. Permite o usuário excluir seu cadastro do  banco de dados.



## Autor✍️ 

<a href=https://github.com/DavibernardesA>
<img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/6ba09c22-9eae-4601-980c-81533bd7b4f9" width="100px;" alt=""/>
<br>
<b>Davi Bernardes</b></a>
<br/>
Entre em contato: 


[![Linkedin Badge](https://img.shields.io/badge/-Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/davi-bernardes-do-nascimento-7b62a4274/)](https://www.linkedin.com/in/davi-bernardes-do-nascimento-7b62a4274/) 
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:davi.10bernardes@gmail.com)](mailto:davi.10bernardes@gmail.com)

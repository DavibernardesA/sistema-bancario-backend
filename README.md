# sistema-bancario-backend
## Sistema Bancário API🌐


<table>
  <tr>
    <td>
      <img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/b8f4c9aa-191c-4956-b167-f60a2c10a973" alt="" style="width: 100%; height: auto;">
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

<table>
  <tr>
    <td>
      <img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/41ffcd74-3fa1-49ba-9c4d-0cbd0adeb294" alt="" style="width: 50%; height: auto;">
    </td>
    
  </tr>
</table>

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

- Acessar depositos em uma conta bancária

- Sacar de uma conta bancária

- Transferir valores entre contas bancárias

- Consultar saldo da conta bancária

- Emitir extrato de uma conta bancária

Instruções para criação do banco de dados presentes no arquivo '/src/config/database/dump.sql' :

```
create database projetosistemabancario;

create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null,
  saldo integer not null
);

create table depositos (
  id serial primary key,
  valor integer not null,
  usuario_id integer not null references usuarios(id)
);

create table saques (
  id serial primary key,
  valor integer not null,
  usuario_id integer not null references usuarios(id)
);

create table transferencias (
  id serial primary key,
  usuario_id_origem integer not null references usuarios(id),
  numero_conta_destino integer not null references usuarios(id),
  valor integer not null,
  senha text
);


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
  
  **/usuario** - Recebe dados do usuário a ser cadastrado pelo corpo da requisição com saldo inicial fixo igual a 0.

- Login do usuário:

  Método **POST**

  **/login** - Recebe email e senha cadastrados pelo usuário fazendo validações. Para efetuar o login a API valida a senha informada no corpo da requisição da rota com a HASH criada pelo pacote "secure-password" que está guardada no banco de dados como a "senha" do usuário. Ao validar as informações, o pacote "jsonwebtoken" cria um elemento "token" que será usado para transmitir as informações do usuário para outras rotas.

- Autenticação:

  O arquivo "pessoaLogada.js" é um middleware responsável pela criação do "token" no momento do **Login**. Este token é utilizado para fazer a autenticação do usuário para que possa acessar **todas** as rotas, exceto: "/cadastrar" e "/login".

- Visualizar perfil do usuário:

  Método **GET**

  **/perfil** - Responde a requisição mostrando os dados do usuário recebidos pela requisição e suas publicações.

- Editar cadastro do usuário:

  Método **PUT**

  **/perfil** - Recebe as informações do usuário através do "token" criado quando o usuário efetua o login e permite a alteração do cadastro no banco de dados. **A edição de todos os campos é obrigatória**.

- Excluir cadastro do usuário:

  Método **DELETE**

  **/perfil/delete** - Recebe as informações do usuário através do "token" criado quando o usuário efetua o login. Permite ao usuário excluir seu cadastro do banco de dados com senha e confirmação da senha.

## Rotas e Endpoints - Conta

- Depositar:

  Método **POST**

  **/depositar** - Permite ao usuário realizar um depósito em sua conta. O valor do depósito deve ser maior que zero.

- Acessar Depósitos:

  Método **GET**

  **/acessar-depositos** - Retorna a lista de depósitos feitos pelo usuário, incluindo o número total de depósitos.

- Sacar:

  Método **POST**

  **/sacar** - Permite ao usuário fazer um saque de sua conta, desde que tenha saldo suficiente. O valor do saque deve ser maior que zero.

- Acessar Saques:

  Método **GET**

  **/acessar-saques** - Retorna a lista de saques realizados pelo usuário, incluindo o número total de saques.

- Transferir:

  Método **POST**

  **/transferir** - Permite ao usuário transferir um valor para outro usuário. O valor da transferência deve ser maior que zero e o usuário de destino deve existir. O saldo do remetente será atualizado após a transferência.

- Acessar Saldo:

  Método **GET**

  **/acessar-saldo** - Retorna o saldo atual do usuário.

- Emitir Extrato:

  Método **GET**

  **/emitir-extrato** - Retorna um extrato contendo informações sobre o saldo, transferências emitidas, transferências recebidas, depósitos, saques e o número total de moviment




## Autor✍️ 

<a href=https://github.com/DavibernardesA>
<img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/6ba09c22-9eae-4601-980c-81533bd7b4f9" width="100px;" alt=""/>
<br>
<b>Davi Bernardes</b></a>
<br/>
Entre em contato: 


[![Linkedin Badge](https://img.shields.io/badge/-Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/davi-bernardes-do-nascimento-7b62a4274/)](https://www.linkedin.com/in/davi-bernardes-do-nascimento-7b62a4274/) 
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:davi.10bernardes@gmail.com)](mailto:davi.10bernardes@gmail.com)

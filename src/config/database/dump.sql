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

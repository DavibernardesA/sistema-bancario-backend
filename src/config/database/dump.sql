create database projetosistemabancario;

create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
);

create table transacoes (
  id serial primary key,
  comentario text,
  valor integer not null,
  data date,
  usuario_id integer references usuarios(id)
);

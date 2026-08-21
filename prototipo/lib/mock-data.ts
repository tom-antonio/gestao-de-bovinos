import type { Bovino, ProducaoLeite, Raca, Usuario } from "./types"

export const RACAS: Raca[] = [
  { id: "r1", nome: "Holandesa" },
  { id: "r2", nome: "Girolando" },
  { id: "r3", nome: "Jersey" },
  { id: "r4", nome: "Gir Leiteiro" },
  { id: "r5", nome: "Pardo Suíço" },
  { id: "r6", nome: "Guzerá" },
]

export const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: "u1",
    nome: "João da Silva",
    email: "funcionario@fazenda.com",
    senha: "123456",
  },
]

export const BOVINOS_INICIAIS: Bovino[] = [
  {
    id: "b1",
    nome: "Mimosa",
    sexo: "Fêmea",
    nascimento: "2021-03-12",
    racaId: "r1",
    nomeMae: "Estrela",
    nomePai: "Trovão",
    dataDesmama: "2021-09-15",
    origem: "Produção Própria",
    status: "Ordenha",
  },
  {
    id: "b2",
    nome: "Malhada",
    sexo: "Fêmea",
    nascimento: "2020-07-22",
    racaId: "r2",
    nomeMae: "Boneca",
    nomePai: "Sultão",
    dataDesmama: "2021-01-30",
    origem: "Produção Própria",
    status: "Ordenha",
  },
  {
    id: "b3",
    nome: "Pintada",
    sexo: "Fêmea",
    nascimento: "2019-11-05",
    racaId: "r3",
    nomeMae: "Formosa",
    nomePai: "Relâmpago",
    dataDesmama: "2020-05-10",
    origem: "Adquirido de Terceiros",
    status: "Ordenha",
  },
  {
    id: "b4",
    nome: "Trovão",
    sexo: "Macho",
    nascimento: "2018-02-18",
    racaId: "r1",
    nomeMae: "Diamante",
    nomePai: "Imperador",
    dataDesmama: "2018-08-20",
    origem: "Adquirido de Terceiros",
    status: "Solteiro",
  },
  {
    id: "b5",
    nome: "Chuvisco",
    sexo: "Macho",
    nascimento: "2022-05-30",
    racaId: "r4",
    nomeMae: "Mimosa",
    nomePai: "Trovão",
    dataDesmama: "2022-11-25",
    origem: "Produção Própria",
    status: "Vendido",
  },
  {
    id: "b6",
    nome: "Florzinha",
    sexo: "Fêmea",
    nascimento: "2017-09-14",
    racaId: "r5",
    nomeMae: "Rosa",
    nomePai: "Barão",
    dataDesmama: "2018-03-01",
    origem: "Produção Própria",
    status: "Morreu",
  },
  {
    id: "b7",
    nome: "Preciosa",
    sexo: "Fêmea",
    nascimento: "2021-12-01",
    racaId: "r6",
    nomeMae: "Joia",
    nomePai: "Diamante",
    dataDesmama: "2022-06-08",
    origem: "Produção Própria",
    status: "Ordenha",
  },
]

// Produção do mês corrente para as vacas em ordenha
function isoHojeMenos(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString().slice(0, 10)
}

export const PRODUCOES_INICIAIS: ProducaoLeite[] = [
  {
    id: "p1",
    bovinoId: "b1",
    data: isoHojeMenos(0),
    quantidadeManha: 12,
    quantidadeTarde: 9,
  },
  {
    id: "p2",
    bovinoId: "b2",
    data: isoHojeMenos(0),
    quantidadeManha: 10,
    quantidadeTarde: 8,
  },
  {
    id: "p3",
    bovinoId: "b3",
    data: isoHojeMenos(0),
    quantidadeManha: 14,
    quantidadeTarde: 11,
  },
  {
    id: "p4",
    bovinoId: "b1",
    data: isoHojeMenos(1),
    quantidadeManha: 11,
    quantidadeTarde: 10,
  },
  {
    id: "p5",
    bovinoId: "b2",
    data: isoHojeMenos(1),
    quantidadeManha: 9,
    quantidadeTarde: 8,
  },
  {
    id: "p6",
    bovinoId: "b7",
    data: isoHojeMenos(2),
    quantidadeManha: 8,
    quantidadeTarde: 7,
  },
]

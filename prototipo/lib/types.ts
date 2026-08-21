export type Sexo = "Macho" | "Fêmea"

export type Origem = "Produção Própria" | "Adquirido de Terceiros"

export type StatusBovino = "Ordenha" | "Vendido" | "Solteiro" | "Morreu"

export interface Raca {
  id: string
  nome: string
}

export interface Bovino {
  id: string
  nome: string
  sexo: Sexo
  nascimento: string // ISO date (yyyy-mm-dd)
  racaId: string
  nomeMae: string
  nomePai: string
  dataDesmama: string // ISO date
  origem: Origem
  status: StatusBovino
}

export interface ProducaoLeite {
  id: string
  bovinoId: string
  data: string // ISO date
  quantidadeManha: number // litros (inteiro)
  quantidadeTarde: number // litros (inteiro)
}

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
}

export const STATUS_OPCOES: StatusBovino[] = [
  "Ordenha",
  "Vendido",
  "Solteiro",
  "Morreu",
]

export const SEXO_OPCOES: Sexo[] = ["Macho", "Fêmea"]

export const ORIGEM_OPCOES: Origem[] = [
  "Produção Própria",
  "Adquirido de Terceiros",
]

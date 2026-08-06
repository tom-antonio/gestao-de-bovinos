"use client"

import * as React from "react"

import {
  BOVINOS_INICIAIS,
  PRODUCOES_INICIAIS,
  RACAS,
  USUARIOS_INICIAIS,
} from "./mock-data"
import type {
  Bovino,
  ProducaoLeite,
  Raca,
  Usuario,
} from "./types"

export type View =
  | { screen: "login" }
  | { screen: "register" }
  | { screen: "home" }
  | { screen: "animais-lista" }
  | { screen: "animais-novo" }
  | { screen: "animais-editar"; id: string }
  | { screen: "animais-detalhe"; id: string }
  | { screen: "ordenha-lista" }
  | { screen: "ordenha-nova" }
  | { screen: "ordenha-editar"; id: string }
  | { screen: "ordenha-detalhe"; id: string }

interface StoreContextValue {
  // auth
  usuario: Usuario | null
  entrar: (email: string, senha: string) => { ok: boolean; erro?: string }
  cadastrar: (
    nome: string,
    email: string,
    senha: string,
  ) => { ok: boolean; erro?: string }
  sair: () => void
  // navegação
  view: View
  navegar: (v: View) => void
  // dados
  racas: Raca[]
  bovinos: Bovino[]
  producoes: ProducaoLeite[]
  // bovinos crud
  criarBovino: (b: Omit<Bovino, "id">) => void
  atualizarBovino: (id: string, b: Omit<Bovino, "id">) => void
  excluirBovino: (id: string) => void
  // produção crud
  criarProducao: (p: Omit<ProducaoLeite, "id">) => void
  atualizarProducao: (id: string, p: Omit<ProducaoLeite, "id">) => void
  excluirProducao: (id: string) => void
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

function gerarId(prefixo: string) {
  return `${prefixo}_${Math.random().toString(36).slice(2, 9)}`
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>(USUARIOS_INICIAIS)
  const [usuario, setUsuario] = React.useState<Usuario | null>(null)
  const [view, setView] = React.useState<View>({ screen: "login" })
  const [bovinos, setBovinos] = React.useState<Bovino[]>(BOVINOS_INICIAIS)
  const [producoes, setProducoes] =
    React.useState<ProducaoLeite[]>(PRODUCOES_INICIAIS)

  const navegar = React.useCallback((v: View) => setView(v), [])

  const entrar = React.useCallback(
    (email: string, senha: string) => {
      const encontrado = usuarios.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (!encontrado) {
        return { ok: false, erro: "E-mail não cadastrado." }
      }
      if (encontrado.senha !== senha) {
        return { ok: false, erro: "Senha incorreta. Tente novamente." }
      }
      setUsuario(encontrado)
      setView({ screen: "home" })
      return { ok: true }
    },
    [usuarios],
  )

  const cadastrar = React.useCallback(
    (nome: string, email: string, senha: string) => {
      const jaExiste = usuarios.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (jaExiste) {
        return { ok: false, erro: "Já existe um usuário com este e-mail." }
      }
      const novo: Usuario = {
        id: gerarId("u"),
        nome: nome.trim(),
        email: email.trim(),
        senha,
      }
      setUsuarios((prev) => [...prev, novo])
      setUsuario(novo)
      setView({ screen: "home" })
      return { ok: true }
    },
    [usuarios],
  )

  const sair = React.useCallback(() => {
    setUsuario(null)
    setView({ screen: "login" })
  }, [])

  const criarBovino = React.useCallback((b: Omit<Bovino, "id">) => {
    setBovinos((prev) => [{ ...b, id: gerarId("b") }, ...prev])
  }, [])

  const atualizarBovino = React.useCallback(
    (id: string, b: Omit<Bovino, "id">) => {
      setBovinos((prev) =>
        prev.map((item) => (item.id === id ? { ...b, id } : item)),
      )
    },
    [],
  )

  const excluirBovino = React.useCallback((id: string) => {
    setBovinos((prev) => prev.filter((item) => item.id !== id))
    setProducoes((prev) => prev.filter((p) => p.bovinoId !== id))
  }, [])

  const criarProducao = React.useCallback((p: Omit<ProducaoLeite, "id">) => {
    setProducoes((prev) => [{ ...p, id: gerarId("p") }, ...prev])
  }, [])

  const atualizarProducao = React.useCallback(
    (id: string, p: Omit<ProducaoLeite, "id">) => {
      setProducoes((prev) =>
        prev.map((item) => (item.id === id ? { ...p, id } : item)),
      )
    },
    [],
  )

  const excluirProducao = React.useCallback((id: string) => {
    setProducoes((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value: StoreContextValue = {
    usuario,
    entrar,
    cadastrar,
    sair,
    view,
    navegar,
    racas: RACAS,
    bovinos,
    producoes,
    criarBovino,
    atualizarBovino,
    excluirBovino,
    criarProducao,
    atualizarProducao,
    excluirProducao,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) {
    throw new Error("useStore deve ser usado dentro de StoreProvider")
  }
  return ctx
}

"use client"

import * as React from "react"
import Image from "next/image"
import { MilkIcon, TriangleAlertIcon } from "lucide-react"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export function LoginScreen() {
  const { entrar, navegar } = useStore()
  const [email, setEmail] = React.useState("")
  const [senha, setSenha] = React.useState("")
  const [erro, setErro] = React.useState<string | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha para continuar.")
      return
    }
    const resultado = entrar(email, senha)
    if (!resultado.ok) {
      setErro(resultado.erro ?? "Não foi possível entrar.")
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MilkIcon className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Gestão Leiteira</p>
              <p className="text-xs text-muted-foreground">Controle de rebanho</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre com sua conta para gerenciar o rebanho e a ordenha.
          </p>

          {erro && (
            <Alert variant="destructive" className="mt-6">
              <TriangleAlertIcon />
              <AlertTitle>Erro ao entrar</AlertTitle>
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="mt-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@fazenda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </Field>
              <Button type="submit" size="lg" className="w-full">
                Entrar
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navegar({ screen: "register" })}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Cadastre-se
            </button>
          </p>

          <p className="mt-8 rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            Acesso de teste: funcionario@fazenda.com / 123456
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="/images/fazenda-leiteira.png"
          alt="Vacas leiteiras pastando em campo verde ao entardecer"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
      </div>
    </div>
  )
}

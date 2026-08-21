"use client"

import * as React from "react"
import { ArrowLeftIcon, MoonIcon, SunIcon } from "lucide-react"

import { useStore } from "@/lib/store"
import type { ProducaoLeite } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { MilkIcon } from "lucide-react"

interface Props {
  producaoId?: string
}

type FormState = {
  bovinoId: string
  data: string
  quantidadeManha: string
  quantidadeTarde: string
}

export function OrdenhaForm({ producaoId }: Props) {
  const {
    producoes,
    bovinos,
    criarProducao,
    atualizarProducao,
    navegar,
  } = useStore()

  const existente = producaoId
    ? producoes.find((p) => p.id === producaoId)
    : undefined

  const vacasOrdenha = bovinos.filter((b) => b.status === "Ordenha")

  const [form, setForm] = React.useState<FormState>(
    existente
      ? {
          bovinoId: existente.bovinoId,
          data: existente.data,
          quantidadeManha: String(existente.quantidadeManha),
          quantidadeTarde: String(existente.quantidadeTarde),
        }
      : {
          bovinoId: "",
          data: new Date().toISOString().slice(0, 10),
          quantidadeManha: "",
          quantidadeTarde: "",
        },
  )
  const [erros, setErros] = React.useState<
    Partial<Record<keyof FormState | "total", string>>
  >({})

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined, total: undefined }))
  }

  function validarInteiro(v: string): number | null {
    if (v.trim() === "") return null
    const n = Number(v)
    if (!Number.isInteger(n) || n < 0) return null
    return n
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const novos: Partial<Record<keyof FormState | "total", string>> = {}
    if (!form.bovinoId) novos.bovinoId = "Selecione o animal."
    if (!form.data) novos.data = "Informe a data."

    const manha = validarInteiro(form.quantidadeManha)
    const tarde = validarInteiro(form.quantidadeTarde)
    if (form.quantidadeManha.trim() === "")
      novos.quantidadeManha = "Informe a quantidade da manhã."
    else if (manha === null)
      novos.quantidadeManha = "Use um número inteiro (litros) igual ou maior que 0."
    if (form.quantidadeTarde.trim() === "")
      novos.quantidadeTarde = "Informe a quantidade da tarde."
    else if (tarde === null)
      novos.quantidadeTarde = "Use um número inteiro (litros) igual ou maior que 0."

    if (manha !== null && tarde !== null && manha + tarde === 0)
      novos.total = "A produção total do dia deve ser maior que zero."

    setErros(novos)
    if (Object.keys(novos).length > 0) return

    const dados = {
      bovinoId: form.bovinoId,
      data: form.data,
      quantidadeManha: manha as number,
      quantidadeTarde: tarde as number,
    } satisfies Omit<ProducaoLeite, "id">

    if (existente) {
      atualizarProducao(existente.id, dados)
      navegar({ screen: "ordenha-detalhe", id: existente.id })
    } else {
      criarProducao(dados)
      navegar({ screen: "ordenha-lista" })
    }
  }

  function voltar() {
    if (existente) navegar({ screen: "ordenha-detalhe", id: existente.id })
    else navegar({ screen: "ordenha-lista" })
  }

  const totalPreview =
    (validarInteiro(form.quantidadeManha) ?? 0) +
    (validarInteiro(form.quantidadeTarde) ?? 0)

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={voltar}>
        <ArrowLeftIcon data-icon="inline-start" />
        Voltar
      </Button>

      <h1 className="text-2xl font-semibold tracking-tight">
        {existente ? "Editar produção" : "Nova produção"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Registre a quantidade de leite da manhã e da tarde de uma vaca em
        ordenha.
      </p>

      <Card className="mt-6">
        <CardContent className="p-6">
          {vacasOrdenha.length === 0 && !existente ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MilkIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhuma vaca em ordenha</EmptyTitle>
                <EmptyDescription>
                  Para registrar produção, cadastre um animal com o status
                  &quot;Ordenha&quot;.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field data-invalid={!!erros.bovinoId}>
                  <FieldLabel>Animal (em ordenha)</FieldLabel>
                  <Select
                    value={form.bovinoId || null}
                    onValueChange={(v) => set("bovinoId", v as string)}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!erros.bovinoId}
                    >
                      <SelectValue placeholder="Selecione a vaca" />
                    </SelectTrigger>
                    <SelectContent>
                      {vacasOrdenha.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{erros.bovinoId}</FieldError>
                </Field>

                <Field data-invalid={!!erros.data}>
                  <FieldLabel htmlFor="data">Data</FieldLabel>
                  <Input
                    id="data"
                    type="date"
                    value={form.data}
                    aria-invalid={!!erros.data}
                    onChange={(e) => set("data", e.target.value)}
                  />
                  <FieldError>{erros.data}</FieldError>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={!!erros.quantidadeManha}>
                    <FieldLabel htmlFor="manha">
                      <SunIcon className="size-4" />
                      Quantidade — Manhã (L)
                    </FieldLabel>
                    <Input
                      id="manha"
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      placeholder="0"
                      value={form.quantidadeManha}
                      aria-invalid={!!erros.quantidadeManha}
                      onChange={(e) => set("quantidadeManha", e.target.value)}
                    />
                    <FieldError>{erros.quantidadeManha}</FieldError>
                  </Field>

                  <Field data-invalid={!!erros.quantidadeTarde}>
                    <FieldLabel htmlFor="tarde">
                      <MoonIcon className="size-4" />
                      Quantidade — Tarde (L)
                    </FieldLabel>
                    <Input
                      id="tarde"
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      placeholder="0"
                      value={form.quantidadeTarde}
                      aria-invalid={!!erros.quantidadeTarde}
                      onChange={(e) => set("quantidadeTarde", e.target.value)}
                    />
                    <FieldError>{erros.quantidadeTarde}</FieldError>
                  </Field>
                </div>

                <Field data-invalid={!!erros.total}>
                  <FieldDescription>
                    Total do animal no dia:{" "}
                    <span className="font-semibold text-foreground">
                      {totalPreview} L
                    </span>
                  </FieldDescription>
                  <FieldError>{erros.total}</FieldError>
                </Field>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={voltar}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {existente ? "Salvar alterações" : "Registrar produção"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

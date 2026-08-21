"use client"

import * as React from "react"
import { ArrowLeftIcon } from "lucide-react"

import { useStore } from "@/lib/store"
import {
  ORIGEM_OPCOES,
  SEXO_OPCOES,
  STATUS_OPCOES,
  type Bovino,
  type Origem,
  type Sexo,
  type StatusBovino,
} from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
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

interface Props {
  bovinoId?: string
}

type FormState = {
  nome: string
  sexo: Sexo | ""
  nascimento: string
  racaId: string
  nomeMae: string
  nomePai: string
  dataDesmama: string
  origem: Origem | ""
  status: StatusBovino | ""
}

const VAZIO: FormState = {
  nome: "",
  sexo: "",
  nascimento: "",
  racaId: "",
  nomeMae: "",
  nomePai: "",
  dataDesmama: "",
  origem: "",
  status: "",
}

export function AnimalForm({ bovinoId }: Props) {
  const { bovinos, racas, criarBovino, atualizarBovino, navegar } = useStore()
  const existente = bovinoId
    ? bovinos.find((b) => b.id === bovinoId)
    : undefined

  const [form, setForm] = React.useState<FormState>(
    existente
      ? {
          nome: existente.nome,
          sexo: existente.sexo,
          nascimento: existente.nascimento,
          racaId: existente.racaId,
          nomeMae: existente.nomeMae,
          nomePai: existente.nomePai,
          dataDesmama: existente.dataDesmama,
          origem: existente.origem,
          status: existente.status,
        }
      : VAZIO,
  )
  const [erros, setErros] = React.useState<Partial<Record<keyof FormState, string>>>({})

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function validar(): boolean {
    const novos: Partial<Record<keyof FormState, string>> = {}
    if (!form.nome.trim()) novos.nome = "Informe o nome do animal."
    if (!form.sexo) novos.sexo = "Selecione o sexo."
    if (!form.nascimento) novos.nascimento = "Informe a data de nascimento."
    if (!form.racaId) novos.racaId = "Selecione a raça."
    if (!form.nomeMae.trim()) novos.nomeMae = "Informe o nome da mãe."
    if (!form.nomePai.trim()) novos.nomePai = "Informe o nome do pai."
    if (!form.dataDesmama) novos.dataDesmama = "Informe a data da desmama."
    else if (form.nascimento && form.dataDesmama < form.nascimento)
      novos.dataDesmama = "A desmama não pode ser antes do nascimento."
    if (!form.origem) novos.origem = "Selecione a origem."
    if (!form.status) novos.status = "Selecione o status."
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    const dados = {
      nome: form.nome.trim(),
      sexo: form.sexo as Sexo,
      nascimento: form.nascimento,
      racaId: form.racaId,
      nomeMae: form.nomeMae.trim(),
      nomePai: form.nomePai.trim(),
      dataDesmama: form.dataDesmama,
      origem: form.origem as Origem,
      status: form.status as StatusBovino,
    } satisfies Omit<Bovino, "id">

    if (existente) {
      atualizarBovino(existente.id, dados)
      navegar({ screen: "animais-detalhe", id: existente.id })
    } else {
      criarBovino(dados)
      navegar({ screen: "animais-lista" })
    }
  }

  function voltar() {
    if (existente) navegar({ screen: "animais-detalhe", id: existente.id })
    else navegar({ screen: "animais-lista" })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={voltar}>
        <ArrowLeftIcon data-icon="inline-start" />
        Voltar
      </Button>

      <h1 className="text-2xl font-semibold tracking-tight">
        {existente ? "Editar animal" : "Novo animal"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Preencha os dados do bovino. Todos os campos são obrigatórios.
      </p>

      <Card className="mt-6">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={!!erros.nome}>
                <FieldLabel htmlFor="nome">Nome do animal</FieldLabel>
                <Input
                  id="nome"
                  placeholder="Ex.: Mimosa"
                  value={form.nome}
                  aria-invalid={!!erros.nome}
                  onChange={(e) => set("nome", e.target.value)}
                />
                <FieldError>{erros.nome}</FieldError>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field data-invalid={!!erros.sexo}>
                  <FieldLabel>Sexo</FieldLabel>
                  <Select
                    value={form.sexo || null}
                    onValueChange={(v) => set("sexo", v as Sexo)}
                  >
                    <SelectTrigger className="w-full" aria-invalid={!!erros.sexo}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEXO_OPCOES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{erros.sexo}</FieldError>
                </Field>

                <Field data-invalid={!!erros.racaId}>
                  <FieldLabel>Raça</FieldLabel>
                  <Select
                    value={form.racaId || null}
                    onValueChange={(v) => set("racaId", v as string)}
                  >
                    <SelectTrigger className="w-full" aria-invalid={!!erros.racaId}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {racas.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{erros.racaId}</FieldError>
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field data-invalid={!!erros.nascimento}>
                  <FieldLabel htmlFor="nascimento">Nascimento</FieldLabel>
                  <Input
                    id="nascimento"
                    type="date"
                    value={form.nascimento}
                    aria-invalid={!!erros.nascimento}
                    onChange={(e) => set("nascimento", e.target.value)}
                  />
                  <FieldError>{erros.nascimento}</FieldError>
                </Field>

                <Field data-invalid={!!erros.dataDesmama}>
                  <FieldLabel htmlFor="desmama">Data da desmama</FieldLabel>
                  <Input
                    id="desmama"
                    type="date"
                    value={form.dataDesmama}
                    aria-invalid={!!erros.dataDesmama}
                    onChange={(e) => set("dataDesmama", e.target.value)}
                  />
                  <FieldError>{erros.dataDesmama}</FieldError>
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field data-invalid={!!erros.nomeMae}>
                  <FieldLabel htmlFor="mae">Nome da mãe</FieldLabel>
                  <Input
                    id="mae"
                    placeholder="Ex.: Estrela"
                    value={form.nomeMae}
                    aria-invalid={!!erros.nomeMae}
                    onChange={(e) => set("nomeMae", e.target.value)}
                  />
                  <FieldError>{erros.nomeMae}</FieldError>
                </Field>

                <Field data-invalid={!!erros.nomePai}>
                  <FieldLabel htmlFor="pai">Nome do pai</FieldLabel>
                  <Input
                    id="pai"
                    placeholder="Ex.: Trovão"
                    value={form.nomePai}
                    aria-invalid={!!erros.nomePai}
                    onChange={(e) => set("nomePai", e.target.value)}
                  />
                  <FieldError>{erros.nomePai}</FieldError>
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field data-invalid={!!erros.origem}>
                  <FieldLabel>Origem</FieldLabel>
                  <Select
                    value={form.origem || null}
                    onValueChange={(v) => set("origem", v as Origem)}
                  >
                    <SelectTrigger className="w-full" aria-invalid={!!erros.origem}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORIGEM_OPCOES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{erros.origem}</FieldError>
                </Field>

                <Field data-invalid={!!erros.status}>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={form.status || null}
                    onValueChange={(v) => set("status", v as StatusBovino)}
                  >
                    <SelectTrigger className="w-full" aria-invalid={!!erros.status}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPCOES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{erros.status}</FieldError>
                </Field>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={voltar}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {existente ? "Salvar alterações" : "Cadastrar animal"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

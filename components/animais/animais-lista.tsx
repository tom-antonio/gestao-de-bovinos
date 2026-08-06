"use client"

import * as React from "react"
import { PlusIcon, SearchIcon, BeefIcon, FilterXIcon } from "lucide-react"

import { useStore } from "@/lib/store"
import { STATUS_OPCOES } from "@/lib/types"
import { calcularIdade, formatarData } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"

const TODOS = "todos"

export function AnimaisLista() {
  const { bovinos, racas, navegar } = useStore()
  const [busca, setBusca] = React.useState("")
  const [status, setStatus] = React.useState<string>(TODOS)
  const [racaId, setRacaId] = React.useState<string>(TODOS)
  const [ano, setAno] = React.useState<string>(TODOS)

  const anosDisponiveis = React.useMemo(() => {
    const set = new Set(bovinos.map((b) => b.nascimento.slice(0, 4)))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [bovinos])

  const filtrados = React.useMemo(() => {
    return bovinos.filter((b) => {
      const bateBusca = b.nome.toLowerCase().includes(busca.trim().toLowerCase())
      const bateStatus = status === TODOS || b.status === status
      const bateRaca = racaId === TODOS || b.racaId === racaId
      const bateAno = ano === TODOS || b.nascimento.slice(0, 4) === ano
      return bateBusca && bateStatus && bateRaca && bateAno
    })
  }, [bovinos, busca, status, racaId, ano])

  const temFiltro =
    busca !== "" || status !== TODOS || racaId !== TODOS || ano !== TODOS

  function limparFiltros() {
    setBusca("")
    setStatus(TODOS)
    setRacaId(TODOS)
    setAno(TODOS)
  }

  const nomeRaca = (id: string) => racas.find((r) => r.id === id)?.nome ?? "—"

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Animais</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bovinos.length} bovinos cadastrados na propriedade
          </p>
        </div>
        <Button onClick={() => navegar({ screen: "animais-novo" })}>
          <PlusIcon data-icon="inline-start" />
          Novo animal
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <InputGroup className="lg:max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </InputGroup>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-1">
          <Select value={status} onValueChange={(v) => setStatus(v as string)}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os status</SelectItem>
              {STATUS_OPCOES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={racaId} onValueChange={(v) => setRacaId(v as string)}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Raça" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas as raças</SelectItem>
              {racas.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ano} onValueChange={(v) => setAno(v as string)}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Nascimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os anos</SelectItem>
              {anosDisponiveis.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {temFiltro && (
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <FilterXIcon data-icon="inline-start" />
            Limpar
          </Button>
        )}
      </div>

      <div className="mt-6">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="p-2">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BeefIcon />
                  </EmptyMedia>
                  <EmptyTitle>
                    {temFiltro
                      ? "Nenhum animal encontrado"
                      : "Nenhum animal cadastrado"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {temFiltro
                      ? "Ajuste a busca ou os filtros para ver outros bovinos."
                      : "Comece cadastrando o primeiro bovino da propriedade."}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {temFiltro ? (
                    <Button variant="outline" onClick={limparFiltros}>
                      <FilterXIcon data-icon="inline-start" />
                      Limpar filtros
                    </Button>
                  ) : (
                    <Button onClick={() => navegar({ screen: "animais-novo" })}>
                      <PlusIcon data-icon="inline-start" />
                      Novo animal
                    </Button>
                  )}
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {filtrados.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => navegar({ screen: "animais-detalhe", id: b.id })}
                className="text-left"
              >
                <Card className="transition-colors hover:border-primary/40 hover:bg-accent/30">
                  <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
                    <div className="min-w-40 flex-1">
                      <p className="font-medium">{b.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {nomeRaca(b.racaId)} · {b.sexo}
                      </p>
                    </div>
                    <div className="hidden text-sm sm:block">
                      <p className="text-muted-foreground">Nascimento</p>
                      <p>{formatarData(b.nascimento)}</p>
                    </div>
                    <div className="hidden text-sm md:block">
                      <p className="text-muted-foreground">Idade</p>
                      <p>{calcularIdade(b.nascimento)}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

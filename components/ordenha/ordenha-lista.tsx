"use client"

import * as React from "react"
import { PlusIcon, MilkIcon, SunIcon, MoonIcon } from "lucide-react"

import { useStore } from "@/lib/store"
import { chaveMes, formatarData, rotuloMes } from "@/lib/format"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function OrdenhaLista() {
  const { producoes, bovinos, navegar } = useStore()

  const mesesDisponiveis = React.useMemo(() => {
    const set = new Set(producoes.map((p) => chaveMes(p.data)))
    set.add(new Date().toISOString().slice(0, 7))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [producoes])

  const [mes, setMes] = React.useState(
    () => mesesDisponiveis[0] ?? new Date().toISOString().slice(0, 7),
  )

  const nomeBovino = (id: string) =>
    bovinos.find((b) => b.id === id)?.nome ?? "Animal removido"

  const doMes = React.useMemo(
    () =>
      producoes
        .filter((p) => chaveMes(p.data) === mes)
        .sort((a, b) => b.data.localeCompare(a.data)),
    [producoes, mes],
  )

  const totalMes = doMes.reduce(
    (soma, p) => soma + p.quantidadeManha + p.quantidadeTarde,
    0,
  )

  // Agrupar por dia para exibir o total de todas as vacas no final do dia
  const porDia = React.useMemo(() => {
    const mapa = new Map<string, typeof doMes>()
    for (const p of doMes) {
      const lista = mapa.get(p.data) ?? []
      lista.push(p)
      mapa.set(p.data, lista)
    }
    return Array.from(mapa.entries())
  }, [doMes])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ordenha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Produção diária de leite por animal
          </p>
        </div>
        <Button onClick={() => navegar({ screen: "ordenha-nova" })}>
          <PlusIcon data-icon="inline-start" />
          Nova produção
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15">
              <MilkIcon className="size-6" />
            </span>
            <div>
              <p className="text-sm text-primary-foreground/80">
                Total do mês · {rotuloMes(mes)}
              </p>
              <p className="text-3xl font-semibold">{totalMes} L</p>
            </div>
          </CardContent>
        </Card>

        <Select value={mes} onValueChange={(v) => setMes(v as string)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mesesDisponiveis.map((m) => (
              <SelectItem key={m} value={m}>
                {rotuloMes(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {doMes.length === 0 ? (
          <Card>
            <CardContent className="p-2">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MilkIcon />
                  </EmptyMedia>
                  <EmptyTitle>Nenhuma produção neste mês</EmptyTitle>
                  <EmptyDescription>
                    Registre a produção diária das vacas em ordenha para
                    acompanhar o total do mês.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => navegar({ screen: "ordenha-nova" })}>
                    <PlusIcon data-icon="inline-start" />
                    Nova produção
                  </Button>
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {porDia.map(([data, registros]) => {
              const totalDia = registros.reduce(
                (s, p) => s + p.quantidadeManha + p.quantidadeTarde,
                0,
              )
              return (
                <div key={data}>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                      {formatarData(data)}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      Total do dia:{" "}
                      <span className="font-semibold text-foreground">
                        {totalDia} L
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {registros.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          navegar({ screen: "ordenha-detalhe", id: p.id })
                        }
                        className="text-left"
                      >
                        <Card className="transition-colors hover:border-primary/40 hover:bg-accent/30">
                          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
                            <p className="min-w-32 flex-1 font-medium">
                              {nomeBovino(p.bovinoId)}
                            </p>
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <SunIcon className="size-4" />
                              Manhã: {p.quantidadeManha} L
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MoonIcon className="size-4" />
                              Tarde: {p.quantidadeTarde} L
                            </span>
                            <span className="text-sm font-semibold">
                              {p.quantidadeManha + p.quantidadeTarde} L
                            </span>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

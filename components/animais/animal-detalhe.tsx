"use client"

import * as React from "react"
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { useStore } from "@/lib/store"
import { calcularIdade, formatarData } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function Item({ rotulo, valor }: { rotulo: string; valor: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="text-sm font-medium">{valor}</dd>
    </div>
  )
}

export function AnimalDetalhe({ bovinoId }: { bovinoId: string }) {
  const { bovinos, racas, producoes, excluirBovino, navegar } = useStore()
  const bovino = bovinos.find((b) => b.id === bovinoId)

  if (!bovino) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted-foreground">Animal não encontrado.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navegar({ screen: "animais-lista" })}
        >
          Voltar para a lista
        </Button>
      </div>
    )
  }

  const nomeRaca = racas.find((r) => r.id === bovino.racaId)?.nome ?? "—"
  const registrosLeite = producoes.filter((p) => p.bovinoId === bovino.id)

  function confirmarExclusao() {
    excluirBovino(bovino!.id)
    navegar({ screen: "animais-lista" })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navegar({ screen: "animais-lista" })}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Voltar
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {bovino.nome}
            </h1>
            <StatusBadge status={bovino.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {nomeRaca} · {bovino.sexo}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navegar({ screen: "animais-editar", id: bovino.id })}
          >
            <PencilIcon data-icon="inline-start" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive">
                  <Trash2Icon data-icon="inline-start" />
                  Excluir
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir animal?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir {bovino.nome}? Essa ação não
                  pode ser desfeita e também removerá os registros de ordenha
                  vinculados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={confirmarExclusao}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dados do animal</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
            <Item rotulo="Sexo" valor={bovino.sexo} />
            <Item rotulo="Raça" valor={nomeRaca} />
            <Item rotulo="Status" valor={<StatusBadge status={bovino.status} />} />
            <Item
              rotulo="Nascimento"
              valor={formatarData(bovino.nascimento)}
            />
            <Item rotulo="Idade" valor={calcularIdade(bovino.nascimento)} />
            <Item
              rotulo="Desmama"
              valor={formatarData(bovino.dataDesmama)}
            />
            <Item rotulo="Nome da mãe" valor={bovino.nomeMae} />
            <Item rotulo="Nome do pai" valor={bovino.nomePai} />
            <Item rotulo="Origem" valor={bovino.origem} />
          </dl>
        </CardContent>
      </Card>

      {bovino.status === "Ordenha" && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Ordenha</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Este animal está em ordenha e aparece na tela de Ordenha para
              registro de produção.
            </p>
            <Separator />
            <p className="text-sm">
              {registrosLeite.length} registro(s) de produção lançado(s).
            </p>
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => navegar({ screen: "ordenha-lista" })}
            >
              Ir para a Ordenha
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

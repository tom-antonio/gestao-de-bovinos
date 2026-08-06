"use client"

import {
  ArrowLeftIcon,
  MoonIcon,
  PencilIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { formatarData } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

export function OrdenhaDetalhe({ producaoId }: { producaoId: string }) {
  const { producoes, bovinos, excluirProducao, navegar } = useStore()
  const producao = producoes.find((p) => p.id === producaoId)

  if (!producao) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Registro de produção não encontrado.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navegar({ screen: "ordenha-lista" })}
        >
          Voltar para a lista
        </Button>
      </div>
    )
  }

  const bovino = bovinos.find((b) => b.id === producao.bovinoId)
  const total = producao.quantidadeManha + producao.quantidadeTarde

  function confirmarExclusao() {
    excluirProducao(producao!.id)
    navegar({ screen: "ordenha-lista" })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navegar({ screen: "ordenha-lista" })}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Voltar
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {bovino?.nome ?? "Animal removido"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Produção de {formatarData(producao.data)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navegar({ screen: "ordenha-editar", id: producao.id })
            }
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
                <AlertDialogTitle>Excluir produção?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este registro de ordenha? Essa
                  ação não pode ser desfeita.
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
          <CardTitle>Detalhes da produção</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <SunIcon className="size-4" />
                Manhã
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {producao.quantidadeManha} L
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MoonIcon className="size-4" />
                Tarde
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {producao.quantidadeTarde} L
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total do animal no dia</span>
            <span className="text-xl font-semibold text-primary">{total} L</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { ChevronRightIcon, MilkIcon, BeefIcon } from "lucide-react"

import { useStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"

export function HomeScreen() {
  const { usuario, navegar, bovinos } = useStore()

  const emOrdenha = bovinos.filter((b) => b.status === "Ordenha").length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">
          Olá, {usuario?.nome?.split(" ")[0]}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          O que você quer gerenciar hoje?
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navegar({ screen: "animais-lista" })}
          className="text-left"
        >
          <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/40">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BeefIcon className="size-6" />
                </span>
                <ChevronRightIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Animais</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cadastre, edite e acompanhe todos os bovinos da propriedade.
                </p>
              </div>
              <p className="mt-auto text-sm font-medium text-primary">
                {bovinos.length} animais cadastrados
              </p>
            </CardContent>
          </Card>
        </button>

        <button
          type="button"
          onClick={() => navegar({ screen: "ordenha-lista" })}
          className="text-left"
        >
          <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/40">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MilkIcon className="size-6" />
                </span>
                <ChevronRightIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Ordenha</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Registre a produção diária de leite das vacas em ordenha.
                </p>
              </div>
              <p className="mt-auto text-sm font-medium text-primary">
                {emOrdenha} vacas em ordenha
              </p>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  )
}

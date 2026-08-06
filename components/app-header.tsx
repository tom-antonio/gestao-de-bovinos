"use client"

import { LogOutIcon, MilkIcon } from "lucide-react"

import { useStore, type View } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ABAS: { rotulo: string; view: View; grupo: string }[] = [
  { rotulo: "Animais", view: { screen: "animais-lista" }, grupo: "animais" },
  { rotulo: "Ordenha", view: { screen: "ordenha-lista" }, grupo: "ordenha" },
]

export function AppHeader() {
  const { usuario, sair, view, navegar } = useStore()

  const grupoAtivo = view.screen.startsWith("animais")
    ? "animais"
    : view.screen.startsWith("ordenha")
      ? "ordenha"
      : "home"

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navegar({ screen: "home" })}
          className="flex items-center gap-2"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MilkIcon className="size-4.5" />
          </span>
          <span className="hidden text-sm font-semibold sm:inline">
            Gestão Leiteira
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {ABAS.map((aba) => (
            <button
              key={aba.grupo}
              type="button"
              onClick={() => navegar(aba.view)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                grupoAtivo === aba.grupo
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {aba.rotulo}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {usuario?.nome}
          </span>
          <Button variant="outline" size="sm" onClick={sair}>
            <LogOutIcon data-icon="inline-start" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}

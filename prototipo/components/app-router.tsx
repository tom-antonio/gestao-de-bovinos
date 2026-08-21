"use client"

import { useStore } from "@/lib/store"
import { AppHeader } from "@/components/app-header"
import { LoginScreen } from "@/components/screens/login-screen"
import { RegisterScreen } from "@/components/screens/register-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { AnimaisLista } from "@/components/animais/animais-lista"
import { AnimalForm } from "@/components/animais/animal-form"
import { AnimalDetalhe } from "@/components/animais/animal-detalhe"
import { OrdenhaLista } from "@/components/ordenha/ordenha-lista"
import { OrdenhaForm } from "@/components/ordenha/ordenha-form"
import { OrdenhaDetalhe } from "@/components/ordenha/ordenha-detalhe"

export function AppRouter() {
  const { usuario, view } = useStore()

  // Rotas públicas (não autenticadas)
  if (!usuario) {
    if (view.screen === "register") return <RegisterScreen />
    return <LoginScreen />
  }

  let conteudo: React.ReactNode
  switch (view.screen) {
    case "animais-lista":
      conteudo = <AnimaisLista />
      break
    case "animais-novo":
      conteudo = <AnimalForm />
      break
    case "animais-editar":
      conteudo = <AnimalForm bovinoId={view.id} />
      break
    case "animais-detalhe":
      conteudo = <AnimalDetalhe bovinoId={view.id} />
      break
    case "ordenha-lista":
      conteudo = <OrdenhaLista />
      break
    case "ordenha-nova":
      conteudo = <OrdenhaForm />
      break
    case "ordenha-editar":
      conteudo = <OrdenhaForm producaoId={view.id} />
      break
    case "ordenha-detalhe":
      conteudo = <OrdenhaDetalhe producaoId={view.id} />
      break
    case "home":
    default:
      conteudo = <HomeScreen />
      break
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader />
      <main>{conteudo}</main>
    </div>
  )
}

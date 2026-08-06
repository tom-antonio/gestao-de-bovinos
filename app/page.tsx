import { StoreProvider } from "@/lib/store"
import { AppRouter } from "@/components/app-router"

export default function Page() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}

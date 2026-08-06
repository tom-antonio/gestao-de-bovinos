import { Badge } from "@/components/ui/badge"
import type { StatusBovino } from "@/lib/types"

const VARIANTE: Record<
  StatusBovino,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Ordenha: "default",
  Vendido: "secondary",
  Solteiro: "outline",
  Morreu: "destructive",
}

export function StatusBadge({ status }: { status: StatusBovino }) {
  return <Badge variant={VARIANTE[status]}>{status}</Badge>
}

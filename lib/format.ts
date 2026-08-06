export function formatarData(iso: string): string {
  if (!iso) return "—"
  const [ano, mes, dia] = iso.split("-")
  if (!ano || !mes || !dia) return iso
  return `${dia}/${mes}/${ano}`
}

export function calcularIdade(iso: string): string {
  if (!iso) return "—"
  const nascimento = new Date(iso + "T00:00:00")
  const hoje = new Date()
  let meses =
    (hoje.getFullYear() - nascimento.getFullYear()) * 12 +
    (hoje.getMonth() - nascimento.getMonth())
  if (hoje.getDate() < nascimento.getDate()) meses -= 1
  if (meses < 0) meses = 0
  const anos = Math.floor(meses / 12)
  const restoMeses = meses % 12
  if (anos === 0) return `${restoMeses} ${restoMeses === 1 ? "mês" : "meses"}`
  if (restoMeses === 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`
  return `${anos}a ${restoMeses}m`
}

export function formatarLitros(valor: number): string {
  return `${valor} L`
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export function nomeMes(indice: number): string {
  return NOMES_MESES[indice] ?? ""
}

export function chaveMes(iso: string): string {
  // yyyy-mm
  return iso.slice(0, 7)
}

export function rotuloMes(chave: string): string {
  const [ano, mes] = chave.split("-")
  return `${nomeMes(Number(mes) - 1)} de ${ano}`
}

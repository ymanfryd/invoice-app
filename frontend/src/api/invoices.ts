export interface Invoice {
  id: number
  client_id: number
  number: string
  currency: string
  status: 'draft' | 'issued' | 'paid'
  issued_at: string | null
  created_at: string
}

export async function fetchInvoices(limit: number, offset: number): Promise<Invoice[]> {
  const response = await fetch(`/api/invoices?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`Failed to load invoices: ${response.status}`)
  }
  return (await response.json()) as Invoice[]
}

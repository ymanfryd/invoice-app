export interface Client {
  id: number
  name: string
  inn: string
  email: string | null
}

export async function fetchClients(): Promise<Client[]> {
  const response = await fetch('/api/clients')
  if (!response.ok) {
    throw new Error(`Failed to load clients: ${response.status}`)
  }
  return (await response.json()) as Client[]
}

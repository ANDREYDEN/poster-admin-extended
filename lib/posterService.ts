import axios from 'axios'
import useSWR from 'swr'
import { definitions } from '../types/database'

export const posterInstance = axios.create({
  baseURL: 'https://joinposter.com/api/',
  params: {
    token: process.env.NEXT_POSTER_ACCESS_TOKEN ?? ''
  }
})

async function apiGet(url: string) {
  const response = await axios.get(`/api/poster/${url}`)
  if (response.status === 400) {
    throw response.data.message
  }
  return response.data
}

export function usePosterGetEmployees() {
  const { data, error } = useSWR('employees', apiGet)

  const employeesError = error?.toString()

  function toSupabaseSchema(data: any) {
    if (!data) return null

    const supabaseEmployees: Partial<definitions['employees']>[] = data.map((e: any, i: number) => ({
      id: i,
      first_name: e.name,
      last_name: e.name
    }))
    return supabaseEmployees
  }

  const employees = toSupabaseSchema(data)

  return { employees, employeesLoading: !employeesError && !employees, employeesError }
}
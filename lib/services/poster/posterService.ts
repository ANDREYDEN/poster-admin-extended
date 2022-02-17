import { 
    Waste, 
    EmployeesMonthlyStatDto, 
    Ingredient, 
    IngredientCategory, 
    IngredientMovementVM, 
    SalesData, 
    SalesPerDay, 
    StockTableRow, 
    Supply, 
    SupplyIngredient, 
    WriteOff, 
    WriteOffIngredient 
} from '@interfaces'
import { definitions } from '@types'
import axios from 'axios'
import dayjs from 'dayjs'
import useSWR from 'swr'

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

    if (!data) {
        return { employees: null, employeesLoading: !employeesError, employeesError }
    }

    const employees: Partial<definitions['employees']>[] = data.map((e: any, i: number) => ({
        id: i,
        first_name: e.name,
        last_name: e.name
    }))

    return { employees, employeesLoading: !employeesError && !employees, employeesError }
}
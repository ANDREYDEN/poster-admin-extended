import { supabase } from '@client'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'

export function enforceAuthenticated(inner?: GetServerSideProps): GetServerSideProps {
    return async context => {
        const { req } = context
        const { user } = await supabase.auth.api.getUserByCookie(req)

        console.log({ user })
        

        if (!user) {
            return { props: {}, redirect: { destination: '/' } }
        }

        if (inner) return inner(context)

        return { props: {} }
    }
}

export function snakeCaseToPascalCase(input: string): string {
    return input
        .split('_')
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(' ')
}

/**
 * Returns a list of days in a month
 * @param month a dayjs date representing the current month
 * @returns a list of dayjs dates - days in the provided month
 */
export function getMonthDays(month: dayjs.Dayjs): dayjs.Dayjs[] {
    const dateRange = []
    for (let date = 1; date <= month.daysInMonth(); date++) {
        dateRange.push(month.date(date))
    }
    return dateRange
}
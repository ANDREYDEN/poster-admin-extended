import { supabase } from '@client'
import { definitions } from '@types'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'

export function enforceAuthenticated(inner?: GetServerSideProps): GetServerSideProps {
    return async context => {
        const { req } = context
        const { user } = await supabase.auth.api.getUserByCookie(req)

        if (!user) {
            return { props: {}, redirect: { destination: '/' } }
        }

        if (inner) return inner(context)

        return { props: {} }
    }
}

export function roundValue(value: number) {
    return Math.round(value * 100) / 100
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

export function fullName(employee: definitions['employees']): string {
    if (!employee.last_name) return employee.first_name

    return `${employee.first_name} ${employee.last_name}`
}

export function capitalizeWord(word: string): string {
    return `${word[0]?.toUpperCase()}${word.slice(1)}`
}

export function formatWeekday(dayOfWeek: dayjs.Dayjs, locale?: string): string {
    const bareLocale = locale?.split('-')[0] ?? 'en'
    const dayOfWeekInNeededLanguage = dayOfWeek.locale(bareLocale).format(bareLocale === 'en' ? 'ddd' : 'dd')
    return capitalizeWord(dayOfWeekInNeededLanguage)
}
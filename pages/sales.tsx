import { Dropdown, ErrorMessage, Loader, Multiselect, SalesTable, TimeframeDropdown } from '@components'
import Button from '@components/Button'
import { SalesPerDay } from '@interfaces'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated } from '@lib/utils'
import { posterGetSales } from '@services/poster'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useMemo, useState } from 'react'
import { Calendar, Document } from 'react-iconly'
import useSWR from 'swr'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales', 'common', 'timeframe']),
    },
}))

const Sales: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(7, 'day')
    const defaultDateTo = dayjs()
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('')
    const { t } = useTranslation('sales')
    const { t: timeframeTranslation } = useTranslation('timeframe')

    const timeframeOptions: Record<string, dayjs.Dayjs> = {
        [timeframeTranslation('last_day')]: dayjs().subtract(1, 'day'),
        [timeframeTranslation('last_7_days')]: dayjs().subtract(7, 'day'),
        [timeframeTranslation('last_14_days')]: dayjs().subtract(14, 'day'),
        [timeframeTranslation('last_30_days')]: dayjs().subtract(30, 'day'),
        [timeframeTranslation('last_quarter')]: dayjs().subtract(3, 'month')
    }
    const dayOfWeekOptions: Record<string, dayjs.Dayjs> = {
        [t('day_of_week_filter.monday')]: dayjs().day(1),
        [t('day_of_week_filter.tuesday')]: dayjs().day(2),
        [t('day_of_week_filter.wednesday')]: dayjs().day(3),
        [t('day_of_week_filter.thursday')]: dayjs().day(4),
        [t('day_of_week_filter.friday')]: dayjs().day(5),
        [t('day_of_week_filter.saturday')]: dayjs().day(6),
        [t('day_of_week_filter.sunday')]: dayjs().day(7)
    }
    const { data: sales, error } = useSWR(['getSales', dateFrom, dateTo], () => posterGetSales(dateFrom, dateTo))
    const loading = !sales

    const columnSelectorOptions: (keyof SalesPerDay)[] = useMemo(() => [
        'date',
        'dayOfWeek',
        'customers',
        'averageBill',
        'kitchenRevenue',
        'kitchenProfit',
        'barRevenue',
        'barProfit',
        'totalRevenue',
        'totalProfit',
    ], [])

    const defaultColumns: (keyof SalesPerDay)[] = useMemo(() => ['date'], [])
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columnSelectorOptions)

    const tableData: SalesPerDay[] = useMemo(() =>
        (sales ?? []).map((salePerDay) => {
            const row = {
                date: salePerDay.date,
                dayOfWeek: salePerDay.dayOfWeek,
                customers: salePerDay.customers,
                averageBill: salePerDay.averageBill,
                kitchenRevenue: salePerDay.kitchenRevenue,
                kitchenProfit: salePerDay.kitchenProfit,
                barRevenue: salePerDay.barRevenue,
                barProfit: salePerDay.barProfit,
                totalRevenue: salePerDay.totalRevenue,
                totalProfit: salePerDay.totalProfit,
            }

            return row
        }),
    [sales]
    )

    const toLabel = useCallback((accessor: string) => t(`table_headers.${accessor}`).toString(), [t])
    const fromLabel = useCallback(
        (label: string) => columnSelectorOptions.find(c => label === toLabel(c)) ?? label,
        [columnSelectorOptions, toLabel]
    )

    const handleSelectionChanged = (columns: string[]) => {
        setSelectedColumns(columns.map(fromLabel))
    }

    const dayOfWeekFilter = () => {
        setSelectedDayOfWeek('')
    }

    const handleExport = () => {
        // TODO: implement export
    }

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-between mb-6'>
                <h3>{t('header')}</h3>
                <Button
                    label={t('export', { ns: 'common' })}
                    variant='secondary'
                    buttonClass='w-56'
                    onClick={handleExport}
                />
            </div>
            <div className='w-full flex justify-between mb-8'>
                <div className='flex space-x-4'>
                    <TimeframeDropdown
                        setDateFrom={setDateFrom}
                        setDateTo={setDateTo}
                        defaultDateFrom={defaultDateFrom}
                        defaultDateTo={defaultDateTo}
                        timeframeOptions={timeframeOptions}
                    />
                    <Dropdown
                        label={t('day_of_week_filter.label')}
                        items={Object.keys(dayOfWeekOptions)}
                        onItemSelected={(item) => setSelectedDayOfWeek(item)}
                        icon={<Calendar primaryColor={selectedDayOfWeek ? 'white' : 'grey'} />}
                        filter={dayOfWeekFilter}
                        selectedOption={selectedDayOfWeek}
                    />
                </div>
                <Multiselect
                    label={t('display', { ns: 'common' })}
                    icon={<Document primaryColor='grey' />}
                    buttonClass='w-32'
                    items={columnSelectorOptions}
                    selectedItems={selectedColumns}
                    disabledItems={defaultColumns}
                    onSelectionChanged={handleSelectionChanged}
                    itemFormatter={toLabel}
                />
            </div>

            {error
                ? <ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />
                : loading ? <Loader /> : <SalesTable data={tableData} selectedColumns={selectedColumns} />
            }
        </div>
    )
}

export default Sales
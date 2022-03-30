import React, { ReactElement } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronDown, ChevronUp, IconProps, Plus } from 'react-iconly'
import { useTranslation } from 'next-i18next'
import { DropdownItemValue, IDropdownItem } from '@interfaces'

export interface IDropdown {
    label: string
    items: IDropdownItem[]
    onItemSelected: (item: IDropdownItem) => void
    icon?: ReactElement<IconProps>
    filter?: () => void
    selectedOption?: DropdownItemValue
    customFilter?: any
}

const Dropdown: React.FC<IDropdown> = ({ label, items, onItemSelected, icon, filter, selectedOption, customFilter }: IDropdown) => {
    const chevronColor = selectedOption ? 'white' : 'grey'
    const { t } = useTranslation('common')

    const buttonLabel = (selectedOption ? selectedOption : label).toString()
    const formattedButtonLabel = buttonLabel.length > 13 ? `${buttonLabel.slice(0, 13)}...` : buttonLabel

    const getItemButton = (item: IDropdownItem) => {
        const itemLabel = item.label

        return (
            <button
                key={itemLabel}
                onClick={() => {
                    onItemSelected(item)
                    close()
                }}
                className={`w-full text-left hover:bg-blue hover:text-secondary-background px-4 py-1
                    ${itemLabel === selectedOption && 'bg-blue text-white'}`}
            >
                {itemLabel}
            </button>
        )
    }

    const getCustomFilterPopover = () => <Popover className='relative'>
        <Popover.Button>
            <div
                className='flex items-center py-1 mt-1 px-4 w-60 text-left hover:bg-blue hover:text-secondary-background'
            >
                <Plus size='small' />
                <span className='ml-2'>{customFilter.label}</span>
            </div>
        </Popover.Button>
        {customFilter.popoverPanel}
    </Popover>

    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button>
                        <div className={`flex items-center justify-between w-48 whitespace-nowrap py-2 px-3 rounded-lg font-body-bold text-sm
                                ${open && !selectedOption ? 'bg-secondary-background' : ''}
                                ${selectedOption ? 'bg-blue text-white' : 'border border-table-grey text-dark-grey'}`}>
                            <div className='flex items-center space-x-2'>
                                <span>{icon}</span>
                                <span>{formattedButtonLabel}</span>
                            </div>
                            {open ? <ChevronUp primaryColor={chevronColor} /> : <ChevronDown primaryColor={chevronColor} />}
                        </div>
                    </Popover.Button>
                    <Popover.Panel>
                        {({ close }) => (
                            <div className='flex flex-col items-start min-w-full bg-white absolute z-0 mt-4 shadow-filter rounded-lg py-2'>
                                {filter &&
                                    <button
                                        onClick={() => {
                                            filter()
                                            close()
                                        }}
                                        className='underline py-1 mb-1 px-4 w-full text-left hover:bg-blue hover:text-secondary-background'
                                    >
                                        {t('clear_filter')}
                                    </button>
                                }

                                {items.map(item => getItemButton(item))}
                                {customFilter && getCustomFilterPopover()}
                            </div>
                        )}
                    </Popover.Panel>
                </>
            )}
        </Popover>
    )
}

export default Dropdown
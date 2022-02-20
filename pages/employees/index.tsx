import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '@components/Loader'
import { useSupabaseGetEmployees, useSupabaseUpsertEntity, useSupabaseDeleteEntity } from '@services/supabase'
import PrimaryButton from '@components/PrimaryButton'
import AddEmployeeModal from '@components/employees/index/AddEmployeeModal'

const Employees: NextPage = () => {
    useEffect(() => setMounted(true), [])
    const [mounted, setMounted] = useState(false)
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
    const router = useRouter()

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError
    } = useSupabaseGetEmployees()
    const { 
        upsertEntity: addEmployee,
        loading: addEmployeeLoading, 
        error: addEmployeeError 
    } = useSupabaseUpsertEntity('employees')
    const { 
        deleteEntity: deleteEmployee, 
        loading: deleteEmployeeLoading, 
        error: deleteEmployeeError 
    } = useSupabaseDeleteEntity('employees')

    async function deleteEmployeeAndReload(id: number) {
        await deleteEmployee(id)
        router.reload()
    }

    if (!mounted || employeesLoading || addEmployeeLoading || deleteEmployeeLoading) {
        return <Loader />
    }

    if (employeesError || addEmployeeError || deleteEmployeeError) {
        return (
            <div>An error occurred: {employeesError || addEmployeeError || deleteEmployeeError}</div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-center py-2'>
            <div>
                <div className='flex flex-wrap items-center justify-around mt-6'>
                    <PrimaryButton label='Add employee' onClick={() => setShowAddEmployeeModal(prevState => !prevState)} />
                    {showAddEmployeeModal && <AddEmployeeModal addEmployee={addEmployee} toggleModal={setShowAddEmployeeModal} />}

                    <div className='p-2 mt-6 w-96 rounded-xl focus:text-blue-600'>
                        <table className='shadow-lg bg-white'>
                            <tbody>
                                <tr>
                                    <th className='bg-blue-400 border text-left px-4 py-4'>
                                    Id
                                    </th>
                                    <th className='bg-blue-400 border text-left px-4 py-4'>
                                    First Name
                                    </th>
                                    <th className='bg-blue-400 border text-left px-8 py-4'>
                                    Last Name
                                    </th>
                                    <th className='bg-blue-400 border text-left px-8 py-4'>
                                    BirthDate
                                    </th>
                                    <th className='bg-blue-400 border text-left px-14 py-4'>
                                    Salary
                                    </th>
                                    <th className='bg-blue-400 border text-left px-16 py-4'>
                                    Coefficient
                                    </th>

                                    <th className='bg-blue-400 border text-left px-4 py-4'>
                                    Action
                                    </th>
                                </tr>
                                {employees?.map((employee, index) => (
                                    <tr key={employee.id}>
                                        <td className='border px-4 py-4'>{index + 1}</td>
                                        <td className='border px-4 py-4'>{employee.first_name}</td>
                                        <td className='border px-8 py-4'>{employee.last_name}</td>
                                        <td className='border px-8 py-4'>{employee.date_of_birth}</td>
                                        <td className='border px-8 py-4'>{employee.salary}</td>
                                        <td className='border px-8 py-4'>{employee.coefficient}</td>
                                        <td className='border px-8 py-4'>
                                            {' '}
                                            <button
                                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                                type='button'
                                                onClick={() => deleteEmployeeAndReload(employee.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employees

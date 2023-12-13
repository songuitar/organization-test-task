import {Employee} from "@organization-tree/api-interfaces";


type Props = {
    employee: Employee
}

export const EmployeeCard: React.FC<Props> = ({employee}) => {
    return( <div className='employee'> {employee.name} </div>)
}

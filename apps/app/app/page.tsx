'use client'

import {useTree} from "./hooks/data-fetching";
import {EmployeeCard} from "./components/employee";




export default function Index() {

   const { tree, isLoading, isError } = useTree()



  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
      <div className='treeContainer'>
          {tree?.map(employee => {
              return(
                  <EmployeeCard key={employee.id} employee={employee}></EmployeeCard>
              )
          })}
      </div>
  );
}

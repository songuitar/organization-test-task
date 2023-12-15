'use client'

import {useTree} from "./hooks/data-fetching";
import {Employee} from "@organization-tree/api-interfaces";


function renderTree(tree: Employee[]) {
  return (
    <ul className="tree">
      {tree?.map(employee => (
        <li key={employee.id}>
          <code>{employee.name}</code>
          { renderTree(employee.subordinates)}
        </li>
      ))}
    </ul>
  )
}


export default function Index() {

   const { tree, isLoading, isError } = useTree()

  return (
    renderTree(tree)
  );
}

'use client'

import {useTree} from "./hooks/data-fetching";
import {Employee} from "@organization-tree/api-interfaces";
import {Item, Menu, useContextMenu} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";


function renderTree(tree: Employee[], lvl: number = 0) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { show } = useContextMenu({
    id: 'Menu',
  });


  return (
      <ul className={lvl === 0 ? "tree" : ''}>
        {tree?.map(employee => (
          <li key={employee.id} onClick={(event) => {
            event.stopPropagation()

            show({
              event,
              props: {
                employeeId: employee.id
              }
            })
          }}>
            <code>{employee.name + " (" + employee.id + ")"}</code>
            { renderTree(employee.subordinates, lvl + 1)}
          </li>
        ))}
      </ul>
  )
}


export default function Index() {

  const { tree, isLoading, isError } = useTree()

  function remove({ event, props }){
    console.log(props);
  }
  function changeBoss({ event, props }){
    console.log(props);
  }

  return (
    <>
      {renderTree(tree)}
      <Menu id='Menu'>
        <Item onClick={remove}>Remove</Item>
        <Item onClick={changeBoss}>Change Boss</Item>
      </Menu>
    </>
  );
}

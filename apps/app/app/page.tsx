'use client'

import {changeBoss, createEmployee, deleteEmployee, useList, useTree} from "./api/server-state";
import {Employee} from "@organization-tree/api-interfaces";
import {Item, Menu, Submenu, useContextMenu} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";


function renderTree(tree: Employee[], lvl: number = 0) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const contextMenu = useContextMenu({
        id: 'Menu',
    }).show;


    return (
        <ul className={lvl === 0 ? "tree" : ''}>
            {tree?.map(employee => (
                <li key={employee.id} onClick={(event) => {
                    event.stopPropagation()

                    contextMenu({
                        event,
                        props: {
                            employeeId: employee.id
                        }
                    })
                }}>
                    <code>{employee.name + " (" + employee.id + ")"}</code>
                    {renderTree(employee.subordinates, lvl + 1)}
                </li>
            ))}
        </ul>
    )
}


export default function Index() {
    const {tree} = useTree()
    const {list} = useList()

    async function remove(employeeId: number) {
        await deleteEmployee(employeeId)
    }

    async function onNewBossSelect(newBossId: number, employeeId: number) {
        await changeBoss(newBossId, employeeId)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        await createEmployee(data.get('name') as string)
    }

    return (
        <div className={'root'}>
            <div className={'form'}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">New employee name: </label>
                    <input id="name" name="name" type="text" required={true}/>

                    <button type={"submit"}>Create</button>
                </form>
            </div>
            {renderTree(tree)}
            <Menu id='Menu'>
                <Item onClick={({props}) => {
                    remove(props.employeeId)
                }}>Remove</Item>
                <Submenu label="Change boss to">
                    {list?.map(employee => (
                        <Item key={employee.id}
                              onClick={({props}) => onNewBossSelect(employee.id, props.employeeId)}>{employee.name + " (" + employee.id + ")"}</Item>
                    ))}
                </Submenu>
            </Menu>
        </div>
    );
}



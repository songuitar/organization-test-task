
import {Employee} from "@organization-tree/api-interfaces";
import useSWR, {mutate} from "swr";
import axios from 'axios';



const treeActionId = `http://localhost:3000/api/employee/tree`
const rootActionId = `http://localhost:3000/api/employee`

const fetcher = (...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return fetch(...args).then((res) => res.json());
}

export function useTree() {
    const actionId = treeActionId
    const { data, error, isLoading } = useSWR(actionId, fetcher)

    return {
        tree: data as Employee[],
        isLoading,
        isError: error,
        actionId
    }
}

export function useList() {
    const { data, error, isLoading } = useSWR(rootActionId, fetcher)

    return {
        list: data as Employee[],
        isLoading,
        isError: error
    }
}

export async function changeBoss(newBossId: number, employeeId: number) {
    await axios.patch(`http://localhost:3000/api/employee/${employeeId}/boss`, {newBossId})
        .catch(error => {
            if (error?.response?.status === 400) {
                alert(error.response.data.message)
            }
        })
    await mutate(treeActionId)
}

export async function createEmployee(name: string) {
    await axios.post(rootActionId, {name})
    await mutate(treeActionId)
    await mutate(rootActionId)
}

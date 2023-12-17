
import {Employee} from "@organization-tree/api-interfaces";
import useSWR, {mutate} from "swr";
import axios from 'axios';

const getTreeActionId = `http://localhost:3000/api/employee/tree`
const getListActionId = `http://localhost:3000/api/employee`

const fetcher = (...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return fetch(...args).then((res) => res.json());
}

export function useTree() {
    const actionId = getTreeActionId
    const { data, error, isLoading } = useSWR(actionId, fetcher)

    return {
        tree: data as Employee[],
        isLoading,
        isError: error,
        actionId
    }
}

export function useList() {
    const { data, error, isLoading } = useSWR(getListActionId, fetcher)

    return {
        list: data as Employee[],
        isLoading,
        isError: error
    }
}

export async function changeBoss(newBossId: number, employeeId: number) {
    await axios.patch(`http://localhost:3000/api/employee/${employeeId}/boss`, {newBossId})
    await mutate(getTreeActionId)
}

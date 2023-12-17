
import {Employee} from "@organization-tree/api-interfaces";
import useSWR from "swr";

const fetcher = (...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return fetch(...args).then((res) => res.json());
}

export function useTree() {
    const { data, error, isLoading } = useSWR(`http://localhost:3000/api/employee/tree`, fetcher)

    return {
        tree: data as Employee[],
        isLoading,
        isError: error
    }
}

export function useList() {
    const { data, error, isLoading } = useSWR(`http://localhost:3000/api/employee`, fetcher)

    return {
        list: data as Employee[],
        isLoading,
        isError: error
    }
}

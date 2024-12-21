/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from "react";
import {toast} from "@/hooks/use-toast.ts";
import {useDispatch} from "react-redux";
import {AsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from "@/store/Store.ts";

type UseFetchDataOptions<T = void> = {
    fetchStatus: string;
    fetchError?: string | null;
    fetchAction: AsyncThunk<any, T, any>;
    fetchParam?: T;
};

export const useFetchData = <T = void>({ fetchStatus, fetchError, fetchAction, fetchParam }: UseFetchDataOptions<T>) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (fetchStatus === "idle") {
            if (fetchParam !== undefined) {
                dispatch(fetchAction(fetchParam));
            } else {
                dispatch(fetchAction() as any);
            }
        }
    }, [fetchStatus, dispatch, fetchAction, fetchParam]);

    useEffect(() => {
        if (fetchStatus === "failed" && fetchError) {
            toast({
                title: "An error occurred",
                description: fetchError,
                variant: "destructive",
            });
        }
    }, [fetchStatus, fetchError]);
};


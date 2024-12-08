/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from "react";
import {toast} from "@/hooks/use-toast.ts";
import {useDispatch} from "react-redux";
import {AsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from "@/store/Store.ts";

type UseFetchDataOptions = {
    fetchStatus: string;
    fetchError?: string | null;
    fetchAction: AsyncThunk<any, void, any>;
};

export const useFetchData = ({ fetchStatus, fetchError, fetchAction }: UseFetchDataOptions) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (fetchStatus === "idle") {
            dispatch(fetchAction());
        }
    }, [fetchStatus, dispatch, fetchAction]);

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


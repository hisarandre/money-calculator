import React from "react";
import {useRouteError} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

const Error = () => {
    const error = useRouteError();

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <Button asChild>
                <a href="/">Go back home</a>
            </Button>
        </div>
    )
}

export default Error;
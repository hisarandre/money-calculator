import {useRouteError} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

const Error = () => {
    const error = useRouteError();

    const errorMessage = (() => {
        if (typeof error === "object" && error !== null) {
            if ("statusText" in error) return (error as { statusText?: string }).statusText;
            if ("message" in error) return (error as { message?: string }).message;
        }
        return "Unknown error";
    })();

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMessage}</i>
            </p>
            <Button asChild>
                <a href="/">Go back home</a>
            </Button>
        </div>
    );
};

export default Error;

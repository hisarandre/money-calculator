import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.tsx'
import {Provider} from 'react-redux';
import Store from '@/store/Store.ts';
import {ThemeProvider} from "@/services/ThemeProvider.tsx";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Error from "@/pages/Error.tsx";
import ProjectedCalculator from "@/pages/ProjectedCalculator.tsx";
import DailyBudget from "@/pages/DailyBudget.tsx";
import ResetBudget from "@/pages/ResetBudget.tsx";
import AddBudget from "@/pages/InitializeBudget.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <Error/>,
        children: [
            {
                path: "/",
                element: <ProjectedCalculator/>,
            },
            {
                path: "/daily-budget",
                element: <DailyBudget/>,
            },
            {
                path: "/reset-budget",
                element: <ResetBudget/>,
            },
            {
                path: "/initialize-budget",
                element: <AddBudget/>,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={Store}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RouterProvider router={router}/>
            </ThemeProvider>
        </Provider>
    </StrictMode>,
)

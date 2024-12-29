import { Provider } from 'react-redux';
import Store from '@/store/Store';
import { ThemeProvider } from "@/services/ThemeProvider";
import {
    createBrowserRouter,
    RouterProvider,
    RouteObject
} from "react-router-dom";
import App from '@/App';
import Error from "@/pages/Error";
import ProjectedCalculator from "@/pages/ProjectedCalculator";
import DailyBudget from "@/pages/DailyBudget";
import ResetBudget from "@/pages/ResetBudget";
import AddBudget from "@/pages/InitializeBudget";
import Settings from "@/pages/Settings";
import Login from '@/pages/Login';
import ProtectedRoute from "@/components/ProtectedRoute";
import {AuthProvider} from "@/services/AuthProvider.tsx";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/",
                element: <ProtectedRoute><ProjectedCalculator /></ProtectedRoute>,
            },
            {
                path: "/settings",
                element: <ProtectedRoute><Settings /></ProtectedRoute>,
            },
            {
                path: "/daily-budget",
                element: <ProtectedRoute><DailyBudget /></ProtectedRoute>,
            },
            {
                path: "/reset-budget",
                element: <ProtectedRoute><ResetBudget /></ProtectedRoute>,
            },
            {
                path: "/initialize-budget",
                element: <ProtectedRoute><AddBudget /></ProtectedRoute>,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

function AppWrapper() {
    return (
        <Provider store={Store}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default AppWrapper;
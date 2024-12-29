import {useState} from "react";
import {AppSidebar} from "@/components/AppSidebar.tsx";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from '@/services/useAuth';

function App() {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';

    if (!user && isLoginPage) {
        return (
            <main className="flex-1 p-6">
                <div className="text-center mb-6">
                    <span className="text-sm font-bold">Money Calculator</span>
                </div>
                <Outlet />
                <Toaster />
            </main>
        );
    }

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            {user && <AppSidebar />}
            <main className="flex-1 p-6 space-y-6">
                <div className="h-6 flex items-center gap-4">
                    {user && (
                        <>
                            <SidebarTrigger />
                            <Separator orientation="vertical" />
                        </>
                    )}
                    <span className="text-sm font-bold">Money Calculator</span>
                </div>

                <div className="">
                    <Outlet />
                </div>

                <Toaster />
            </main>
        </SidebarProvider>
    );
}

export default App;
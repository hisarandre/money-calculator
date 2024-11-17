import {AppSidebar} from "@/components/AppSidebar.tsx";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import { Outlet } from "react-router-dom";

function App() {

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 p-6 space-y-6">
                <div className="h-6 flex items-center gap-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" />
                    <span className="text-sm font-bold">Money Calculator</span>
                </div>

                <div className="">
                    <Outlet/>
                </div>

                <Toaster/>
            </main>
        </SidebarProvider>
    )
}

export default App

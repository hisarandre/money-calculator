import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.tsx'
import {Provider} from 'react-redux';
import Store from '@/store/Store';
import {Toaster} from "@/components/ui/toaster"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/AppSidebar.tsx";
import {ThemeProvider} from "@/services/ThemeProvider.tsx";
import {Separator} from "@/components/ui/separator.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={Store}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1 p-6 space-y-6">
                        <div className="h-6 flex items-center gap-4">
                            <SidebarTrigger />
                            <Separator orientation="vertical" />
                            <span className="text-sm font-bold">Money Calculator</span>
                        </div>

                        <App/>

                        <Toaster/>
                    </main>
                </SidebarProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>,
)

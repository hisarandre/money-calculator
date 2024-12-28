import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "@/config/firebase-config";
import { onAuthStateChanged, User, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Loader2 } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin h-8 w-8" />
        </div>
    );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthContextType>({
        user: null,
        loading: true
    });

    useEffect(() => {
        // Set persistence immediately when the provider mounts
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    setAuthState({ user, loading: false });
                });

                return () => unsubscribe();
            })
            .catch((error) => {
                console.error("Failed to set auth persistence:", error);
                setAuthState(state => ({ ...state, loading: false }));
            });
    }, []);

    // Show loading spinner while checking auth state
    if (authState.loading) {
        return <LoadingSpinner />;
    }

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, useAuth };
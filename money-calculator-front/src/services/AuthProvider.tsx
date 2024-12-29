import React, {useState, useEffect} from "react";
import {auth} from "@/config/firebase-config";
import {onAuthStateChanged, setPersistence, browserLocalPersistence} from "firebase/auth";
import {Loader2} from "lucide-react";
import {AuthContextType} from "@/models/AuthContext.ts";
import {AuthContext} from "@/services/AuthContext.tsx";

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin h-8 w-8"/>
        </div>
    );
}

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthContextType>({
        user: null,
        loading: true
    });

    useEffect(() => {
        // Set persistence immediately when the provider mounts
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    setAuthState({user, loading: false});
                });

                return () => unsubscribe();
            })
            .catch((error) => {
                console.error("Failed to set auth persistence:", error);
                setAuthState(state => ({...state, loading: false}));
            });
    }, []);

    // Show loading spinner while checking auth state
    if (authState.loading) {
        return <LoadingSpinner/>;
    }

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
}
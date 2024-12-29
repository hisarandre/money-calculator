import {useState, useEffect} from 'react';
import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '@/config/firebase-config';
import {useNavigate, useLocation} from 'react-router-dom';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import {useAuth} from '@/services/useAuth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth();

    // Get the path the user tried to visit
    const from = location.state?.from || "/";

    useEffect(() => {
        // If user is already authenticated, redirect
        if (user) {
            navigate(from, {replace: true});
        }
    }, [user, navigate, from]);

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: "Welcome",
                description: `Signed in as ${userCredential.user.email}`,
                variant: "positive",
            });
            // Navigate to the page they tried to visit
            navigate(from, {replace: true});
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            toast({
                title: "Sign In Failed",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            alert("Please enter your email to reset your password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent. Please check your inbox.");
        } catch (error) {
            console.error("Error sending password reset email:", error);
            alert("Failed to send password reset email.");
        }
    };

    return (
        <div className="max-w-sm mx-auto p-6 flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center flex flex-col gap-2">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Login and enjoy budgeting
                    </CardDescription>
                </CardHeader>

                <div className="p-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">
                            Email:
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block">
                                Password:
                            </label>
                            <a
                                href="#"
                                onClick={handlePasswordReset}
                                className="text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSignIn} variant="default" className="w-full">
                            Sign In
                        </Button>
                    </div>
                </div>

                <CardFooter className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                        Built with love and caffeine.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Login;
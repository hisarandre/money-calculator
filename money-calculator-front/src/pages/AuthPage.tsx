import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/services/AuthContext';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get the path the user tried to visit
  const from = location.state?.from || "/";

  useEffect(() => {
    // If user is already authenticated, redirect
    if (user) {
      navigate(from, { replace: true });
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
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Goodbye",
        description: "You have successfully logged out.",
        variant: "positive",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Log Out Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <Card>
        <CardHeader className="text-center mb-4">
          <h2 className="text-lg font-bold">Authentication</h2>
        </CardHeader>

        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password:</label>
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

export default AuthPage;
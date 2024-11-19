import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Chrome } from 'lucide-react';

export function SignInButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Welcome!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error signing in",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignIn} disabled={loading} className="gap-2">
      <Chrome className="h-4 w-4" />
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
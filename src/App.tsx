import { AuthProvider } from '@/components/Auth/AuthProvider';
import { useAuth } from '@/components/Auth/AuthProvider';
import { SignInButton } from '@/components/Auth/SignInButton';
import { CostCalculator } from './components/CostCalculator';
import { ConfigManager } from './components/ConfigManager';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Settings } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clinical Mind AI Cost Calculator</h1>
          <div className="flex items-center gap-4">
            {user && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Configuration</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ConfigManager />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {user ? (
              <Button variant="outline" onClick={() => auth.signOut()}>
                Sign Out
              </Button>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </header>
      <main>
        <CostCalculator />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
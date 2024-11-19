import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useScenarios } from '@/hooks/useScenarios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { CalculatorState } from '@/components/CostCalculator/types';

interface ScenarioManagerProps {
  currentState: CalculatorState;
  onLoadScenario: (state: CalculatorState) => void;
}

export function ScenarioManager({ currentState, onLoadScenario }: ScenarioManagerProps) {
  const [user] = useAuthState(auth);
  const { scenarios, saveScenario, deleteScenario } = useScenarios(user?.uid || '');
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDescription, setNewScenarioDescription] = useState('');
  const { toast } = useToast();

  const handleSaveScenario = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scenarios.",
        variant: "destructive",
      });
      return;
    }

    if (!newScenarioName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your scenario.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveScenario(newScenarioName, currentState, newScenarioDescription);
      toast({
        title: "Scenario saved",
        description: "Your scenario has been saved successfully.",
      });
      setNewScenarioName('');
      setNewScenarioDescription('');
    } catch (error) {
      toast({
        title: "Error saving scenario",
        description: "There was an error saving your scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScenario = async (id: string) => {
    try {
      await deleteScenario(id);
      toast({
        title: "Scenario deleted",
        description: "Your scenario has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting scenario",
        description: "There was an error deleting your scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadScenario = (state: CalculatorState) => {
    onLoadScenario(state);
    toast({
      title: "Scenario loaded",
      description: "The selected scenario has been loaded successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Manager</CardTitle>
        <CardDescription>Save and load different cost configurations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">Save Current Scenario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Scenario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scenario-name">Scenario Name</Label>
                <Input
                  id="scenario-name"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Basic Training Setup"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scenario-description">Description (optional)</Label>
                <Textarea
                  id="scenario-description"
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  placeholder="Add notes about this configuration..."
                />
              </div>
              <Button onClick={handleSaveScenario} className="w-full">
                Save Scenario
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {scenarios.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Saved Scenarios</h3>
            <div className="grid gap-4">
              {scenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <CardTitle>{scenario.name}</CardTitle>
                    {scenario.description && (
                      <CardDescription>{scenario.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleLoadScenario(scenario.state)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteScenario(scenario.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
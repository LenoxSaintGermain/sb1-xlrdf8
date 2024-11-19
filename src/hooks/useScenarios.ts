import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { CalculatorState } from '@/components/CostCalculator/types';

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  state: CalculatorState;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  shared: boolean;
}

export function useScenarios(userId: string) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const q = query(
          collection(db, 'scenarios'),
          where('createdBy', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const loadedScenarios = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        })) as Scenario[];
        setScenarios(loadedScenarios);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadScenarios();
    }
  }, [userId]);

  const saveScenario = async (
    name: string,
    state: CalculatorState,
    description?: string
  ) => {
    try {
      const newScenario = {
        name,
        description,
        state,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        shared: false,
      };

      const docRef = await addDoc(collection(db, 'scenarios'), newScenario);
      const scenario = { ...newScenario, id: docRef.id };
      setScenarios([...scenarios, scenario]);
      return scenario;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateScenario = async (
    id: string,
    updates: Partial<Omit<Scenario, 'id' | 'createdAt' | 'createdBy'>>
  ) => {
    try {
      const scenarioRef = doc(db, 'scenarios', id);
      await updateDoc(scenarioRef, {
        ...updates,
        updatedAt: new Date(),
      });

      setScenarios(scenarios.map(scenario =>
        scenario.id === id
          ? { ...scenario, ...updates, updatedAt: new Date() }
          : scenario
      ));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteScenario = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'scenarios', id));
      setScenarios(scenarios.filter(scenario => scenario.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    scenarios,
    loading,
    error,
    saveScenario,
    updateScenario,
    deleteScenario,
  };
}
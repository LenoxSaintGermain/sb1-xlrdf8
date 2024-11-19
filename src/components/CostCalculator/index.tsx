import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { BasePlatform } from './BasePlatform';
import { UsageParameters } from './UsageParameters';
import { ProviderSelection } from './ProviderSelection';
import { CustomProviders } from './CustomProviders';
import { CostBreakdown } from './CostBreakdown';
import { TokenUsageExamples } from './TokenUsageExamples';
import { BusinessInsights } from './BusinessInsights';
import { ScenarioManager } from '../ScenarioManager';
import { BASE_PLANS } from './constants';
import type { CalculatorState, CostBreakdown as CostBreakdownType } from './types';

const initialState: CalculatorState = {
  basePlan: 'starter',
  additionalUsers: 0,
  monthlyTokens: 1000000,
  monthlyCharacters: 100000,
  providers: {
    openai: {
      enabled: false,
      selectedModels: [],
      useEmbeddings: false,
      embeddingSize: 'small',
      batchEmbeddings: false,
    },
    anthropic: {
      enabled: false,
    },
    gemini: {
      enabled: false,
      selectedModels: [],
    },
    elevenlabs: {
      enabled: false,
      selectedPlans: [],
    },
  },
  customProviders: [],
};

export function CostCalculator() {
  const [user] = useAuthState(auth);
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = localStorage.getItem('calculatorState');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('calculatorState', JSON.stringify(state));
  }, [state]);

  const calculateCosts = (): CostBreakdownType => {
    return {
      basePlatform: BASE_PLANS[state.basePlan].price,
      additionalUsers: state.additionalUsers * 8,
      openai: { total: 0, models: {} },
      anthropic: 0,
      gemini: { total: 0, models: {} },
      elevenlabs: { total: 0, plans: {} },
      customProviders: {},
      total: BASE_PLANS[state.basePlan].price + (state.additionalUsers * 8),
    };
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <BasePlatform
            selectedPlan={state.basePlan}
            additionalUsers={state.additionalUsers}
            onPlanChange={(plan) => setState({ ...state, basePlan: plan })}
            onUsersChange={(users) => setState({ ...state, additionalUsers: users })}
          />
          <UsageParameters
            monthlyTokens={state.monthlyTokens}
            monthlyCharacters={state.monthlyCharacters}
            onTokensChange={(tokens) => setState({ ...state, monthlyTokens: tokens })}
            onCharactersChange={(chars) => setState({ ...state, monthlyCharacters: chars })}
          />
          <TokenUsageExamples
            monthlyTokens={state.monthlyTokens}
            monthlyCharacters={state.monthlyCharacters}
          />
          <BusinessInsights
            costs={calculateCosts()}
            monthlyTokens={state.monthlyTokens}
          />
          {user && (
            <ScenarioManager
              currentState={state}
              onLoadScenario={(loadedState) => setState(loadedState)}
            />
          )}
        </div>
        <div className="space-y-8">
          <ProviderSelection
            state={state}
            onChange={setState}
          />
          <CustomProviders
            state={state}
            onChange={setState}
          />
          <CostBreakdown
            state={state}
          />
        </div>
      </div>
    </div>
  );
}
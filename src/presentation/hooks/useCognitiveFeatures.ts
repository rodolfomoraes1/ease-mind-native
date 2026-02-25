import { useCallback } from 'react';
import { useUserInfo } from '../contexts/UserInfoContext';
import type { CognitivePreferences } from '@/shared/types/user';

export function useCognitiveFeatures() {
  const { userInfo, loading, updateCognitivePrefs } = useUserInfo();
  const preferences = userInfo?.cognitivePreferences;

  const updatePreference = useCallback(
    async <K extends keyof CognitivePreferences>(key: K, value: CognitivePreferences[K]) => {
      await updateCognitivePrefs({ [key]: value });
    },
    [updateCognitivePrefs],
  );

  const toggleFocusMode = useCallback(
    () => updatePreference('focusMode', !preferences?.focusMode),
    [preferences, updatePreference],
  );

  const toggleSummaryMode = useCallback(
    () => updatePreference('summaryMode', !preferences?.summaryMode),
    [preferences, updatePreference],
  );

  const toggleAnimations = useCallback(
    () => updatePreference('animationsEnabled', !preferences?.animationsEnabled),
    [preferences, updatePreference],
  );

  const toggleCognitiveAlerts = useCallback(
    () => updatePreference('cognitiveAlerts', !preferences?.cognitiveAlerts),
    [preferences, updatePreference],
  );

  const setFontSize = useCallback(
    (size: CognitivePreferences['fontSize']) => updatePreference('fontSize', size),
    [updatePreference],
  );

  const setSpacingLevel = useCallback(
    (spacing: CognitivePreferences['spacingLevel']) => updatePreference('spacingLevel', spacing),
    [updatePreference],
  );

  const setComplexityLevel = useCallback(
    (level: CognitivePreferences['complexityLevel']) => updatePreference('complexityLevel', level),
    [updatePreference],
  );

  return {
    preferences,
    loading,
    updatePreference,
    toggleFocusMode,
    toggleSummaryMode,
    toggleAnimations,
    toggleCognitiveAlerts,
    setFontSize,
    setSpacingLevel,
    setComplexityLevel,
  };
}

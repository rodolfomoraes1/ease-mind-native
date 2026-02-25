export type NavigationProfile = 'beginner' | 'intermediate' | 'advanced';

export interface CognitivePreferences {
  complexityLevel: 'simple' | 'full';
  focusMode: boolean;
  summaryMode: boolean;
  spacingLevel: 'compact' | 'normal' | 'relaxed';
  fontSize: 'small' | 'medium' | 'large';
  cognitiveAlerts: boolean;
  animationsEnabled: boolean;
  alertIntervalMinutes: number;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  navigationProfile: NavigationProfile;
  specificNeeds: string[];
  studyRoutine?: string;
  workRoutine?: string;
  cognitivePreferences: CognitivePreferences;
}

export const defaultCognitivePreferences: CognitivePreferences = {
  complexityLevel: 'full',
  focusMode: false,
  summaryMode: false,
  spacingLevel: 'normal',
  fontSize: 'medium',
  cognitiveAlerts: true,
  animationsEnabled: true,
  alertIntervalMinutes: 25,
};

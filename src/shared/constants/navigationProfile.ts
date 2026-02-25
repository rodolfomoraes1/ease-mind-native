export const profileConfig = {
  beginner: {
    showTooltips: true,
    maxTasksInDoing: 1,
    showLimits: true,
    simplifiedKanban: true,
    showOnboarding: true,
    showAnalytics: false,
  },
  intermediate: {
    showTooltips: false,
    maxTasksInDoing: 3,
    showLimits: true,
    simplifiedKanban: false,
    showOnboarding: false,
    showAnalytics: false,
  },
  advanced: {
    showTooltips: false,
    maxTasksInDoing: 5,
    showLimits: false,
    simplifiedKanban: false,
    showOnboarding: false,
    showAnalytics: true,
  },
} as const;

export type NavigationProfile = keyof typeof profileConfig;

export function getProfileConfig(profile: NavigationProfile) {
  return profileConfig[profile] ?? profileConfig.intermediate;
}

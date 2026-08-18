const ONBOARDING_KEY = 'onboardingComplete';

export function isOnboardingComplete() {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function completeOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

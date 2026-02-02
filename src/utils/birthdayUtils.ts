/**
 * Check if today is Spot's birthday (February 26th)
 */
export const isBirthday = (): boolean => {
  const today = new Date();
  const month = today.getMonth(); // 0-indexed, so February = 1
  const day = today.getDate();
  return month === 1 && day === 26;
};

/**
 * Get the dismissal key for today's birthday celebration
 */
export const getBirthdayDismissalKey = (): string => {
  const today = new Date();
  return `birthday-dismissed-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
};

/**
 * Check if user has dismissed the birthday celebration today
 */
export const hasDismissedBirthdayToday = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(getBirthdayDismissalKey()) === 'true';
};

/**
 * Mark the birthday celebration as dismissed for today
 */
export const dismissBirthdayToday = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getBirthdayDismissalKey(), 'true');
};

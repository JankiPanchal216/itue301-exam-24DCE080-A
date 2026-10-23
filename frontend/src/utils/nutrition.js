/**
 * Return portion weight in grams (defaults to 100g if absent)
 */
export function weightOf(item) {
  if (!item) return 100;
  return item.weightG ?? 100;
}

/**
 * Energy (kcal) = calories per 100 g * portion weight / 100, rounded to nearest whole number
 */
export function kcal(item) {
  if (!item) return 0;
  const calPer100 = item.caloriesPer100g ?? 0;
  return Math.round((calPer100 * weightOf(item)) / 100);
}

export const SORT_OPTIONS = [
  { id: 'recent', label: 'Recently used' },
  { id: 'most', label: 'Most used' },
  { id: 'new', label: 'Newly added' },
]
export const DEFAULT_VISIBLE = 6
const time = (iso) => (iso ? new Date(iso).getTime() : 0)
const comparators = {
  recent: (a, b) => time(b.lastUsedAt) - time(a.lastUsedAt),
  most: (a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0),
  new: (a, b) => time(b.subscribedAt) - time(a.subscribedAt),
}
export function sortProducts(products, sortId) {
  const compare = comparators[sortId] ?? comparators.recent
  return [...products].sort((a, b) => compare(a, b) || a.name.localeCompare(b.name))
}
export function formatBillingDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

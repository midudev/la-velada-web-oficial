export function formatCount(value: number): string {
  if (value >= 1_000_000) {
    const scaled = value / 1_000_000
    const fixed = scaled >= 10 ? scaled.toFixed(0) : scaled.toFixed(1)
    return `${fixed.replace('.', ',')}M`
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`
  }
  return String(value)
}

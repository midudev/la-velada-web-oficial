export function removeMirroredPairs<T>(pairsMap: Record<string, T[]>) {
  const uniquePairs: Record<string, T[]> = {}
  const seenPairs = new Set<string>() // Para que no se repitan parejas

  for (const pair1 in pairsMap) {
    if (pairsMap.hasOwnProperty(pair1)) {
      const pair2 = pairsMap[pair1][0]

      // Crear una cadena de caracteres ordenada para comparar parejas
      const sortedPair = [pair1, pair2].sort().join('|')

      // Si esta pareja (en cualquier orden) no ha sido vista antes, añadirla
      if (!seenPairs.has(sortedPair)) {
        uniquePairs[pair1] = [pair2]
        seenPairs.add(sortedPair)
      }
    }
  }
  return uniquePairs
}

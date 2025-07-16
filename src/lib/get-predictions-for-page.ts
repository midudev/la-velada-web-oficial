// Función auxiliar para procesar predicciones
const processPredictions = (predictions: any[]) => {
  if (predictions) {
    predictions.forEach(
      (prediction: {
        combat_id: string
        fighter_id: string
        percentage: number
        votes: number
      }) => {
        console.log(prediction)
        document.dispatchEvent(
          new CustomEvent('update-prediction-bar', {
            detail: {
              id: prediction.combat_id,
              data: prediction,
            },
          }),
        )
      },
    )
  }
}

export const getPredictionsForPage = async () => {
  const CACHE_KEY = 'predictions-cache'
  const CACHE_DURATION = 15 * 1000 // 15 segundos en milisegundos

  // Verificar si hay datos en caché y si no han expirado
  const cachedData = localStorage.getItem(CACHE_KEY)
  if (cachedData) {
    try {
      const { predictions, timestamp } = JSON.parse(cachedData)
      const now = Date.now()

      // Si la caché no ha expirado, usar los datos cacheados
      if (now - timestamp < CACHE_DURATION) {
        console.log('Usando datos de caché para predicciones')
        processPredictions(predictions)
        return
      }
    } catch (error) {
      console.error('Error al parsear datos de caché:', error)
      localStorage.removeItem(CACHE_KEY)
    }
  }

  // Si no hay caché válida, hacer la petición al servidor
  try {
    const predictionsResponse = await fetch('/api/predictions')
    const { predictions } = await predictionsResponse.json()

    // Guardar en caché con timestamp
    const cacheData = {
      predictions,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

    processPredictions(predictions)
  } catch (error) {
    console.error('Error al obtener predicciones:', error)
  }
}

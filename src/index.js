/** Получение ссылки на элемент Canvas
 * @param {Object} [options={}] - Объект с параметрами
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 * @returns {HTMLCanvasElement} - Элемент холста
 */
export const getCanvas = ({ debug = false } = {}) => {
  const canvas = document.querySelector("canvas")
  if (!canvas) throw new Error("Не найден элемент canvas.")
  if (debug) {
    const canvasWidth = canvas.width || canvas.clientWidth
    const canvasHeight = canvas.height || canvas.clientHeight
    console.log("======================= CANVAS =======================")
    console.log(`Найден элемент canvas с размерами ${canvasWidth}x${canvasHeight}`)
  }
  return canvas
}

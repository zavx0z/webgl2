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

/** Получение контекста WebGL2.
 * @param {Object} options - Объект с параметрами
 * @param {HTMLCanvasElement} options.canvas - Элемент холста
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 * @returns {WebGL2RenderingContext} WebGL контекст
 */
export const getContext = ({ canvas, debug = false }) => {
  const gl = canvas.getContext("webgl2")
  if (!gl)
    if (typeof WebGL2RenderingContext !== "undefined")
      throw new Error(
        "Ваш браузер, похоже, поддерживает WebGL2, но он может быть отключен. Попробуйте обновить ОС и / или драйверы видеокарты"
      )
    else throw new Error("Ваш браузер совсем не поддерживает WebGL2")
  if (debug) {
    console.log("======================= WebGL2 =======================")
    console.log(`Получен контекст ${gl.getParameter(gl.VERSION)}`)
    console.log(`Имя производителя: ${gl.getParameter(gl.VENDOR)}`)
    console.log(`Имя реализации: ${gl.getParameter(gl.RENDERER)}`)
    console.log(`Максимальный размер текстуры: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}`)
    console.log(`Максимальный размер кубической текстуры: ${gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)}`)
    console.log(`Максимальное количество буферов для рисования: ${gl.getParameter(gl.MAX_DRAW_BUFFERS)}`)
    console.log(`Максимальное количество атрибутов вершин: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}`)
    console.log(`Максимальное количество текстур: ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}`)
  }
  return gl
}

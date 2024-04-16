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

/** Установка размера холста и области просмотра WebGL2.
 * @param {Object} options - Объект с параметрами
 * @param {WebGL2RenderingContext} options.gl - WebGL контекст.
 * @param {number} [options.width="100%"] - Ширина в пикселях (100% по умолчанию).
 * @param {number} [options.height="100%"] - Высота в пикселях (100% по умолчанию).
 * @param {number} [options.x=0] - Горизонтальное смещение (от левого нижнего угла холста).
 * @param {number} [options.y=0] - Вертикальное смещение (от левого нижнего угла холста).
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 */
export const setSize = ({ gl, width, height, x = 0, y = 0, debug = false }) => {
  const canvas = gl.canvas
  if (canvas instanceof OffscreenCanvas) throw new Error("Получен OffscreenCanvas")
  canvas.style.width = width ? width + "px" : "100%"
  canvas.style.height = height ? height + "px" : "100%"
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
  gl.viewport(x, y, canvas.clientWidth, canvas.clientHeight)
  if (debug) {
    console.log("============= РАЗМЕРЫ ОБЛАСТИ ПРОСМОТРА ===============")
    console.log("Установлен размер холста", canvas.clientWidth, "x", canvas.clientHeight)
    console.log("Установлено смещение области просмотра", x, "x", y)
    console.log("Установлен размер области просмотра", gl.drawingBufferWidth, "x", gl.drawingBufferHeight)
  }
}

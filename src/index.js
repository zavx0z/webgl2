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

/** Установка цвета фона области просмотра (viewport).
 * WebGL2 ожидает цвета в формате RGBA, с каждым компонентом между 0.0 и 1.0,
 * поэтому мы переводим переданный цвет из шестнадцатеричного формата в RGBA.
 *
 * Буфер цвета нужно очищать для избегания его переполнения
 * и обеспечения корректного отображения новых объектов на сцене.
 * @param {Object} options - Объект с параметрами
 * @param {WebGL2RenderingContext} options.gl - WebGL2 контекст.
 * @param {string} options.hex - Цвет в шестнадцатеричном формате, ожидается строка формата '#FFFFFF'.
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 */
export const setBackgroundColor = ({ gl, hex, debug }) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const alpha = 1.0
  gl.clearColor(r / 255, g / 255, b / 255, alpha)
  gl.clear(gl.COLOR_BUFFER_BIT)
  if (debug) {
    console.log("============= ЦВЕТ ФОНА ===============")
    console.log(`Цвет фона в шестнадцатеричном формате: ${hex}`)
    console.log(`Цвет фона в формате RGBA: ${r}, ${g}, ${b}, ${alpha}`)
    console.log(`Цвет фона в формате WebGL2: ${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}, ${alpha.toFixed(2)}`)
  }
}

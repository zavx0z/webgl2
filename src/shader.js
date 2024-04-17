/** Получает текст тега скрипта, который хранит код шейдера.
 * @param {Object} options - Объект с параметрами
 * @param {string} options.elemId - ID элемента скрипта
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 * @returns {string} Текст тега скрипта
 */
export const domShaderSrc = ({ elemId, debug }) => {
  const elem = document.getElementById(elemId)

  if (!elem) throw new Error("Элемент скрипта не найден.")
  if (!(elem instanceof HTMLScriptElement)) throw new Error("Элемент скрипта не является HTMLScriptElement.")
  if (elem.text === "") throw new Error("Текст скрипта пуст.")

  if (debug) console.log(`Текст шейдера получен из элемента <script/> с типом: ${elem.type}`)

  return elem.text
}

/** Создает шейдер заданного типа из исходного кода
 * @param {Object} options - Объект с параметрами
 * @param {WebGL2RenderingContext} options.gl - Контекст WebGL
 * @param {number} options.type - Тип шейдера (gl.VERTEX_SHADER или gl.FRAGMENT_SHADER)
 * @param {string} options.src - Исходный код шейдера
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 * @returns {WebGLShader} Созданный шейдер
 * @exception {Error} Ошибка компиляции шейдера
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader
 */
export const createShader = ({ gl, type, src, debug }) => {
  if (debug) {
    console.log(`============= ${type === gl.VERTEX_SHADER ? "VERTEX_SHADER" : "FRAGMENT_SHADER"} SHADER =============`)
    var startTime = performance.now()
  }

  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorInfo = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error("Ошибка компиляции шейдера: " + errorInfo)
  }

  if (debug) console.log(`Шейдер скомпилирован за ${performance.now() - startTime} мс.`)

  return shader
}

/** Связывает шейдеры вместе для создания шейдерной программы.
 * @param {Object} options - Объект с параметрами
 * @param {WebGL2RenderingContext} options.gl - Контекст WebGL2.
 * @param {WebGLShader} options.vertexShader - Вершинный шейдер.
 * @param {WebGLShader} options.fragmentShader - Фрагментный шейдер.
 * @param {boolean} [options.debug=false] - Выводить отладочную информацию
 * @returns {WebGLProgram} Программа шейдера.
 * @exception {Error} Ошибка создания программы
 */
export const createProgram = ({ gl, vertexShader, fragmentShader, debug }) => {
  if (debug) {
    console.log("======================= PROGRAM =======================")
    var startTime = performance.now()
  }

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorLog = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Ошибка связывания шейдерной программы: ${errorLog}`)
  }

  if (debug) console.log(`Шейдерная программа создана за ${performance.now() - startTime} мс.`)

  return program
}
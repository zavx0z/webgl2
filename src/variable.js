/** Получение позиции атрибута в шейдерной программе
 *
 * Когда осуществляется передача вершинного шейдера в WebGL, система анализирует его,
 * обнаруживает переменную-атрибут и выделяет область памяти для хранения ее значения.
 * Чтобы передать данные в переменную, находящуюся внутри шейдера,
 * необходимо запросить у системы WebGL местоположение этой переменной (ссылку на нее), вызвав метод `gl.getAttribLocation()`
 *
 * @param {Object} options - Параметры функции
 * @param {WebGL2RenderingContext} options.gl - Контекст WebGL2
 * @param {WebGLProgram} options.program - Объект программы, хранящий вершинный и фрагментный шейдеры
 * @param {string} options.name - Имя атрибута шейдера, ссылку на которую требуется получить (максимальная длина 256 символов по умолчанию)
 * @returns {number} Позиция атрибута в шейдерной программе
 */
export const getAttributeLocation = ({ gl, program, name }) => {
  const location = gl.getAttribLocation(program, name)

  const errorCode = gl.getError()
  if (errorCode === gl.INVALID_OPERATION)
    console.error("Ошибка INVALID_OPERATION: Объект программы program не был скомпонован")
  else if (errorCode === gl.INVALID_VALUE)
    console.error("Ошибка INVALID_VALUE: Длина имени name больше максимально возможной")

  if (location === -1)
    if (name.startsWith("gl_") || name.startsWith("webgl_"))
      console.error("Имя атрибута начинается с зарезервированного префикса gl_ или webgl_")
    else console.error(`Не найден атрибут ${name} в программе`, program)

  return location
}

/** Передача векторных значений для переменной-атрибута шейдера.
 * Принимает ссылку на переменную-атрибут и массив значений, которые будут установлены.
 * В зависимости от размера массива, используются различные варианты gl.vertexAttrib{1|2|3|4}fv.
 *
 * @param {Object} options - Параметры функции.
 * @param {WebGL2RenderingContext} options.gl - Контекст WebGL2.
 * @param {number} options.location - Позиция переменной-атрибута в шейдерной программе.
 * @param {Float32Array|number[]} options.vectors - Массив значений для переменной-атрибута.
 *        Размер массива должен соответствовать количеству компонентов для переменной-атрибута.
 * @returns {void}
 * @throws {Error} Если позиция атрибута недопустима или массив значений имеет неверный размер.
 */
export const setAttributeVector = ({ gl, location, vectors }) => {
  if (location < 0 || location >= gl.getParameter(gl.MAX_VERTEX_ATTRIBS))
    throw new Error(`Ссылка на переменную-атрибут location=${location} недопустима.`)

  if (vectors instanceof Float32Array || Array.isArray(vectors)) {
    if (vectors.length === 1) gl.vertexAttrib1fv(location, vectors)
    else if (vectors.length === 2) gl.vertexAttrib2fv(location, vectors)
    else if (vectors.length === 3) gl.vertexAttrib3fv(location, vectors)
    else if (vectors.length === 4) gl.vertexAttrib4fv(location, vectors)
    else throw new Error("Массив vectors имеет неверный размер. Допускаются размеры 1, 2, 3, 4.")
  } else throw new Error("Параметр vectors должен быть массивом чисел или экземпляром Float32Array.")
}

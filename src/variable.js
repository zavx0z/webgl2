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

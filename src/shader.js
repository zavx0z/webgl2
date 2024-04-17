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

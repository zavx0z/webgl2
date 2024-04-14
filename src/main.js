import { getCanvas, getContext } from "./index.js"
import { parseFont, readLocaTable } from "./lib/text/fontReader.js"
import { readGlyphData } from "./lib/text/glyfReader.js"
import { fetchBinaryData } from "./utils/loader.js"

const fontBuffer = await fetchBinaryData("static/JetBrainsMono-Bold.ttf")
const data = parseFont(fontBuffer)
console.log(data)
const locaTable = readLocaTable(fontBuffer, data.get("loca"))
// console.log(locaTable)
const glyfTable = data.get("glyf")
console.log(glyfTable)
const glyphPoints = readGlyphData(fontBuffer, glyfTable)
console.log(glyphPoints)

const canvas = getCanvas()
const gl = getContext({canvas})

// Определите минимальные и максимальные координаты,
// чтобы понять текущие границы глифа
let minX = Infinity
let maxX = -Infinity
let minY = Infinity
let maxY = -Infinity

// Итерация по точкам для определения границ
glyphPoints.forEach((point) => {
  minX = Math.min(minX, point[0])
  maxX = Math.max(maxX, point[0])
  minY = Math.min(minY, point[1])
  maxY = Math.max(maxY, point[1])
})

// Вычисление центра глифа и масштабирующего коэффициента, чтобы глиф уместился на холсте
const glyphWidth = maxX - minX
const glyphHeight = maxY - minY

// Вычисляем масштаб и позицию для шейдера, берем противоположные знаки для смещения
const scale = [(2 / glyphWidth) * 0.8, (-2 / glyphHeight) * 0.8]
const position = [(-1 - (2 * minX) / glyphWidth) * 0.8, (1 + (2 * minY) / glyphHeight) * 0.8]

// const vertices = new Float32Array(normalizedPoints.flat())
console.log(glyphPoints.flat())
const vertices = new Float32Array(glyphPoints.flat())

const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

// Настройка шейдеров
// Вершинный шейдер
const vertexShaderSource = `
attribute vec2 a_Position;
uniform vec2 u_scale;
uniform vec2 u_position;
void main() {
  gl_Position = vec4(a_Position * u_scale + u_position, 0.0, 1.0);
}
`
// Фрагментный шейдер
const fragmentShaderSource = `
precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Белый цвет
}
`

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initializeShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Ошибка связывания шейдерной программы: " + gl.getProgramInfoLog(shaderProgram))
    return null
  }
  return shaderProgram
}

// Создаем и инициализируем шейдерную программу
const shaderProgram = initializeShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

// Когда шейдерная программа создана и настроена, можно переходить к дальнейшим шагам рендеринга описанным выше.

// Привязываем буфер вершин к атрибуту шейдера
const positionAttribLocation = gl.getAttribLocation(shaderProgram, "a_Position")
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionAttribLocation)

// Настраиваем матрицу проекции и другие uniform, если необходимо
// Получаем ссылки на uniform переменные
const scaleLocation = gl.getUniformLocation(shaderProgram, "u_scale")
const positionLocation = gl.getUniformLocation(shaderProgram, "u_position")

// Рендерим точки
gl.useProgram(shaderProgram)

// Устанавливаем uniform переменные
gl.uniform2fv(scaleLocation, scale)
gl.uniform2fv(positionLocation, position)

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.drawArrays(gl.LINE_LOOP, 0, glyphPoints.length)

import configWebGLRenderingArea from "./viewport.js"
import { domShaderSrc, createShader, createProgram } from "./shader.js"
import { getAttributeLocation } from "./variable.js"

const gl = configWebGLRenderingArea({ background: "#1b2634", debug: true })

// Загрузка шейдеров из DOM
const vertexShaderTxt = domShaderSrc({ elemId: "vertex", debug: true })
const fragmentShaderTxt = domShaderSrc({ elemId: "fragment", debug: true })

// Компиляция шейдеров
const vertexShader = createShader({ gl, type: gl.VERTEX_SHADER, src: vertexShaderTxt, debug: true })
const fragmentShader = createShader({ gl, type: gl.FRAGMENT_SHADER, src: fragmentShaderTxt, debug: true })

// Создание программы и привязка шейдеров
const program = createProgram({ gl, vertexShader, fragmentShader, debug: true })
gl.useProgram(program)

// получение позиции атрибута в шейдерной программе
const a_Position = getAttributeLocation({ gl, program, name: "a_Position" })

const vertices = new Float32Array([0, 0])
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

// Настройка атрибутов вершин
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// Нарисовать точку
gl.drawArrays(gl.POINTS, 0, 1)

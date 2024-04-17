import configWebGLRenderingArea from "./viewport.js"
import { domShaderSrc, createShader, createProgram } from "./shader.js"

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

// Нарисовать точку
gl.drawArrays(gl.POINTS, 0, 1);
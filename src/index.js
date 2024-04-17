import configWebGLRenderingArea from "./viewport.js"
import { domShaderSrc, createShader, createProgram } from "./shader.js"
import { getAttributeLocation, setAttributeVector, setAttributeFloat } from "./variable.js"

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
// передача вектора в атрибут шейдера
setAttributeVector({ gl, location: a_Position, vectors: new Float32Array([-0.5, 0.5]) })

const a_PointSize = getAttributeLocation({ gl, program, name: "a_PointSize" })
// передача значений с плавающей точкой в атрибут шейдера
setAttributeFloat({ gl, location: a_PointSize, args: [44] })

// получение ссылки на uniform-переменную
const u_outColor = gl.getUniformLocation(program, "u_outColor");
// передача значений в uniform-переменную
gl.uniform4f(u_outColor, 0.529, 0.808, 0.922, 1.0);

// нарисовать точку
gl.drawArrays(gl.POINTS, 0, 1)

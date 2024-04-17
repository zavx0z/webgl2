import configWebGLRenderingArea from "./viewport.js"
import { domShaderSrc } from "./shader.js"

const gl = configWebGLRenderingArea({ background: "#1b2634", debug: true })

// Загрузка шейдеров из DOM
const vertexShaderTxt = domShaderSrc({ elemId: "vertex", debug: true })
const fragmentShaderTxt = domShaderSrc({ elemId: "fragment", debug: true })

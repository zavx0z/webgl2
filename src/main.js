import { loadFont, readTTFHeader } from "./lib/fontLoader.js"

const binaryData = await loadFont("static/JetBrainsMono-Bold.ttf")
const data = readTTFHeader(binaryData)
console.log(data)
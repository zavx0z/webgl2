import { parseFont, readLocaTable } from "./lib/fontReader.js"
import { readGlyphData } from "./lib/glyfReader.js"
import { fetchBinaryData } from "./utils/loader.js"

const fontBuffer = await fetchBinaryData("static/JetBrainsMono-Bold.ttf")
const data = parseFont(fontBuffer)
console.log(data)
const locaTable = readLocaTable(fontBuffer, data.get("loca"))
// console.log(locaTable)
const glyfTable = data.get("glyf")
console.log(glyfTable)
const glyphData = readGlyphData(fontBuffer, glyfTable)
// const glyphData = readGlyphData(new DataView(fontBuffer), { value: 0 }) // Считываем данные для первого глифа
// console.log(glyphData)
console.log(glyphData)
import TooltipReader from "@alt1/tooltip"
import { captureHold } from "@alt1/base"
import { findReadLine, ColortTriplet } from "@alt1/ocr"

require("!file-loader?name=[name].[ext]!./index.html")
require("!file-loader?name=[name].[ext]!./appconfig.json")

const output = document.getElementById("output")

const tr = new TooltipReader()
tr.farTooltip = true

function createCanvas(imageData, width, height) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  ctx.putImageData(imageData, 0, 0)
  document.getElementById("image").innerHTML = ""
  document.getElementById("image").appendChild(canvas)
}

const colors: ColortTriplet[] = [
  [238, 218, 178], // test
  [235, 224, 188], // ~white
  [0, 255, 255], // interactive scenery
  [248, 213, 107], // memb item
  [184, 209, 209], // nonmemb item
  [255, 255, 0] // npc
]

const font1 = require("@alt1/ocr/fonts/aa_8px_mono_allcaps.js")
const font2 = require("@alt1/ocr/fonts/aa_8px_mono_new.js")
const font3 = require("@alt1/ocr/fonts/aa_8px_mono_pof.js")
const font4 = require("@alt1/ocr/fonts/aa_8px_mono_pof2.js")
const font5 = require("@alt1/ocr/fonts/aa_8px_mono.js")
const font6 = require("@alt1/ocr/fonts/aa_8px_new.js")
const font7 = require("@alt1/ocr/fonts/pixel_8px_mono.js")
const font8 = require("./assets/tooltipfont.fontmeta.json")

tr.track((state) => {
  const { x, y, width, height } = state.area

  const image = captureHold(x, y + 18, width, height - 18)
  const data = image.toData()

  createCanvas(data, width, height)

  const text1 = findReadLine(data, font1, colors, width, height)
  const text2 = findReadLine(data, font2, colors, width, height)
  const text3 = findReadLine(data, font3, colors, width, height)
  const text4 = findReadLine(data, font4, colors, width, height)
  const text5 = findReadLine(data, font5, colors, width, height)
  const text6 = findReadLine(data, font6, colors, width, height)
  const text7 = findReadLine(data, font7, colors, width, height)
  const text8 = findReadLine(data, font8, colors, width, height)
  console.log(text1)
  console.log(text2)
  console.log(text3)
  console.log(text4)
  console.log(text5)
  console.log(text6)
  console.log(text7)
  console.log(text8)
}, 1000)

if (window.alt1) alt1.identifyAppUrl("./appconfig.json")

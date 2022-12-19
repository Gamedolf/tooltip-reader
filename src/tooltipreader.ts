import { capture, captureHoldFullRs, RectLike } from "@alt1/base"
import { ImgRef, ImageDetect } from "@alt1/base"
import { findReadLine } from "@alt1/ocr"

const font = require("./assets/tooltipfont.fontmeta.json")

const textcol: [number, number, number] = [238, 218, 178]

const imgs = ImageDetect.webpackImages({
  topLeft: require("./assets/top-left.data.png"),
  topRight: require("./assets/top-right.data.png"),
  bottomLeft: require("./assets/bottom-left.data.png"),
  bottomRight: require("./assets/bottom-right.data.png")
})

export default class TooltipReader {
  pos: RectLike | null = null

  find(img?: ImgRef) {
    console.log("find")
    if (!img) img = captureHoldFullRs()
    const topLeft = img.findSubimage(imgs.topLeft)
    const topRight = img.findSubimage(imgs.topRight)
    const bottomLeft = img.findSubimage(imgs.bottomLeft)
    const bottomRight = img.findSubimage(imgs.bottomRight)
    console.log("topLeft", topLeft)
    console.log("topRight", topRight)
    console.log("bottomLeft", bottomLeft)
    console.log("bottomRight", bottomRight)
    if (!topLeft.length || !topRight.length || !bottomLeft.length || !bottomRight.length) return null
    if (topLeft.length > 1 || topRight.length > 1 || bottomLeft.length > 1 || bottomRight.length > 1) {
      console.log("Multiple tooltips found")
    }

    const width = topRight[0].x - topLeft[0].x - imgs.topLeft.width
    const height = bottomRight[0].y - topRight[0].y - imgs.topRight.height

    this.pos = {
      x: topLeft[0].x + imgs.topLeft.width,
      y: topLeft[0].y,
      width,
      height
    }

    return this.pos
  }

  read(img?: ImgRef) {
    console.log("read")
    if (!this.pos) return null
    let buf: ImageData
    if (!img) buf = capture(this.pos)
    else buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height)
    console.log("buf", buf)
    const text = findReadLine(buf, font, [textcol], Math.round(this.pos.width / 2), Math.round(this.pos.height / 2))

    return text ?? null
  }
}

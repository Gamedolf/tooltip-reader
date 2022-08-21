import * as a1lib from "@alt1/base"
import { ImgRef, ImageDetect } from "@alt1/base"
import * as OCR from "@alt1/ocr"

const font = require("./assets/tooltipfont.fontmeta.json")

const textcol:[number,number,number] = [238,218,178]

const imgs = ImageDetect.webpackImages({
    topLeft: require("./assets/top-left.png"),
    topRight: require("./assets/top-right.png"),
    bottomLeft: require("./assets/bottom-left.png"),
    bottomRight: require("./assets/bottom-right.png"),
})

export default class TooltipReader {
    pos: a1lib.RectLike | null = null;

    find(img?: ImgRef) {
        console.log("find")
        if (!img) { img = a1lib.captureHoldFullRs() }

        const topLeft = img.findSubimage(imgs.topLeft)
        const topRight = img.findSubimage(imgs.topRight)
        const bottomLeft = img.findSubimage(imgs.bottomLeft)
        const bottomRight = img.findSubimage(imgs.bottomRight)
        if (!topLeft.length || !topRight.length || !bottomLeft.length || !bottomRight.length) return null
        if (topLeft.length > 0 || topRight.length > 0 || bottomLeft.length > 0 || bottomRight.length > 0) {
            console.log("Multiple tooltips found")
        }

        const width = topRight[0].x - topLeft[0].x - imgs.topLeft.width
        const height = bottomRight[0].y - topRight[0].y - imgs.topRight.height

        this.pos = {
            x: topLeft[0].x + imgs.topLeft.width,
            y: topLeft[0].y,
            width,
            height,
        }

        return this.pos
    }

    read(img?: ImgRef) {
        console.log("read")
        if (!this.pos) return null
        let buf: ImageData
        if (!img) buf = a1lib.capture(this.pos)
        else buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height)
        const text = OCR.findReadLine(buf, font, [textcol], Math.round(this.pos.width/2), Math.round(this.pos.height/2))

        return text ?? null
    }
}

import * as a1lib from "@alt1/base"
import TooltipReader from "./tooltipreader";

require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

const output = document.getElementById("output");

const reader = new TooltipReader()

export function capture() {
    const img = a1lib.captureHoldFullRs()
    if (!reader.pos) reader.find(img)
    const text = reader.read(img)
    output.innerHTML = `<div>${text}</div>`
}

const interval = setInterval(() => {
    capture()
}, 1000)

if (window.alt1) alt1.identifyAppUrl("./appconfig.json")

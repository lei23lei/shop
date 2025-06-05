var IS_PRE = window.NEW_DETAIL_ENV === "pre";
var VERSION = IS_PRE ? "0.0.16" : "0.0.71";
var ASSET_VERSION = "cover_" + VERSION;
var ASSET_PATH = "//".concat(IS_PRE ? "dev." : "", "g.alicdn.com/tbpc/pc-detail-2024/").concat(VERSION, "/");

function loadCssFile(url, id) {
    var ele = null;
    (ele = document.getElementById(id));
    if (!ele) {
        ele = document.createElement("link");
        (ele.id = id);
        ele.rel = "stylesheet";
        document.head.appendChild(ele);
    }
    ele.href = url;
}
function loadJsFile(url, id) {
    var ele = null;
    (ele = document.getElementById(id));
    if (!ele) {
        ele = document.createElement("script");
        (ele.id = id);
        ele.charset = "utf-8";
        ele.crossorigin = "anonymous";
        document.body.appendChild(ele);
    }
    ele.src = url;
}

window.__ASSET_VERSION = ASSET_VERSION;
window.__ASSET_PATH__ = ASSET_PATH;
loadCssFile(window.__ASSET_PATH__ + "css/main.css", "mainCss");
loadJsFile(window.__ASSET_PATH__ + "js/main.js", "mainJs");

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallpaperFlare = void 0;
const ax = require("axios");
const node_html_parser_1 = require("node-html-parser");
const puppeteer_1 = require("puppeteer");
const axios = ax.default;
let browser;
class WallpaperFlare {
    static get BASE() { return "https://www.wallpaperflare.com"; }
    ;
    static async getAllWallpapersByTag(TAG) {
        let arr = [];
        let page = await this.getFirstPageWallpapersByTag(TAG);
        let i = 1;
        while (page != null) {
            arr = arr.concat(page);
            i++;
            page = await this.getPageWallpapersByTag(TAG, i);
        }
        return arr;
    }
    static async getFirstPageWallpapersByTag(TAG) {
        const html = node_html_parser_1.parse((await axios.get(this.BASE + "/search?wallpaper=" + encodeURI(TAG.replaceAll(" ", "+")))).data);
        const arr = [];
        for (let e of html.querySelectorAll("a[itemprop='url']")) {
            arr.push(e["_attrs"].href);
        }
        return arr;
    }
    static async getPageWallpapersByTag(TAG, page) {
        if (page == 1)
            return this.getFirstPageWallpapersByTag(TAG);
        let html;
        try {
            html = node_html_parser_1.parse((await axios.get(this.BASE + "/search?page=" + page + "&wallpaper=" + encodeURI(TAG.replaceAll(" ", "+")))).data);
        }
        catch (e) {
            return null;
        }
        const arr = [];
        for (let e of html.querySelectorAll("a[itemprop='url']")) {
            arr.push(e["_attrs"].href);
        }
        return arr;
    }
    static async getImageByURL(URL) {
        let page;
        let args = [];
        if (process.platform != "win32")
            args.push("--no-sandbox");
        if (browser == undefined)
            browser = await puppeteer_1.launch({ headless: true, args: args });
        page = await browser.newPage();
        await page.goto(URL + (URL.endsWith("/crop") ? "" : "/crop"), { waitUntil: "networkidle0" });
        const url = await page.evaluate((sel) => {
            return document.querySelector(sel).getAttribute('src');
        }, "img#resize");
        await page.close();
        return url;
    }
    static async downloadImage(URL) {
        return (await axios.get(URL, { responseType: "arraybuffer" })).data;
    }
    static async finish() {
        if (browser != undefined)
            await browser.close();
    }
}
exports.WallpaperFlare = WallpaperFlare;

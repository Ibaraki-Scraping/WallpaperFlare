import * as ax from "axios";
import { parse, HTMLElement } from "node-html-parser";
import { Browser, Page, launch } from "puppeteer";

const axios = ax.default;

let browser: Browser;

export class WallpaperFlare {
    public static get BASE() {return "https://www.wallpaperflare.com"};

    public static async getAllWallpapersByTag(TAG: string): Promise<Array<String>> {
        let arr: Array<string> = [];

        let page = await this.getFirstPageWallpapersByTag(TAG);
        let i = 1;
        while (page != null) {
            arr = arr.concat(page);
            i++;
            page = await this.getPageWallpapersByTag(TAG, i);
        }

        return arr;
    }

    public static async getFirstPageWallpapersByTag(TAG: string): Promise<Array<string>> {
        const html = parse((await axios.get(this.BASE + "/search?wallpaper=" + encodeURI(TAG.replaceAll(" ", "+")))).data);

        const arr: Array<string> = [];

        for (let e of html.querySelectorAll("a[itemprop='url']")) {
            arr.push(e["_attrs"].href);
        }

        return arr;
    }

    public static async getPageWallpapersByTag(TAG: string, page: number): Promise<Array<string>> {
        if (page == 1) return this.getFirstPageWallpapersByTag(TAG);
        let html: HTMLElement;
            
        try {
            html = parse((await axios.get(this.BASE + "/search?page=" + page + "&wallpaper=" + encodeURI(TAG.replaceAll(" ", "+")))).data);
        } catch (e) {
            return null;
        }

        const arr: Array<string> = [];

        for (let e of html.querySelectorAll("a[itemprop='url']")) {
            arr.push(e["_attrs"].href);
        }

        return arr;
    }

    public static async getImageByURL(URL: string): Promise<string> {
        
        let page: Page;
        let args = [];
        if (process.platform != "win32") args.push("--no-sandbox");
        if (browser == undefined) browser = await launch({headless: true, args: args});
        page = await browser.newPage();
        await page.goto(URL + (URL.endsWith("/crop") ? "" : "/crop"), {waitUntil: "networkidle0"});

        const url = await page.evaluate((sel) => {
            return document.querySelector(sel).getAttribute('src');
        }, "img#resize");

        await page.close();

        return url;
    }

    public static async downloadImage(URL: string): Promise<Buffer> {
        return (await axios.get(URL, {responseType: "arraybuffer"})).data;
    }

    public static async finish(): Promise<void> {
        if (browser != undefined) await browser.close();
    }
}
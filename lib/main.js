"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const WallpaperFlare_1 = require("./WallpaperFlare");
(async () => {
    //console.log((await WallpaperFlare.getAllWallpapersByTag("Fate Series")).length)
    const URL = await WallpaperFlare_1.WallpaperFlare.getImageByURL("https://www.wallpaperflare.com/fate-series-fate-grand-order-altera-fate-grand-order-arjuna-fate-series-wallpaper-ynyvq/crop");
    console.log(URL);
    fs_1.writeFileSync("./test.jpg", await WallpaperFlare_1.WallpaperFlare.downloadImage(URL));
    await WallpaperFlare_1.WallpaperFlare.finish();
})();

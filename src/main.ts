import { writeFileSync } from "fs";
import { WallpaperFlare } from "./WallpaperFlare";

(async () => {
    //console.log((await WallpaperFlare.getAllWallpapersByTag("Fate Series")).length)
    const URL = await WallpaperFlare.getImageByURL("https://www.wallpaperflare.com/fate-series-fate-grand-order-altera-fate-grand-order-arjuna-fate-series-wallpaper-ynyvq/crop");
    console.log(URL);
    writeFileSync("./test.jpg", await WallpaperFlare.downloadImage(URL));
    await WallpaperFlare.finish();
})();
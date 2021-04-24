/// <reference types="node" />
export declare class WallpaperFlare {
    static get BASE(): string;
    static getAllWallpapersByTag(TAG: string): Promise<Array<String>>;
    static getFirstPageWallpapersByTag(TAG: string): Promise<Array<string>>;
    static getPageWallpapersByTag(TAG: string, page: number): Promise<Array<string>>;
    static getImageByURL(URL: string): Promise<string>;
    static downloadImage(URL: string): Promise<Buffer>;
    static finish(): Promise<void>;
}

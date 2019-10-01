const fs = require('fs');
const PNG = require('pngjs').PNG;
const sharp = require('sharp');
const pixelmatch = require('pixelmatch');

export const buildSpritesheetDictionary = async (path, options) => {
    let regex40 = new RegExp('.*-40_.*\.png', 'g');
    let regex32 = new RegExp('.*-32_.*\.webp', 'g');
    let regex64 = new RegExp('.*-64_.*\.webp', 'g');
    let files40 = fs.readdirSync(path).filter(x => x.match(regex40));
    let files32 = options.size32 ? fs.readdirSync(path).filter(x => x.match(regex32)) : [];
    let files64 = options.size64 ? fs.readdirSync(path).filter(x => x.match(regex64)) : [];
    let spritesheetDictionary = {};
    for(let i = 0; i <= 101; i++){
        let substring = 'emoji-'+i+'-';
        let subfiles40 = files40.filter(x => x.startsWith(substring));
        let subfiles32 = options.size32 ? files32.filter(x => x.startsWith(substring)) : [];
        let subfiles64 = options.size64 ? files64.filter(x => x.startsWith(substring)) : [];
        spritesheetDictionary[subfiles40[0]] = {};
        //there's only 1 spritesheet101. this might change in the future.
        if(i == 101){
            if(options.size32){
                spritesheetDictionary[subfiles40[0]].size32 = subfiles32[0];
            }
            if(options.size64){
                spritesheetDictionary[subfiles40[0]].size64 = subfiles64[0];
            }
            break;
        }
        spritesheetDictionary[subfiles40[1]] = {};
        let png1 = await sharp(path+'\\'+subfiles40[0]).resize(200, 200).png().toBuffer();
        let png2 = await sharp(path+'\\'+subfiles40[1]).resize(200, 200).png().toBuffer();
        let webp32 = options.size32 ? await sharp(path+'\\'+subfiles32[0]).resize(200, 200).png().toBuffer() : {};
        let webp64 = options.size64 ? await sharp(path+'\\'+subfiles64[0]).resize(200, 200).png().toBuffer() : {};
        //pixelmatch doesn't like the buffer produced by sharp, but plays well with PNGjs
        let png1again = PNG.sync.read(png1);
        let png2again = PNG.sync.read(png2);
        let webp32again =  options.size32 ? PNG.sync.read(webp32) : {};
        let webp64again =  options.size64 ? PNG.sync.read(webp64) : {};
        if(options.size32) {
            let mismatch1 = pixelmatch(png1again.data, webp32again.data, null, 200, 200);
            let mismatch2 = pixelmatch(png2again.data, webp32again.data, null, 200, 200);
            if(mismatch1 > mismatch2){
                spritesheetDictionary[subfiles40[0]].size32 = subfiles32[1];
                spritesheetDictionary[subfiles40[1]].size32 = subfiles32[0];
            } else {
                spritesheetDictionary[subfiles40[0]].size32 = subfiles32[0];
                spritesheetDictionary[subfiles40[1]].size32 = subfiles32[1];
            }
        }
        if(options.size64) {
            let mismatch1 = pixelmatch(png1again.data, webp64again.data, null, 200, 200);
            let mismatch2 = pixelmatch(png2again.data, webp64again.data, null, 200, 200);
            if(mismatch1 > mismatch2){
                spritesheetDictionary[subfiles40[0]].size64 = subfiles64[1];
                spritesheetDictionary[subfiles40[1]].size64 = subfiles64[0];
            } else {
                spritesheetDictionary[subfiles40[0]].size64 = subfiles64[0];
                spritesheetDictionary[subfiles40[1]].size64 = subfiles64[1];
            }
        }
    }
    return spritesheetDictionary;
}
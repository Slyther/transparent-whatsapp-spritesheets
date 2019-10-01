const fs = require('fs');
const sharp = require('sharp');
import { buildSpritesheetDictionary } from './comparer';
export const createTransparentSpritesheets = async (inputPath, outputPath = inputPath) => {
    let regex = new RegExp('.*-40_.*\.png', 'g');
    let files = fs.readdirSync(inputPath).filter(x => x.match(regex));
    let spritesheetDictionary = await buildSpritesheetDictionary(inputPath);
    files.forEach(async file => {
        let img = sharp(inputPath+'\\'+file);
        let metadata = await img.metadata();
        let emojis32 = [];
        let emojis64 = [];
        let rows = metadata.width/40;
        let columns = metadata.height/40;
        for(let i = 0; i < columns; i ++){
            for(let j = 0; j < rows; j ++){
                let posx = j*40;
                let posy = i*40;
                let buffer = await img.extract({left: posx, top: posy, width: 40, height: 40}).png().toBuffer();
                let img32 = await sharp(buffer).resize(32, 32).png().toBuffer();
                let img64 = await sharp(buffer).resize(64, 64).png().toBuffer();
                emojis32.push({input: img32, top: (i*32)+(i*3), left: (j*32)+(j*3)});
                emojis64.push({input: img64, top: (i*64)+(i*6), left: (j*64)+(j*6)});
            }
        }
        let canvas32 = sharp({
            create: {
                width: (rows*32)+((rows-1)*3),
                height: (columns*32)+((columns-1)*3),
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });
        let canvas64 = sharp({
            create: {
                width: (rows*64)+((rows-1)*6),
                height: (columns*64)+((columns-1)*6),
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });
        canvas32.composite(emojis32).webp().toFile(outputPath+'\\'+spritesheetDictionary[file].size32);
        canvas64.composite(emojis64).webp().toFile(outputPath+'\\'+spritesheetDictionary[file].size64);
    });
}

// createTransparentSpritesheets('F:\\WADark-Windows\\backup\\dest\\img', 'F:\\WADark-Windows\\backup\\dest\\computed');
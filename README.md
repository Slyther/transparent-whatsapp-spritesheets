# Transparent Whatsapp Spritesheets

This little module grabs the existing Size 40 PNG spritesheets in the Whatsapp img resource folder, and creates Size 32 and Size 64 WEBP spritesheets with transparent backgrounds, replacing the existing spritesheets with white backgrounds.

It is assumed that you're working with the extracted .asar file and have access to the img folder within it. This won't do that work for you.

## Usage

```javascript
const tws = require('transparent-whatsapp-spritesheets');
```

### Call

```javascript
tws.createTransparentSpritesheets(inputPath[, options, outputPath]);
```

- `inputPath` — The path where the whatsapp spritesheets are found. The Size 40 PNG spritesheets (named 'emoji-x-40_....png') need to be here for the method to work.

- `options` — An object which holds two booleans: `size32` and `size64`. Used to tell the method which spritesheet versions to create. By default, both booleans are set to `true`.

- `outputPath` — An optional path where resulting spritesheets will be placed, in case you don't want to replace the existing WEBP spritesheets. Directory must exist, it will not be created.
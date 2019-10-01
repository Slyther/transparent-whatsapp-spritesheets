# Transparent Whatsapp Spritesheets

This little module grabs the existing Size 40 PNG spritesheets in the Whatsapp img resource folder, and creates Size 32 and Size 64 WEBP spritesheets with transparent backgrounds, replacing the existing spritesheets with white backgrounds.

## Usage

```javascript
const tws = require('transparent-whatsapp-spritesheets');
```

### Call
The module expects either a single path which should point to the directory with the PNG Size 40 Spritesheets, or the spritesheets path as well as a destination directory, in case you don't want to replace the existing WEBP spritesheets.


```javascript
tws.createTransparentSpritesheets('path/to/img_folder', 'path/to/dest');
```
(async () => {const fs = require('fs');
const path = require('path');

function walk(dir) {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return reject(err);

      var pending = list.length;

      if (!pending) return resolve(results);

      list.forEach(function(file) {
        const filepath = path.resolve(dir, file);

        fs.stat(filepath, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(filepath).then((res) => {
              results = results.concat(res);
              if (!--pending) resolve(results);
            });
          } else {
            results.push(filepath);
            if (!--pending) resolve(results);
          }
        });
      });
    });
  });
};

const assetPath = __dirname

const sharedAssetPath = path.resolve(assetPath, 'shared');
const sharedAssets = (await walk(sharedAssetPath)
  .catch((err) => {
    console.error('Error walking directory:', err);
    return [];
  }))
  .map((asset) => ({
    name: path.relative(sharedAssetPath, asset),
    url: `/shared/${path.relative(sharedAssetPath, asset)}`
  }));

const teamAssetPath = path.resolve(assetPath, 'team')
const teamAssets = (await walk(teamAssetPath)
  .catch((err) => {
    console.error('Error walking directory:', err);
    return [];
  }))
  .map((asset) => {
    if (path.extname(asset) === '.webp') {
      // get image size
      const size = require('image-size')(asset);
      return {
        name: path.relative(teamAssetPath, asset),
        url: `/team/${path.relative(teamAssetPath, asset)}`,
        width: size.width,
        height: size.height
      }
    } 

    return {
      name: path.relative(teamAssetPath, asset),
      url: `/team/${path.relative(teamAssetPath, asset)}`
    }
  });

const boardAssetPath = path.resolve(assetPath, 'board')
const boardAssets = (await walk(boardAssetPath)
  .catch((err) => {
    console.error('Error walking directory:', err);
    return [];
  }))
  .map((asset) => ({
    name: path.relative(boardAssetPath, asset),
    url: `/board/${path.relative(boardAssetPath, asset)}`
  }));

const allAssets = sharedAssets.concat(teamAssets).concat(boardAssets);

fs.writeFile(path.resolve(assetPath, 'assets.json'), JSON.stringify(allAssets, null, 2), (err) => {
  if (err) {
    console.error('Error writing assets:', err);
  } else {
    console.log('Assets written to assets.json');
  }
});
})()
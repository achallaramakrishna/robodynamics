const fsPlain = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fsPlain.existsSync(targetFolder)) {
    fsPlain.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fsPlain.lstatSync(source).isDirectory()) {
    files = fsPlain.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fsPlain.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fsPlain.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}

function copyContentsOnly(source, target) {
  if (!fsPlain.existsSync(target)) {
    fsPlain.mkdirSync(target, { recursive: true });
  }
  const files = fsPlain.readdirSync(source);
  files.forEach(function (file) {
    var curSource = path.join(source, file);
    if (fsPlain.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, target);
    } else {
      fsPlain.copyFileSync(curSource, path.join(target, file));
    }
  });
}

const baseDir = 'C:\\roboworkspace\\robodynamics\\ai-tutor\\web';
const staticSrc = path.join(baseDir, '.next', 'static');
const staticDst = path.join(baseDir, '.next', 'standalone', '.next', 'static');

const publicSrc = path.join(baseDir, 'public');
const publicDst = path.join(baseDir, '.next', 'standalone', 'public');

console.log('Copying static files from:', staticSrc, 'to:', staticDst);
copyContentsOnly(staticSrc, staticDst);

console.log('Copying public files from:', publicSrc, 'to standalone...');
copyFolderRecursiveSync(publicSrc, path.join(baseDir, '.next', 'standalone'));

console.log('Done copying everything perfectly!');

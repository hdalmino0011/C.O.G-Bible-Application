const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();

// Ensure public/data exists and contains all JSON files from data/
const sourceDir = path.join(projectRoot, 'data');
const publicDir = path.join(projectRoot, 'public/data');
if (fs.existsSync(sourceDir)) {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const sourceFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.json'));
  for (const file of sourceFiles) {
    const destFile = path.join(publicDir, file);
    if (!fs.existsSync(destFile)) {
      fs.copyFileSync(path.join(sourceDir, file), destFile);
    }
  }
}

// Ensure icons, logos, and fallback files exist in public/
const staticFiles = [
  'app-icon-192.png',
  'app-icon-maskable.png',
  'app-icon.png',
  '404.html',
  '.nojekyll'
];
for (const sf of staticFiles) {
  const rootSrc = path.join(projectRoot, sf);
  const pubDest = path.join(projectRoot, 'public', sf);
  if (fs.existsSync(rootSrc) && !fs.existsSync(pubDest)) {
    fs.copyFileSync(rootSrc, pubDest);
  }
}

const logoJpgDoc = path.join(projectRoot, 'docs/logo.jpg');
const logoJpgPub = path.join(projectRoot, 'public/logo.jpg');
const logoPngPub = path.join(projectRoot, 'public/logo.png');

if (fs.existsSync(logoJpgDoc)) {
  if (!fs.existsSync(logoJpgPub)) fs.copyFileSync(logoJpgDoc, logoJpgPub);
  if (!fs.existsSync(logoPngPub)) fs.copyFileSync(logoJpgDoc, logoPngPub);
} else if (fs.existsSync(path.join(projectRoot, 'app-icon.png')) && !fs.existsSync(logoPngPub)) {
  fs.copyFileSync(path.join(projectRoot, 'app-icon.png'), logoPngPub);
}

const dataDirectories = ['data', 'public/data'];
const expectedBookCount = 66;
const errors = [];

function validateDirectory(relativeDirectory) {
  const directory = path.join(projectRoot, relativeDirectory);
  if (!fs.existsSync(directory)) {
    errors.push(relativeDirectory + ' is missing');
    return new Set();
  }

  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.json')).sort();
  if (files.length !== expectedBookCount) {
    errors.push(relativeDirectory + ' contains ' + files.length + ' JSON books; expected ' + expectedBookCount);
  }

  for (const file of files) {
    const filePath = path.join(directory, file);
    try {
      const book = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!book || typeof book !== 'object' || Array.isArray(book) || Object.keys(book).length === 0) {
        errors.push(relativeDirectory + '/' + file + ' is not a chapter object');
        continue;
      }
      for (const [chapter, verses] of Object.entries(book)) {
        if (!Array.isArray(verses) || verses.length === 0) {
          errors.push(relativeDirectory + '/' + file + ' chapter ' + chapter + ' has no verses');
          continue;
        }
        for (let index = 0; index < verses.length; index += 1) {
          const verse = verses[index];
          if (!verse || !Number.isInteger(verse.v) || typeof verse.en !== 'string' || typeof verse.ceb !== 'string') {
            errors.push(relativeDirectory + '/' + file + ' chapter ' + chapter + ' verse ' + (index + 1) + ' has an invalid shape');
            break;
          }
        }
      }
    } catch (error) {
      errors.push(relativeDirectory + '/' + file + ' is invalid JSON: ' + error.message);
    }
  }

  return new Set(files);
}

const directoryFiles = dataDirectories.map(validateDirectory);
if (directoryFiles[0].size !== directoryFiles[1].size || [...directoryFiles[0]].some((file) => !directoryFiles[1].has(file))) {
  errors.push('data and public/data do not contain the same book files');
}

if (errors.length > 0) {
  console.error('Bible data validation failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}

console.log('Bible data validated: 66 books in data and public/data.');

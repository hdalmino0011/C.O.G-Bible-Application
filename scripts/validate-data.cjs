const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
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

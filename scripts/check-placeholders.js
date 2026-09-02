/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../src/config');
const filesToCheck = ['questions.config.json', 'scoring.config.json', 'results.config.json'];

let foundPlaceholders = [];

for (const file of filesToCheck) {
  const filePath = path.join(configDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.toLowerCase().includes('placeholder')) {
      foundPlaceholders.push(file);
    }
  }
}

if (foundPlaceholders.length > 0) {
  const message = `Found 'PLACEHOLDER' string in the following config files: ${foundPlaceholders.join(', ')}`;
  
  if (process.env.NODE_ENV === 'production') {
    console.error(`ERROR: ${message}`);
    console.error('Build failed due to unresolved placeholders in production.');
    process.exit(1);
  } else {
    console.warn(`WARNING: ${message}`);
    process.exit(0);
  }
} else {
  console.log('Success: No placeholders found in config files.');
  process.exit(0);
}

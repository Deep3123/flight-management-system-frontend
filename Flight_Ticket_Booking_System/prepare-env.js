const fs = require('fs');
require('dotenv').config(); // For local development

// Read the template file
const template = fs.readFileSync('./src/environments/environment.prod.template.ts', 'utf8');

// Replace placeholders with environment variables or default values
const output = template
    .replace('${ENCRYPTION_SECRET_KEY}', process.env.ENCRYPTION_SECRET_KEY || 'x2B7eTf93mQ9cGzYdFk7pLm8XsRjHtNv')
    .replace('${ENCRYPTION_IV}', process.env.ENCRYPTION_IV || '7fH1d9Lm3cQ5x7Vz  ');

// Make sure the environments directory exists
if (!fs.existsSync('./src/environments')) {
    fs.mkdirSync('./src/environments', { recursive: true });
}

// Write to the actual environment file
fs.writeFileSync('./src/environments/environment.prod.ts', output);

console.log('Production environment file created');
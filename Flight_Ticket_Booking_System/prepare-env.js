const fs = require('fs');
require('dotenv').config(); // For local development

// Read the template file
const prodTemplate = fs.readFileSync('./src/environments/environment.prod.template.ts', 'utf8');

// Get environment variables
const secretKey = process.env.ENCRYPTION_SECRET_KEY || '';
const iv = process.env.ENCRYPTION_IV || '';

if (!secretKey || !iv) {
    console.warn('Warning: One or more encryption environment variables are not set.');
}

// Replace placeholders with environment variables
const prodOutput = prodTemplate
    .replace('${ENCRYPTION_SECRET_KEY}', secretKey)
    .replace('${ENCRYPTION_IV}', iv);

// Make sure the environments directory exists
if (!fs.existsSync('./src/environments')) {
    fs.mkdirSync('./src/environments', { recursive: true });
}

// Write to the production environment file only
fs.writeFileSync('./src/environments/environment.prod.ts', prodOutput);

console.log('Production environment file created successfully');
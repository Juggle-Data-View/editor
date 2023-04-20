// Description: Checks if the .env file not exists, prints an error message and exits the process

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

const checkENV = () => {

  if (!fs.existsSync(envPath)) {
    console.error(` Error: .env file not found in ${envPath} `);
    process.exit(1);
  }
}

module.exports = checkENV;
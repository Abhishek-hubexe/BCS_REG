import fs from 'fs';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'server', 'bcs_data.json');

async function migrate() {
  if (!fs.existsSync(jsonPath)) {
    console.log('No bcs_data.json found.');
    return;
  }
  
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);
  let updated = 0;

  for (const user of data.users) {
    if (user.password && !user.password.startsWith('$2b$')) {
      // It's a plain text password, hash it
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      updated++;
    }
  }

  if (updated > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Migrated ${updated} user passwords to bcrypt.`);
  } else {
    console.log('No plain text passwords found to migrate.');
  }
}

migrate().catch(console.error);

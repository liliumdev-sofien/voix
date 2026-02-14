import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function test() {
  try {
    console.log('Testing /generation endpoint...');
    const response = await axios.post('http://localhost:3000/generation', { text: 'Test Node' }, { responseType: 'stream' });
    
    const writer = fs.createWriteStream(path.join(__dirname, 'test_node.wav'));
    response.data.pipe(writer);
    
    writer.on('finish', () => {
      console.log('Success: test_node.wav created');
      process.exit(0);
    });
    
    writer.on('error', (err) => {
        console.error('File write error:', err);
        process.exit(1);
    });

  } catch (e) {
    if (e.response) {
        console.error('API Error:', e.response.status, e.response.statusText);
        e.response.data.pipe(process.stderr);
    } else {
        console.error('Network/Client Error:', e.message);
    }
    process.exit(1);
  }
}
test();

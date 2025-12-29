import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When built to ./dist/index.js, the dictionary files are one level up in root.
export default {
    aff: path.join(__dirname, '../th_TH.aff'),
    dic: path.join(__dirname, '../th_TH.dic')
};

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    aff: path.join(__dirname, 'th_TH.aff'),
    dic: path.join(__dirname, 'th_TH.dic'),
};

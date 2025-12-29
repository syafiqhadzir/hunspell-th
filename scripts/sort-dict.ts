import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIC_PATH = path.join(__dirname, '../th_TH.dic');

try {
    console.log('Reading dictionary...');
    const content = fs.readFileSync(DIC_PATH, 'utf8');

    // Split into lines
    let lines = content.split(/\r?\n/);

    // Remove empty lines
    lines = lines.filter(line => line.trim() !== '');

    // Extract word count (first line)
    // Sometimes the first line is purely a number, sometimes it might be corrupted.
    // We will recalculate it anyway, but let's try to identify if the first line is the count.
    // We will recalculate it anyway, but let's try to identify if the first line is the count.
    const originalCount = Number.parseInt(lines[0], 10);
    let words: string[] = [];

    if (!isNaN(originalCount)) {
        words = lines.slice(1);
    } else {
        // If the first line is not a number, treat it as a word
        words = lines;
    }

    console.log(`Original word count: ${words.length}`);

    // Deduplicate
    const uniqueWords = [...new Set(words)];
    console.log(`Unique word count: ${uniqueWords.length}`);

    // Sort using Thai locale
    uniqueWords.sort((a, b) => a.localeCompare(b, 'th'));

    // Reconstruct file content
    const newContent = `${uniqueWords.length}\n${uniqueWords.join('\n')}\n`;

    fs.writeFileSync(DIC_PATH, newContent, 'utf8');
    console.log('Dictionary sorted and saved successfully.');

} catch (error) {
    console.error('Error sorting dictionary:', error);
    process.exit(1);
}

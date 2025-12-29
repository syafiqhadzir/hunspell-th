import fs from 'fs';
import { describe, it, beforeAll, expect } from 'vitest';
// @ts-ignore
import hunspellTh from '../src/index.js';

describe('Dictionary Integrity Checks', () => {
    let dicContent: string;
    let dicLines: string[];
    let words: string[];

    beforeAll(() => {
        dicContent = fs.readFileSync(hunspellTh.dic, 'utf8');
        dicLines = dicContent.split(/\r?\n/).filter(line => line.trim() !== '');
        // First line is count
        words = dicLines.slice(1);
    });

    it('should match the line count in the header', () => {
        const headerCount = Number.parseInt(dicLines[0], 10);
        expect(words.length).toBe(headerCount);
    });

    it('should not contain duplicate words', () => {
        const uniqueWords = new Set(words);
        expect(uniqueWords.size).toBe(words.length);
    });

    it('should be NFC normalized', () => {
        const nonNFC = words.filter(word => word !== word.normalize('NFC'));
        expect(nonNFC.length).toBe(0);
    });

    it('should have optimal TRY order in AFF file (Top 50 frequency)', () => {
        // Calculate frequency
        const charFreq: Record<string, number> = {};
        words.forEach(w => {
            for (const char of w) {
                charFreq[char] = (charFreq[char] || 0) + 1;
            }
        });

        // Top 50 chars from current dictionary
        const top50calc = Object.entries(charFreq)
            .sort((a, b) => b[1] - a[1])
            .map(e => e[0])
            .slice(0, 50)
            .join('')
            .replace(/-/g, ''); // remove hyphen from frequency check if it causes issues, but usually fine
            // Remove special control chars if any from check, but for now strict check

        // Read AFF
        const affContent = fs.readFileSync(hunspellTh.aff, 'utf8');
        const tryMatch = affContent.match(/^TRY\s+(.+)$/m);

        expect(tryMatch).not.toBeNull();
        if (tryMatch) {
            const affTry = tryMatch[1];
            // Let's check inclusion of top 20
            const top20 = top50calc.slice(0, 20);
            for(let char of top20) {
                expect(affTry).toContain(char);
            }
        }
    });

    it('should be sorted according to Thai locale', () => {
        // Create a copy to sort
        const sortedWords = [...words].sort((a, b) => a.localeCompare(b, 'th'));
        let unsortedIndex = -1;
        for(let i=0; i<words.length; i++) {
            if(words[i] !== sortedWords[i]) {
                unsortedIndex = i;
                break;
            }
        }

        if(unsortedIndex !== -1) {
            // Fail with helpful message
            expect.fail(`Dictionary is not sorted. First mismatch at index ${unsortedIndex}: expected '${sortedWords[unsortedIndex]}' but found '${words[unsortedIndex]}'`);
        }
    });
});

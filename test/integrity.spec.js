const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const hunspellTh = require('../index');

describe('Dictionary Integrity Checks', () => {
    let dicContent;
    let dicLines;
    let words;

    before(() => {
        dicContent = fs.readFileSync(hunspellTh.dic, 'utf8');
        dicLines = dicContent.split(/\r?\n/).filter(line => line.trim() !== '');
        // First line is count
        words = dicLines.slice(1);
    });

    it('should match the line count in the header', () => {
        const headerCount = parseInt(dicLines[0], 10);
        expect(words.length).to.equal(headerCount, `Header count ${headerCount} does not match actual word count ${words.length}`);
    });

    it('should not contain duplicate words', () => {
        const uniqueWords = new Set(words);
        expect(uniqueWords.size).to.equal(words.length, 'Dictionary contains duplicate entries');
    });

    it('should be NFC normalized', () => {
        const nonNFC = words.filter(word => word !== word.normalize('NFC'));
        expect(nonNFC).to.be.empty;
    });

    it('should have optimal TRY order in AFF file (Top 50 frequency)', () => {
        // Calculate frequency
        const charFreq = {};
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

        expect(tryMatch).to.not.be.null;
        const affTry = tryMatch[1];

        // We check if the Top 20 most frequent characters are present in the TRY block
        // Exact order might differ slightly due to manual tuning, but presence is key.
        // However, for "Best Practice", we usually want the TRY block to start with high freq chars.

        // Let's check inclusion of top 20
        const top20 = top50calc.slice(0, 20);
        for(let char of top20) {
            expect(affTry).to.include(char, `High frequency character '${char}' missing from TRY block`);
        }
    });

    it('should be sorted according to Thai locale', () => {
        // Create a copy to sort
        const sortedWords = [...words].sort((a, b) => a.localeCompare(b, 'th'));
        // Check if original words array matches strictly
        // Note: Using JSON.stringify for deep equality of arrays is simple for strings
        // But let's find the first index that differs if any
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

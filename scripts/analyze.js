
const fs = require('fs');
const path = require('path');

const DIC_PATH = path.join(__dirname, '../th_TH.dic');
const AFF_PATH = path.join(__dirname, '../th_TH.aff');

function analyze() {
    let output = '';
    const log = (msg) => { console.log(msg); output += msg + '\n'; };

    log('--- Deep Study Analysis ---');

    // Read DIC
    const dicContent = fs.readFileSync(DIC_PATH, 'utf8');
    const lines = dicContent.split(/\r?\n/).filter(l => l.trim());
    const words = lines.slice(1); // skip count

    log(`Total words: ${words.length}`);

    // 1. Normalization Check
    let nonNFC = 0;
    words.forEach(w => {
        if (w !== w.normalize('NFC')) nonNFC++;
    });
    log(`Words needing NFC normalization: ${nonNFC}`);

    // 2. Character Frequency for TRY
    const charFreq = {};
    words.forEach(w => {
        for (const char of w) {
            charFreq[char] = (charFreq[char] || 0) + 1;
        }
    });

    const sortedChars = Object.entries(charFreq)
        .sort((a, b) => b[1] - a[1]) // Descending freq
        .map(e => e[0])
        .join('');

    log(`Calculated Optimal TRY order (top 50): ${sortedChars.slice(0, 50)}`);

    // Read AFF
    const affContent = fs.readFileSync(AFF_PATH, 'utf8');
    const tryMatch = affContent.match(/^TRY\s+(.+)$/m);
    if (tryMatch) {
        log(`Current AFF TRY: ${tryMatch[1]}`);
    } else {
        log('Current AFF TRY: <NOT FOUND>');
    }

    // 3. Check for duplicates (ignoring case or simple diffs)
    const seen = new Set();
    let dups = 0;
    words.forEach(w => {
        if (seen.has(w)) dups++;
        seen.add(w);
    });
    log(`Exact duplicates found: ${dups}`);

    fs.writeFileSync(path.join(__dirname, '../analysis_result.txt'), output, 'utf8');
}

analyze();

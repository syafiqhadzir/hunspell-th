import fs from 'fs';
import { describe, it, beforeAll, expect } from 'vitest';
// @ts-ignore
import nspell from 'nspell';
// @ts-ignore
import hunspellTh from '../src/index.js';

describe('Hunspell-TH Dictionary', () => {
    // biome-ignore lint/suspicious/noExplicitAny: nspell is untyped
    let spell: any;

    beforeAll(() => {
        const aff = fs.readFileSync(hunspellTh.aff);
        const dic = fs.readFileSync(hunspellTh.dic);
        spell = nspell(aff, dic);
    });

    it('should load the dictionary correctly', () => {
        expect(spell).not.toBeUndefined();
    });

    it('should correctly spell check valid Thai words', () => {
        const validWords = ['สวัสดี', 'คน', 'รัก', 'ประเทศไทย'];
        validWords.forEach(word => {
            expect(spell.correct(word)).toBe(true);
        });
    });

    it('should identify invalid words', () => {
        const invalidWords = ['xyz', 'abcd'];
        invalidWords.forEach(word => {
            expect(spell.correct(word)).toBe(false);
        });
    });

    it('should suggest corrections for misspelled words', () => {
        const suggestions = spell.suggest('สวัดดี');
        expect(suggestions).toContain('สวัสดี');
    });
});

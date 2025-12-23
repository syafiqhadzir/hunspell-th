const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const nspell = require('nspell');
const hunspellTh = require('../index');

describe('Hunspell-TH Dictionary', () => {
    let spell;

    before(() => {
        const aff = fs.readFileSync(hunspellTh.aff);
        const dic = fs.readFileSync(hunspellTh.dic);
        spell = nspell(aff, dic);
    });

    it('should load the dictionary correctly', () => {
        expect(spell).to.not.be.undefined;
    });

    it('should correctly spell check valid Thai words', () => {
        const validWords = ['สวัสดี', 'คน', 'รัก', 'ประเทศไทย'];
        validWords.forEach(word => {
            expect(spell.correct(word)).to.be.true;
        });
    });

    it('should identify invalid words', () => {
        const invalidWords = ['xyz', 'abcd'];
        // Note: Thai dictionary usually doesn't include English words, 
        // but behaviors might vary if mixed content is allowed.
        // Testing purely invalid Thai strings is harder without knowing the full dictionary content,
        // but random gibberish or non-existent words should fail.
        invalidWords.forEach(word => {
            expect(spell.correct(word)).to.be.false;
        });
    });

    it('should suggest corrections for misspelled words', () => {
        // This depends on the AFF rules. simpler test for now.
        // If "สวัดดี" (misspelled สวัสดี) is a common mistake and AFF handles it.
        const suggestions = spell.suggest('สวัดดี');
        expect(suggestions).to.include('สวัสดี');
    });
});

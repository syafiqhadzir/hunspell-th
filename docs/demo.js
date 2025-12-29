import nspell from 'https://esm.sh/nspell';

let spell;

async function loadDictionary() {
    try {
        const affResponse = await fetch('../th_TH.aff');
        const dicResponse = await fetch('../th_TH.dic');

        if (!affResponse.ok || !dicResponse.ok) throw new Error('Failed to load dictionary files');

        const aff = await affResponse.text();
        const dic = await dicResponse.text();

        spell = nspell(aff, dic);
        document.getElementById('status').textContent = 'Dictionary loaded! Ready to spellcheck.';
        document.getElementById('status').className = 'valid';
    } catch (err) {
        console.error(err);
        document.getElementById('status').textContent = 'Error loading dictionary. Check console.';
        document.getElementById('status').className = 'error';
    }
}

window.checkSpelling = function() {
    if (!spell) return;

    const text = document.getElementById('input').value;
    // Simple splitting by spaces (imperfect for Thai but okay for a demo of word validity)
    // For a real app, you'd want a Thai tokenizer.
    // Here we assume user might type space-separated words or test individual words.
    const words = text.split(/\s+/).filter(w => w.trim());

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (words.length === 0) {
        resultsDiv.textContent = 'Please enter some text.';
        return;
    }

    const ul = document.createElement('ul');

    words.forEach(word => {
        const correct = spell.correct(word);
        const li = document.createElement('li');
        if (correct) {
            li.innerHTML = `<span class="valid">✓ ${word}</span>`;
        } else {
            const suggestions = spell.suggest(word);
            li.innerHTML = `<span class="error">✗ ${word}</span> (Suggestions: ${suggestions.join(', ') || 'None'})`;
        }
        ul.appendChild(li);
    });

    resultsDiv.appendChild(ul);
};

loadDictionary();

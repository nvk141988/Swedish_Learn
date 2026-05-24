document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navVocab = document.getElementById('nav-vocab');
  const navSentences = document.getElementById('nav-sentences');
  const sectionVocab = document.getElementById('section-vocab');
  const sectionSentences = document.getElementById('section-sentences');
  const vocabContainer = document.getElementById('vocab-container');
  const sentencesContainer = document.getElementById('sentences-container');

  // Tab Switching
  navVocab.addEventListener('click', () => {
    navVocab.classList.add('active');
    navSentences.classList.remove('active');
    sectionVocab.classList.add('active');
    sectionSentences.classList.remove('active');
  });

  navSentences.addEventListener('click', () => {
    navSentences.classList.add('active');
    navVocab.classList.remove('active');
    sectionSentences.classList.add('active');
    sectionVocab.classList.remove('active');
  });

  // Fetch Data
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      renderVocabulary(data.vocabulary);
      renderSentences(data.sentences);
    })
    .catch(error => console.error('Error loading data:', error));

  // Render Vocabulary
  function renderVocabulary(vocabList) {
    vocabList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'vocab-card';
      card.innerHTML = `
        <div class="swedish">${item.swedish}</div>
        <div class="english">${item.english}</div>
      `;
      vocabContainer.appendChild(card);
    });
  }

  // Render Sentences
  function renderSentences(sentenceList) {
    sentenceList.forEach(item => {
      const block = document.createElement('div');
      block.className = 'sentence-block';

      // Build word-by-word HTML
      let wordsHtml = '';
      item.words.forEach(wordObj => {
        if (wordObj.translation) {
          wordsHtml += `<span class="word-tooltip" data-translation="${wordObj.translation}">${wordObj.word}</span>`;
        } else {
          // Punctuation without translation
          wordsHtml += `<span>${wordObj.word}</span>`;
        }
      });

      // Build grammar HTML
      let grammarHtml = '';
      if (item.grammar && item.grammar.length > 0) {
        let listItems = item.grammar.map(rule => `<li>${rule}</li>`).join('');
        grammarHtml = `
          <div class="grammar-accordion">
            <button class="grammar-toggle">Grammar Tips ▼</button>
            <div class="grammar-content">
              <ul>${listItems}</ul>
            </div>
          </div>
        `;
      }

      block.innerHTML = `
        <div class="sentence-header">
          <button class="listen-btn" data-text="${item.swedish}">🔊 Listen</button>
        </div>
        <div class="sentence-swedish">${wordsHtml}</div>
        <div class="sentence-english">${item.english}</div>
        ${grammarHtml}
      `;

      sentencesContainer.appendChild(block);
    });

    // Add event listeners for new elements
    addListenListeners();
    addAccordionListeners();
  }

  // Text-to-Speech
  function addListenListeners() {
    const listenBtns = document.querySelectorAll('.listen-btn');
    listenBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-text');
        speak(text);
      });
    });
  }

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sv-SE';
      utterance.rate = 0.8; // slightly slower for learners
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  }

  // Accordion Toggles
  function addAccordionListeners() {
    const toggles = document.querySelectorAll('.grammar-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.classList.contains('open')) {
          content.classList.remove('open');
          this.textContent = 'Grammar Tips ▼';
        } else {
          content.classList.add('open');
          this.textContent = 'Grammar Tips ▲';
        }
      });
    });
  }
});
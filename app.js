document.addEventListener('DOMContentLoaded', () => {
  let appData = { vocabulary: [], sentences: [] };

  // Elements
  const navVocab = document.getElementById('nav-vocab');
  const navSentences = document.getElementById('nav-sentences');
  const navRandomVocab = document.getElementById('nav-random-vocab');
  const navRandomSentences = document.getElementById('nav-random-sentences');

  const sectionVocab = document.getElementById('section-vocab');
  const sectionSentences = document.getElementById('section-sentences');
  const sectionRandomVocab = document.getElementById('section-random-vocab');
  const sectionRandomSentences = document.getElementById('section-random-sentences');

  const vocabContainer = document.getElementById('vocab-container');
  const sentencesContainer = document.getElementById('sentences-container');
  const randomVocabContainer = document.getElementById('random-vocab-container');
  const randomSentencesContainer = document.getElementById('random-sentences-container');

  const btnRefreshVocab = document.getElementById('refresh-random-vocab');
  const btnRefreshSentences = document.getElementById('refresh-random-sentences');

  const navButtons = [navVocab, navSentences, navRandomVocab, navRandomSentences];
  const sections = [sectionVocab, sectionSentences, sectionRandomVocab, sectionRandomSentences];

  // Tab Switching
  function switchTab(activeNav, activeSection) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active', 'hidden'));
    sections.forEach(sec => sec.classList.add('hidden'));

    activeNav.classList.add('active');
    activeSection.classList.remove('hidden');
    activeSection.classList.add('active');
  }

  navVocab.addEventListener('click', () => switchTab(navVocab, sectionVocab));
  navSentences.addEventListener('click', () => switchTab(navSentences, sectionSentences));
  navRandomVocab.addEventListener('click', () => {
    switchTab(navRandomVocab, sectionRandomVocab);
    if (randomVocabContainer.children.length === 0) renderRandomVocab();
  });
  navRandomSentences.addEventListener('click', () => {
    switchTab(navRandomSentences, sectionRandomSentences);
    if (randomSentencesContainer.children.length === 0) renderRandomSentences();
  });

  // Fetch Data
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      appData = data;
      renderVocabulary(data.vocabulary, vocabContainer);
      renderSentences(data.sentences, sentencesContainer);
    })
    .catch(error => console.error('Error loading data:', error));

  // Random Data Generation
  function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function renderRandomVocab() {
    randomVocabContainer.innerHTML = '';
    const randomWords = getRandomItems(appData.vocabulary, 10);
    renderVocabulary(randomWords, randomVocabContainer);
  }

  function renderRandomSentences() {
    randomSentencesContainer.innerHTML = '';
    const randomSentences = getRandomItems(appData.sentences, 5);
    renderSentences(randomSentences, randomSentencesContainer);
  }

  // Refresh Buttons
  btnRefreshVocab.addEventListener('click', renderRandomVocab);
  btnRefreshSentences.addEventListener('click', renderRandomSentences);

  // Render Vocabulary
  function renderVocabulary(vocabList, container) {
    vocabList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'vocab-card';
      card.innerHTML = `
        <div class="swedish">${item.swedish}</div>
        <div class="english">${item.english}</div>
      `;
      container.appendChild(card);
    });
  }

  // Render Sentences
  function renderSentences(sentenceList, container) {
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

      container.appendChild(block);
    });

    // Add event listeners for new elements
    addListenListeners(container);
    addAccordionListeners(container);
  }

  // Text-to-Speech
  function addListenListeners(container) {
    const listenBtns = container.querySelectorAll('.listen-btn');
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
  function addAccordionListeners(container) {
    const toggles = container.querySelectorAll('.grammar-toggle');
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
// Font change
const fontList = document.querySelector('.font-list');
const fontTitle = document.querySelector('.font-title');
const fontOption = document.querySelector('.font-option');
const body = document.body;

const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

function fontWindow(e) {
  e.stopPropagation();
  fontList.classList.toggle('show-font-list');
}

function changeFont(font) {
  body.style.fontFamily = font;
  fontList.classList.remove('show-font-list');
  fontTitle.textContent = font;
}

fontTitle.addEventListener('click', fontWindow);

document.addEventListener('click', function (e) {
  if (!fontList.contains(e.target) && !fontTitle.contains(e.target)) {
    fontList.classList.remove('show-font-list');
  }
});

// Night mode
function toggleMode() {
  const fontList = document.querySelector('.font-list');
  if (modeSwitch.checked) {
    body.style.backgroundColor = '#050505';
    body.style.color = '#fff';
    fontList.style.backgroundColor = '#1f1f1f';
  } else {
    body.style.backgroundColor = '#fff';
    body.style.color = '#050505';
    fontList.style.backgroundColor = '#fff';
  }
}
modeSwitch.addEventListener('click', toggleMode);

// Get data from API
async function getApi(word) {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

// Create all information

async function createData() {
  const getInput = document.querySelector('.search-bar').value.toLowerCase();
  const wordDefinitionElement = document.querySelector('.word-definition');

  const searchBar = document.querySelector('.search-bar');
  searchBar.value = '';
  
  const getData = await getApi(getInput);

  if (getData.title !== 'No Definitions Found' && getData[0].meanings[1] && getData[0].meanings[2]) {
    const resultContent = `
      <div>
        <div class="show-info">
          <h1 class="show-word">${getData[0].word}</h1>
          <img class="show-sound" src="./assets/images/icon-play.svg" alt="">
        </div>
        <p class="show-paragraph">${getData[0].phonetic}</p>
        <h3 class="definition-title">${getData[0].meanings[1].partOfSpeech}</h3>
        <p class="definition-meaning">Meaning</p>
        <p class="definition-text">${getData[0].meanings[1].definitions[0].definition}</p>
        <h3 class="definition-title">${getData[0].meanings[2].partOfSpeech}</h3>
        <p class="definition-meaning">Meaning</p>
        <p>${getData[0].meanings[2].definitions[0].definition}</p>
        <div class="definition-container">
          <h4 class="definition-source">Source</h4>
          <a class"wiki-link" href="https://en.wiktionary.org/wiki/${getInput}" target="_blank" class="definition-wiki">https://en.wiktionary.org/wiki/${getInput}/</a>
        </div>
      </div>`;
      
    wordDefinitionElement.innerHTML = resultContent;

    const showSound = document.querySelector('.show-sound');
    showSound.addEventListener('click', async () => {
      const audioPlay = new Audio(getData[0].phonetics[0].audio);
      audioPlay.play();
    });
  } else {
    wordDefinitionElement.innerHTML = `<div class="not-found-container">
                                        <img class="not-found-img" src="./assets/images/emoji.png" alt="No results" class="no-definitions">
                                        <h3>No Definitions Found for "${getInput}"</h3>
                                        <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at a later time or head to the web instead.</p>
                                       </div>`;
  }
}

// Add event listener to search button

searchButton.addEventListener('click', createData);

searchBar.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    createData();
  }
});
jQuery.get('http://192.168.3.11:5000/random-verse', function (data) {
  let verses = [];
  data.verses.forEach(function(verseData) {
    const text = verseData.text;
    const match = text.match(/(\d+):(.+?)(?=\s\d|"$)/g);
    if (match) {
      match.forEach(function(verseString) {
        const verseNum = parseInt(verseString.match(/\d+/)[0]);
        const verse = {
          book: verseData.book,
          chapter: verseData.chapter,
          text: verseString,
          verse_start: verseNum,
          verse_end: verseNum
        };
        verses.push(verse);
      });
    } else {
      verses.push(verseData);
    }
    console.log(verses)
  });
  const numVerses = Object.keys(verses).length;
  let verseIndex = 0;
  let currentBook = '';
  let currentChapter = 0;
  let currentVerse = verses[0];
  currentBook = currentVerse.book;
  currentChapter = currentVerse.chapter;
  let verseString = currentVerse.text;
  verseString = verseString.replace(/^\d+:\s*/, '');
  let verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);
  const wordBankContainer = document.getElementById("word-bank");
  const dropAreaContainer = document.getElementById('drop-line');
  const buttonLabels = [];
  let wordButtonsEnabled = true;
  const resetButton = document.querySelector("#reset");
  const checkArea = document.querySelector(".check-area");
  const checkResultsContainer = document.querySelector("#check-results");
  const newButton = document.createElement("button");
  let verseContainer = document.getElementById("verse");

  verseContainer.textContent = currentVerse.book + " " + currentVerse.chapter + ':' + currentVerse.verse_start;

  function createWordButtons() {
    const fragment = document.createDocumentFragment();
    verseArray.forEach((word) => {
      const button = document.createElement('button');
      button.textContent = word;
      button.id = `button-${buttonLabels.length}`;
      button.classList.add('word-button');
      button.dataset.word = word;
      buttonLabels.push(word);
      wordBankContainer.appendChild(button);
      fragment.appendChild(button);
    });
    wordBankContainer.appendChild(fragment);
    const wordButtons = document.querySelectorAll('.word-button');
    wordButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.parentNode === wordBankContainer && wordButtonsEnabled) {
          dropAreaContainer.appendChild(button);
        }
        else if (button.parentNode === dropAreaContainer && wordButtonsEnabled) {
          wordBankContainer.appendChild(button);
        }
      });
    });
  }

  function resetWordsInContainer(containerName) {
    while (containerName.firstChild) {
      containerName.removeChild(containerName.firstChild);
    }
  }

  function checkUserInput() {
    const selectedWordsButtons = Array.from(dropAreaContainer.querySelectorAll("button"));
    const selectedWords = selectedWordsButtons.map(button => button.dataset.word.replace(/[^\w\s]/gi, ""));
    verseArray = verseString.replace(/[^\w\s]/gi, "").split(" ");
    selectedWordsButtons.forEach((button, i) => {
      const selectedWord = selectedWords[i];
      const verseWord = verseArray[i];
      if (selectedWord === verseWord) {
        button.classList.add("correct");
        button.classList.remove("incorrect");
      } else {
        button.classList.add("incorrect");
        button.classList.remove("correct");
      }
    });
    resetWordsInContainer(wordBankContainer);
    verseArray = verseString.split(" ");
    createWordButtons();
    const wordsGood = selectedWords.reduce((acc, word, i) => acc + (verseArray[i] === word ? 1 : 0), 0);
    const totalWords = verseArray.length;
    const percentageCorrect = Math.round((wordsGood / totalWords) * 100);  
    let resultText;
    if (percentageCorrect >= 60) {
      resultText = `Great work! You got ${percentageCorrect}% correct!`;
    } else {
      resultText = `Good effort! You got ${percentageCorrect}% correct. Want to try it again?`;
    }
    checkResultsContainer.textContent = resultText;
  }
  
  createWordButtons();

  resetButton.addEventListener("click", () => {
    wordButtonsEnabled = true;
    resetWordsInContainer(wordBankContainer);
    resetWordsInContainer(dropAreaContainer);
    verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);
    createWordButtons();
    const nextButton = document.querySelector("#next-button");
    nextButton.remove();
    newButton.textContent = "CHECK";
    newButton.id = "check";
    checkArea.appendChild(newButton);
  });

    document.addEventListener("click", (event) => {
      if (event.target && event.target.id === "check") {
        wordButtonsEnabled = false;
        checkUserInput();
        const checkButton = document.querySelector("#check");
        checkButton.remove();
        if (verseIndex < (numVerses - 1)) {
        newButton.textContent = "NEXT";
        newButton.id = "next-button";
        checkArea.appendChild(newButton);
        } else {
        newButton.textContent = "DONE";
        newButton.id = "done";
        checkArea.appendChild(newButton);
        }
      } else if (event.target && event.target.id === "next-button") {
        verseString = verses[verseIndex += 1].text;
        verseContainer.textContent = verses[verseIndex].book + " " + verses[verseIndex].chapter + ':' + verses[verseIndex].verse_start;
        verseString = verseString.replace(/^\d+:\s*/, '');
        wordButtonsEnabled = true;
        resetWordsInContainer(wordBankContainer);
        resetWordsInContainer(dropAreaContainer);
        verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);
        createWordButtons();
        const nextButton = document.querySelector("#next-button");
        nextButton.remove();
        newButton.textContent = "CHECK";
        newButton.id = "check";
        checkArea.appendChild(newButton);
        
      }
    });
});

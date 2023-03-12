'use strict';
jQuery.get('http://192.168.3.11:5000/random-verse', function (data) {
  const verses = data.verses;
  let currentBook = '';
  let currentChapter = 0;
  verses.forEach(function(verse) {
    if (verse.book !== currentBook || verse.chapter !== currentChapter) {
      currentBook = verse.book;
      currentChapter = verse.chapter;
    }
  });
  const verseString = verses[0].text;
  let verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);
  const wordBankContainer = document.getElementById("word-bank");
  const dropAreaContainer = document.getElementById('drop-line');
  const buttonLabels = [];

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
  }

  function resetWordBankContainer() {
    while (wordBankContainer.firstChild) {
      wordBankContainer.removeChild(wordBankContainer.firstChild);
    }
    verseArray = verseString.split(" ");
    createWordButtons();
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
    resetWordBankContainer();
    const wordsGood = selectedWords.reduce((acc, word, i) => acc + (verseArray[i] === word ? 1 : 0), 0);
    const totalWords = verseArray.length;
    const percentageCorrect = Math.round((wordsGood / totalWords) * 100);  
    let resultText;
    if (percentageCorrect >= 60) {
      resultText = `Great work! You got ${percentageCorrect}% correct!`;
    } else {
      resultText = `Good effort! You got ${percentageCorrect}% correct. Want to try it again?`;
    }
    const checkResultsContainer = document.querySelector("#check-results");
    checkResultsContainer.textContent = resultText;
  }
  
  createWordButtons();

  let dropAreaButtonsEnabled = true;
  const wordButtons = document.querySelectorAll('.word-button');
  wordButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.parentNode === wordBankContainer) {
        dropAreaContainer.appendChild(button);
      }
      else if (button.parentNode === dropAreaContainer && dropAreaButtonsEnabled) {
        wordBankContainer.appendChild(button);
      }
    });
  });
  const resetButton = document.querySelector("#reset");
  resetButton.addEventListener("click", () => {
    // Enable the buttons in the drop area
    dropAreaButtonsEnabled = true;
    resetWordBankContainer();
  });

  const checkButton = document.querySelector("#check");
  checkButton.addEventListener("click", () => {
    dropAreaButtonsEnabled = false;
    checkUserInput();
    checkButton.remove();
    const nextButton = document.createElement("button");
    nextButton.textContent = "NEXT";
    nextButton.id = "next";
    nextButton.classList.add("next-button");
    const checkArea = document.querySelector(".check-area");
    checkArea.appendChild(nextButton);
  });

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "next") {
      // Add your code to handle the Next button event
    }
  });
});

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
  let verseString = verses[0].text;
  let verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);
  const wordBankContainer = document.getElementById("word-bank");
  const dropAreaContainer = document.getElementById('drop-line');
  const buttonLabels = [];
  let wordButtonsEnabled = true;
  const resetButton = document.querySelector("#reset");
  const checkButton = document.querySelector("#check");
  const nextButton = document.querySelector("#next-button");
  const checkArea = document.querySelector(".check-area");
  const checkResultsContainer = document.querySelector("#check-results");
  const newButton = document.createElement("button");

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
    nextButton.remove();
    newButton.textContent = "CHECK";
    newButton.id = "check";
    checkArea.appendChild(newButton);
  });

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "check") {
      wordButtonsEnabled = false;
      checkUserInput();
      checkButton.remove();
      newButton.textContent = "NEXT";
      newButton.id = "next-button";
      checkArea.appendChild(newButton);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "next-button") {
      verseString = verses[0].text;
      wordButtonsEnabled = true;
      resetWordsInContainer(wordBankContainer);
      resetWordsInContainer(dropAreaContainer);
      verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);
      createWordButtons();
      newButton.textContent = "CHECK";
      newButton.id = "check";
      checkArea.appendChild(newButton);
    }
  });
});

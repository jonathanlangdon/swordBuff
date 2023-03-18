function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

$.get('http://192.168.3.11:5000/random-verse', function (data) {
  let verses = [];
  data.verses.forEach(function(verseData) {
    const text = verseData.text;
    const match = text.match(/(\d+):(.+?)(?=\s\d|"$)/g);
    if (match) {
      match.forEach(function(verseString) {
        const verseNum = parseInt(verseString.match(/\d+/)[0], 10);
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
  });
  const numVerses = Object.keys(verses).length;
  let verseIndex = 0;
  let currentVerse = verses[0];
  let verseString = currentVerse.text;
  verseString = verseString.replace(/^\d+:\s*/, '');
  const wordBankContainer = document.getElementById("word-bank");
  const dropAreaContainer = document.getElementById('drop-area');
  const dropLineContainer = document.getElementById('drop-line');
  const buttonLabels = [];
  let wordButtonsEnabled = true;
  const resetButton = document.querySelector("#reset");
  const checkArea = document.querySelector("#check-button-container");
  const checkResultsContainer = document.querySelector("#check-results");
  const newButton = document.createElement("button");
  let verseContainer = document.getElementById("verse");
  let verseArray = shuffle(verseString.split(" "));
  let originalVerseArray = verseString.split(" ");

  verseContainer.textContent = currentVerse.book + " " + currentVerse.chapter + ':' + currentVerse.verse_start;

    function createWordButtons(whichArray) {
      const fragment = document.createDocumentFragment();
      whichArray.forEach((word) => {
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
            dropLineContainer.appendChild(button);
          }
          else if (button.parentNode === dropLineContainer && wordButtonsEnabled) {
            wordBankContainer.appendChild(button);
          }
        });
      });
    }

  $(document).ready(function () {
    const inputBox = $("#keyboard-input");
    const wordBankContainer = $("#word-bank");
    $(document).on("keydown", function () {
      inputBox.focus();
    });
    inputBox.on("keydown", function (event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        useKeyboardInput();
      }
    });
    function useKeyboardInput() {
      let keyboardWord = inputBox.val().replace(/[^\w\s]/gi, "").toLowerCase();
      inputBox.val(""); // Clear the input box
      let bankWordButtons = Array.from(wordBankContainer[0].querySelectorAll("button"));
      bankWordButtons.some((button) => {
        let buttonWord = button.textContent.replace(/[^\w\s]/gi, "").toLowerCase();
        if (keyboardWord === buttonWord) {
          button.click();
          return true; // Stop the loop when the first match is found
        }
        return false; // Continue the loop
      });
    }    
  });

  function resetWordsInContainer(containerName) {
    while (containerName.firstChild) {
      containerName.removeChild(containerName.firstChild);
    }
  }

  function checkUserInput() {
    const selectedWordsButtons = Array.from(dropLineContainer.querySelectorAll("button"));
    const selectedWords = selectedWordsButtons.map(button => button.dataset.word.replace(/[^\w\s]/gi, "").toLowerCase());
    const correctVerseArray = verseString.replace(/[^\w\s]/gi, "").toLowerCase().split(" ");
    selectedWordsButtons.forEach((button, i) => {
      const selectedWord = selectedWords[i];
      const correctVerseWord = correctVerseArray[i];
      if (selectedWord === correctVerseWord) {
        button.classList.add("correct");
        button.classList.remove("incorrect");
      } else {
        button.classList.add("incorrect");
        button.classList.remove("correct");
      }
    });
    resetWordsInContainer(wordBankContainer);
    createWordButtons(originalVerseArray);
    const wordsGood = selectedWords.reduce((acc, word, i) => acc + (correctVerseArray[i] === word ? 1 : 0), 0);
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

  createWordButtons(verseArray);

  function setContainerHeight() {
    const headerHeight  = document.getElementById('header').offsetHeight;
    const footerHeight = document.getElementById('footer').offsetHeight;
    console.log(headerHeight);
    console.log(footerHeight);
    const containerHeight = (window.innerHeight - headerHeight - footerHeight - 36) / 2;
    wordBankContainer.style.height = `${containerHeight}px`;
    dropAreaContainer.style.height = `${containerHeight}px`;
  }
  
  setContainerHeight();
  
  window.addEventListener('resize', setContainerHeight);
  
  const setWordBankHeight = wordBankContainer.offsetHeight;
  wordBankContainer.style.height = `${setWordBankHeight}px`;
  dropLineContainer.style.height = `${setWordBankHeight}px`;

  resetButton.addEventListener("click", () => {
    wordButtonsEnabled = true;
    resetWordsInContainer(wordBankContainer);
    resetWordsInContainer(dropLineContainer);
    resetWordsInContainer(checkResultsContainer);
    verseArray = shuffle(verseString.split(" "));
    createWordButtons(verseArray);
    const nextButton = document.querySelector("#next-button");
    if (nextButton) {
      nextButton.remove();
    }
    const checkButton = document.querySelector("#check");
    if (!checkButton) {
      newButton.textContent = "CHECK";
      newButton.id = "check";
      checkArea.appendChild(newButton);
    }
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.id = "keyboard-input";
    inputBox.placeholder = "Keyboard Input";
    checkResultsContainer.appendChild(inputBox);
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
        newButton.addEventListener("click", () => {
          location.reload();
        });
        }
      } else if (event.target && event.target.id === "next-button") {
        verseString = verses[verseIndex += 1].text;
        verseContainer.textContent = verses[verseIndex].book + " " + verses[verseIndex].chapter + ':' + verses[verseIndex].verse_start;
        verseString = verseString.replace(/^\d+:\s*/, '');
        wordButtonsEnabled = true;
        resetWordsInContainer(wordBankContainer);
        resetWordsInContainer(dropLineContainer);
        resetWordsInContainer(checkResultsContainer);
        verseArray = shuffle(verseString.split(" "));
        originalVerseArray = verseString.split(" ");
        createWordButtons(verseArray);
        const nextButton = document.querySelector("#next-button");
        nextButton.remove();
        newButton.textContent = "CHECK";
        newButton.id = "check";
        checkArea.appendChild(newButton);
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "keyboard-input";
        inputBox.placeholder = "Keyboard Input";
        checkResultsContainer.appendChild(inputBox);
        
      }
    });
});
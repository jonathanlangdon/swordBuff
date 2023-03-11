// Define the verse string
const verseString = "The Lord is my light and my salvation whom shall I fear? The Lord is the stronghold of my life, of whom shall I be afraid?";
// Split the verse string into an array of words and shuffle them
const verseArray = verseString.split(" ").sort(() => Math.random() - 0.5);

// Get references to the DOM elements
const wordBankContainer = document.getElementById("word-bank");
const dropAreaContainer = document.getElementById('drop-line');
const buttonLabels = [];
const inputBox = document.getElementById('input-box');
const fragment = document.createDocumentFragment(); // create a document fragment to hold the buttons
let matchingButtons = [];
let pendingInput = '';

// Loop over the verse array and create a button element for each word
for (const word of verseArray) {
  const button = document.createElement('button');
  button.textContent = word;
  button.id = `button-${buttonLabels.length}`;
  button.classList.add('word-button');
  button.dataset.word = word;
  buttonLabels.push(word);
  wordBankContainer.appendChild(button);
}
// Append the document fragment to the parent container
wordBankContainer.appendChild(fragment);

// Set the fixed height of the container using CSS
const containerHeight = wordBankContainer.offsetHeight;
wordBankContainer.style.height = `${containerHeight}px`;

// Get all the word buttons and add event listeners to them
const wordButtons = document.querySelectorAll('.word-button');
wordButtons.forEach(button => {
  button.addEventListener('click', () => {
    // If the button is in the word-bank container, move it to the drop-line container
    if (button.parentNode === wordBankContainer) {
      dropAreaContainer.appendChild(button);
    }
    // If the button is in the drop-line container, move it back to the word-bank container
    else if (button.parentNode === dropAreaContainer) {
      wordBankContainer.appendChild(button);
    }
  });
});

//---------------------------------------------------------

// Check the user's input and display the result
function checkUserInput() {
  // Get an array of button elements in the drop-line container
  const selectedWordsButtons = Array.from(dropAreaContainer.querySelectorAll("button"));

  // Create a new array of words from the selected buttons, ignoring punctuation
  const selectedWords = selectedWordsButtons.map(button => button.dataset.word.replace(/[^\w\s]/gi, ""));

  // Split the original verse string into an array of words, ignoring punctuation
  const verseArray = verseString.replace(/[^\w\s]/gi, "").split(" ");

  // Loop over the selectedWordsButtons array and compare each selected word to the corresponding word in the verse
  for (let i = 0; i < selectedWordsButtons.length; i++) {
    const selectedWord = selectedWords[i];
    const verseWord = verseArray[i];
    const button = selectedWordsButtons[i];

    // Check if the selected word matches the corresponding word in the verse
    if (selectedWord === verseWord) {
      button.classList.add("correct");
      button.classList.remove("incorrect");
    } else {
      button.classList.add("incorrect");
      button.classList.remove("correct");
    }
  }

  // Remove all the word buttons from the word-bank container
  while (wordBankContainer.firstChild) {
    wordBankContainer.removeChild(wordBankContainer.firstChild);
  }

  // Loop over the verse array and create a button element for each word
  for (const word of verseArray) {
    const button = document.createElement('button');
    button.textContent = word;
    button.id = `button-${buttonLabels.length}`;
    button.classList.add('word-button');
    button.dataset.word = word;
    buttonLabels.push(word);
    wordBankContainer.appendChild(button);
  }

  // Append the document fragment to the parent container
  wordBankContainer.appendChild(fragment);

  // Set the fixed height of the container using CSS
  const containerHeight = wordBankContainer.offsetHeight;
  wordBankContainer.style.height = `${containerHeight}px`;

  // Count how many words are in the correct position
  const numWordsInCorrectPosition = selectedWords.reduce((acc, word, i) => {
    return acc + (verseArray[i] === word ? 1 : 0);
  }, 0);

  // Calculate the percentage of correct words
  const totalWords = verseArray.length;
  const percentageCorrect = Math.round((numWordsInCorrectPosition / totalWords) * 100);

  // Generate the result text based on the percentage of correct words
  let resultText;
  if (percentageCorrect >= 60) {
    resultText = `Great work! You got ${percentageCorrect}% correct!`;
  } else {
    resultText = `Good effort! You got ${percentageCorrect}% correct. Want to try it again?`;
  }

  // Display the result in the check-results container
  const checkResultsContainer = document.querySelector("#check-results");
  checkResultsContainer.textContent = resultText;
}


//------------------------------------------------------------

// Add a click event listener to the check button
const checkButton = document.querySelector("#check");
checkButton.addEventListener("click", () => {
  checkUserInput();
});

// Add a click event listener to the reset button
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", () => {
  location.reload();
});


// Create a result box element
function createResultBox(text) {
  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");

  const resultText = document.createElement("p");
  resultText.textContent = text;
  resultBox.appendChild(resultText);

}

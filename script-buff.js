let verseString = "";

$.get('http://192.168.3.11:5000/random-verse', function(data) {
  verseString = data.verse;
})

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
//const containerHeight = wordBankContainer.offsetHeight;
//wordBankContainer.style.height = `${containerHeight}px`;

//------------------------------------------------------


// Set a flag to indicate whether the buttons in the drop area are enabled or disabled
let dropAreaButtonsEnabled = true;

// Get all the word buttons and add event listeners to them
const wordButtons = document.querySelectorAll('.word-button');
wordButtons.forEach(button => {
  button.addEventListener('click', () => {
    // If the button is in the word-bank container, move it to the drop-line container
    if (button.parentNode === wordBankContainer) {
      dropAreaContainer.appendChild(button);
    }
    // If the button is in the drop-line container, move it back to the word-bank container
    else if (button.parentNode === dropAreaContainer && dropAreaButtonsEnabled) {
      wordBankContainer.appendChild(button);
    }
  });
});


// Add a click event listener to the reset button
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", () => {
  // Enable the buttons in the drop area
  dropAreaButtonsEnabled = true;
  location.reload();
});

// Add a click event listener to the check button
const checkButton = document.querySelector("#check");
checkButton.addEventListener("click", () => {
  // Disable the buttons in the drop area
  dropAreaButtonsEnabled = false;

  checkUserInput();

  // Remove the check button and add a Next button
  checkButton.remove();
  const nextButton = document.createElement("button");
  nextButton.textContent = "NEXT";
  nextButton.id = "next";
  nextButton.classList.add("next-button");
  const checkArea = document.querySelector(".check-area");
  checkArea.appendChild(nextButton);
});

// Add a click event listener to the Next button
document.addEventListener("click", (event) => {
  if (event.target && event.target.id === "next") {
    // Add your code to handle the Next button click here
    console.log("Next button clicked");
  }
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

// Create a result box element
function createResultBox(text) {
const resultBox = document.createElement("div");
resultBox.classList.add("result-box");

const resultText = document.createElement("p");
resultText.textContent = text;
resultBox.appendChild(resultText);

return resultBox;
}

function sanitizeInput(input) {
// Remove script tags and attributes from the input
const sanitizedInput = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
const sanitizedInput2 = sanitizedInput.replace(/<[^>]*(on\w+)[^>]*>/gi, "");

return sanitizedInput2;
}

$(document).ready(function() {
  // Listen for clicks on the submit button
  $("#submit").click(function() {
    // Get the user's input
    const userInput = $("#input-box").val().trim();

    // Sanitize the input to prevent XSS attacks
    const sanitizedInput = sanitizeInput(userInput);

    // Check if the input matches the verse
    if (sanitizedInput === verseString) {
      // Display a success message
      const resultBox = createResultBox("Great job! You got it right!");
      $("#result-container").append(resultBox);

      // Disable the input and submit button
      $("#input-box").attr("disabled", true);
      $("#submit").attr("disabled", true);
    } else {
      // Display an error message
      const resultBox = createResultBox("Sorry, that's not correct. Please try again.");
      $("#result-container").append(resultBox);
    }

    // Clear the input field
    $("#input-box").val("");
  });

  // Listen for clicks on the reset button
  $("#reset").click(function() {
    // Reload the page to get a new verse
    location.reload();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let currentInput = "0"; 
  let previousInput = null;
  let operator = null;

  const output = document.getElementById("output");
  const buttons = document.querySelectorAll(".child");

  // Speech Recognition Setup
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      processVoiceCommand(spokenText.toLowerCase());
  };

  function startListening() {
      recognition.start();
  }

  // Text-to-Speech Function
  function speak(text) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.rate = 1;
      window.speechSynthesis.speak(speech);
  }

  // Process Voice Command (Convert speech to button clicks)
  function processVoiceCommand(command) {
      const replacements = {
          "plus": "+",
          "minus": "-",
          "times": "*",
          "into": "*",
          "multiply": "*",
          "divide": "/",
          "by": "/",
          "equals": "=",
          "clear": "AC"
      };

      Object.keys(replacements).forEach(key => {
          command = command.replace(new RegExp(`\\b${key}\\b`, "g"), replacements[key]);
      });

      // Set input field with recognized command
      currentInput = command;
      output.innerText = currentInput;

      // Auto-calculate if user says "equals"
      if (command.includes("=")) {
          calculateResult();
      }
  }

  buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
          const buttonText = event.target.innerText;

          if (buttonText === "AC") {
              currentInput = "0";
              previousInput = null;
              operator = null;
          } else if (buttonText === "+/-") {
              currentInput = (parseFloat(currentInput) * -1).toString();
          } else if (buttonText === "%") {
              currentInput = (parseFloat(currentInput) / 100).toString();
          } else if (buttonText === "=") {
              calculateResult();
          } else if (["/", "*", "-", "+"].includes(buttonText)) {
              if (previousInput === null) {
                  previousInput = currentInput;
              }
              operator = buttonText;
              currentInput = "0";
          } else {
              if (currentInput === "0" && buttonText !== ".") {
                  currentInput = buttonText;
              } else if (buttonText === "." && !currentInput.includes(".")) {
                  currentInput += buttonText;
              } else {
                  currentInput += buttonText;
              }
          }

          output.innerText = currentInput;
      });
  });

  function calculateResult() {
      if (operator && previousInput !== null) {
          currentInput = performCalculation(previousInput, currentInput, operator);
          operator = null;
          previousInput = null;
          speak(`The result is ${currentInput}`);
      }
      output.innerText = currentInput;
  }

  function performCalculation(a, b, op) {
      const num1 = parseFloat(a);
      const num2 = parseFloat(b);

      switch (op) {
          case "+":
              return (num1 + num2).toString();
          case "-":
              return (num1 - num2).toString();
          case "*":
              return (num1 * num2).toString();
          case "/":
              return num2 !== 0 ? (num1 / num2).toString() : "Error";
          default:
              return b;
      }
  }

  // Add a button dynamically to start voice recognition
  const voiceButton = document.createElement("button");
  voiceButton.innerText = "🎤 Voice Input";
  voiceButton.style.display = "block";
  voiceButton.style.margin = "10px auto";
  voiceButton.style.padding = "10px";
  voiceButton.style.fontSize = "16px";
  document.body.appendChild(voiceButton);

  voiceButton.addEventListener("click", startListening);
});

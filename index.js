document.addEventListener("DOMContentLoaded", () => {
    let currentInput = "0"; // Store the current input
    let previousInput = null; // Store the previous input
    let operator = null; // Store the operator
  
    const output = document.getElementById("output");
    const buttons = document.querySelectorAll(".child");
  
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const buttonText = event.target.innerText;
  
        if (buttonText === "AC") {
          // Clear the display
          currentInput = "0";
          previousInput = null;
          operator = null;
        } else if (buttonText === "+/-") {
          // Toggle sign
          currentInput = (parseFloat(currentInput) * -1).toString();
        } else if (buttonText === "%") {
          // Calculate percentage (as a whole number)
          currentInput = (parseFloat(currentInput) / 100).toString();
          // Update the display immediately after percentage operation
          output.innerText = currentInput;
        } else if (buttonText === "=") {
          // Perform calculation
          if (operator && previousInput !== null) {
            currentInput = performCalculation(
              previousInput,
              currentInput,
              operator
            );
            operator = null;
            previousInput = null;
          }
        } else if (["/", "*", "-", "+"].includes(buttonText)) {
          // Store operator and previous input
          if (previousInput === null) {
            previousInput = currentInput;
          }
          operator = buttonText;
          currentInput = "0";
        } else {
          // Update current input (number or dot)
          if (currentInput === "0" && buttonText !== ".") {
            currentInput = buttonText;
          } else if (buttonText === "." && !currentInput.includes(".")) {
            currentInput += buttonText; // Allow decimal point only once
          } else {
            currentInput += buttonText;
          }
        }
  
        output.innerText = currentInput;
      });
    });
  
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
  });
  
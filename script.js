/** @format */

(function () {
  const screen = document.querySelector(".screen");
  const historyLog = document.querySelector(".history-log");
  const grid = document.getElementById("basic-grid");

  let currentExpression = "";

  // Initialize the screen display
  screen.value = "0";

  /**
   * Helper function to clean up the display expression for JavaScript evaluation.
   */
  function prepareExpressionForEval(expression) {
    // Replace display operators with JavaScript operators
    return expression.replace(/×/g, "*").replace(/÷/g, "/");
  }

  // --- Calculator Operation Logic ---
  if (grid) {
    // Ensure the basic grid is found
    grid.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("click", function (e) {
        let value = e.target.dataset.num;

        if (!value) return;

        // Reset screen on first number input
        if (
          screen.value === "0" &&
          !isNaN(parseFloat(value)) &&
          value !== "."
        ) {
          screen.value = "";
          currentExpression = "";
        }

        // Handle ALL CLEAR (AC)
        if (value === "AC") {
          currentExpression = "";
          historyLog.textContent = "";
          screen.value = "0";
        }
        // Handle DELETE (⌫)
        else if (value === "del") {
          currentExpression = currentExpression.slice(0, -1);
          screen.value = currentExpression === "" ? "0" : currentExpression;
        }
        // Handle numbers, operators, and decimal
        else if (
          !isNaN(parseFloat(value)) ||
          ["+", "-", "*", "/", "."].includes(value)
        ) {
          // Use the button's text content for the display
          currentExpression += e.target.textContent;
          screen.value = currentExpression;
        }
        // Handle PLUS/MINUS (±)
        else if (value === "±") {
          if (currentExpression === "" || currentExpression === "0") return;

          // Simple sign toggle: checks if the entire expression starts with a minus
          if (currentExpression.startsWith("-")) {
            currentExpression = currentExpression.substring(1);
          } else {
            currentExpression = "-" + currentExpression;
          }
          screen.value = currentExpression;
        }
        // Handle EQUAL
        else if (value === "=") {
          if (currentExpression === "") return;

          historyLog.textContent = currentExpression + " =";

          try {
            let evalExpression = prepareExpressionForEval(currentExpression);

            let answer = eval(evalExpression);

            // Fix for floating point errors
            answer = parseFloat(answer.toFixed(10));

            screen.value = answer;
            currentExpression = String(answer);
          } catch (error) {
            screen.value = "Error";
            historyLog.textContent = "Invalid Expression";
            currentExpression = "";
          }
        }
        // Handle PERCENT (%)
        else if (value === "%") {
          if (currentExpression === "") return;
          try {
            let answer =
              eval(prepareExpressionForEval(currentExpression)) / 100;
            answer = parseFloat(answer.toFixed(10));

            historyLog.textContent = currentExpression + "% =";
            screen.value = answer;
            currentExpression = String(answer);
          } catch (error) {
            screen.value = "Error";
            historyLog.textContent = "Invalid Expression for %";
            currentExpression = "";
          }
        }

        // Update history log after every click
        if (value !== "=" && value !== "AC") {
          historyLog.textContent = currentExpression;
        }
      });
    });
  }
})();

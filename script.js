var x = y = activeOperator = null,
    historyTextClone,
    delCount = false,
    shiftOperator = false,
    divideByZero = "can't  divide by zero",
    limitText = "Limit is exceeded",
    historyArr = [],
    memoryArr = [],
    mr = 0,
    historyList = document.getElementById("historyList"),
    callEqual = false;
    operatorsList = {
      multiplication: function (x, y) {
        return x * y;
      },
      minus: function (x, y) {
        return x - y;
      },

      plus: function (x, y) {
        return x + y;
      },

      division: function (x, y) {
        if (y == 0) {
          return divideByZero;
        }
        return x / y;
      },

      plusMinus: function () {
        answer.innerHTML = -parseFloat(answer.innerHTML);
      },

      c: function () {
        x = y = activeOperator = nextActivOperator = delCount = null;
        answer.innerHTML = "0";
        solveString.innerHTML = "";
      },

      ce: function () {
          answer.innerHTML = "0";
      },

      backspace: function () {
        if (answer.innerHTML.length == 1) {
           answer.innerHTML = 0;
           return false;
        }

        if (answer.innerHTML.indexOf("e") > -1) {
            return false;
        }

        if (isNaN(answer.innerHTML)) {
          return false;
        }

        answer.innerHTML = answer.innerHTML.substring(0, answer.innerHTML.length - 1);
      },

      equal: function (dataOperator, nextDataOperator) {


        if (dataOperator && nextDataOperator) {

          if (x != null) {
           y = parseFloat(answer.innerHTML);
          } else {
           return false;
          }

          sortingObj.dataOperator(dataOperator, x, y);

          delCount = null;
          shiftOperator = false;

          return false;
        }

        if (x != null) {
          if (solveString.innerHTML && y == null) {
            y = parseFloat(answer.innerHTML);
          }
        } else {
         return false;
        }

        callEqual = false;

        sortingObj.dataOperator(dataOperator, x, y);

        if (y) {
         solveString.innerHTML = "";
        }

        nextActivOperator = delCount = null;
        shiftOperator = false;
      },

      point: function () {
          var answerNumber = parseFloat(answer.innerHTML);

          if (answer.innerHTML.indexOf(".") > -1) {
            return false;
          }


          if (answerNumber < 0) {
            answerNumber = -answerNumber;
          }

          if (answerNumber > 0 && answerNumber / Math.floor(answerNumber) == 1) {
            answer.innerHTML += ".";
          }

          if (answerNumber == 0) {
            answer.innerHTML += ".";
          }
      },

      madd: function () {
        if(document.querySelector(".memoryText")) {
          document.querySelector(".memoryText").remove();
        }

        var div = document.createElement("div");
        div.classList.add("memoryElem", "clearfix");
        div.innerHTML =
        '<div class="memoryElem clearfix">' +
            '<span class="memoryAnswer">0</span>' +
            '<br>' +
          '<div class="memoryElemButtons">' +
            '<div class="" data-memory-operator="mce">MC</div>' +
            '<div class="" data-memory-operator="mpluse">M+</div>' +
            '<div class="" data-memory-operator="mminuse">M-</div>' +
          '</div>' +
        '</div>';

        div.querySelector(".memoryAnswer").innerHTML = answer.innerHTML;
        memoryList.insertBefore(div, memoryList.firstChild);

        var buttons = div.getElementsByTagName("div");

        function mminuse() {
          div.querySelector('.memoryElem .memoryAnswer').innerHTML =
            parseFloat(div.querySelector('.memoryElem .memoryAnswer')
            .innerHTML) - parseFloat(answer.innerHTML);
          }

        function mpluse() {
          div.querySelector('.memoryElem .memoryAnswer').innerHTML =
            parseFloat(answer.innerHTML) + parseFloat(div.querySelector
              ('.memoryElem .memoryAnswer').innerHTML);
          }

        function mce() {
          div.remove();

          if (!memoryList.querySelector(".memoryText") && !memoryList.
          querySelector(".memoryElem")) {
            memoryList.innerHTML = '<div class="memoryText">There\'s no history yet</div>';
          }

          memoryButtonNotActive();
        }

        for (var i = 0; i < buttons.length; i++) {

          switch (buttons[i].getAttribute("data-memory-operator")) {
            case "mce":
              buttons[i].onclick = mce;
              break;
            case "mpluse":
              buttons[i].onclick = mpluse;
              break;
            case "mminuse":
              buttons[i].onclick = mminuse;
              break;
          }

        }

        mr = mr + parseFloat(answer.innerHTML);

        shiftOperator = true;

        memoryButtonNotActive();
      },
      mc: function () {
        memoryList.innerHTML = '<div class="memoryText">There\'s no history yet</div>';
        mr = 0;

        memoryButtonNotActive();
      },
      mr: function () {
        answer.innerHTML = mr;
      },
      mplus: function () {

        if (memoryList.querySelector(".memoryElem")) {
          memoryList.querySelector(".memoryElem").querySelector(".memoryAnswer").innerHTML =
            parseFloat(answer.innerHTML) + parseFloat(memoryList.querySelector(".memoryElem")
            .querySelector(".memoryAnswer").innerHTML);
        } else {
          operatorsList.madd();
        }
      },
      mminus: function () {

        if (memoryList.querySelector(".memoryElem")) {
          memoryList.querySelector(".memoryElem").querySelector(".memoryAnswer").innerHTML =
            parseFloat(memoryList.querySelector(".memoryElem")
            .querySelector(".memoryAnswer").innerHTML) - parseFloat(answer.innerHTML);
        } else {
          operatorsList.madd();
        }
      }
    },
    sortingObj = {
      dataMemoryOperator: function (name) {
        if (typeof operatorsList[name] === "function") {
          operatorsList[name]();
        }
      },
      dataOperator: function (name, x1, y1) {
        if (typeof operatorsList[name] === "function") {

          if (solveString.innerHTML) {
            addSolveString(" " + y1);
          }

          var answerNumber = operatorsList[name](x1, y1);

          answerNumber = float(answerNumber, x, y);

          answerNumber = answerNumber.toString();


          if (answerNumber.length > 15 && answerNumber != divideByZero) {
            answerNumber = parseFloat(answerNumber).toExponential(9);
          }

          if (isNaN(answerNumber) && answerNumber != divideByZero) {
            answerNumber = "Result is undefined";
          }

          if (answer.innerHTML == limitText) {
            return false;
          }

          if (answerNumber == Infinity) {
            answerNumber = limitText;
          }

          answer.innerHTML = answerNumber;

          if (!callEqual) {
            createHistoryElem();
            callEqual = false;
          }

          x = parseFloat(answerNumber);
        }
      },
      stringsOperator: function (name, x, y) {
        if (typeof operatorsList[name] === "function") {
          operatorsList[name](x, y);
        }
      },
      keyPress: function (name) {
        if (typeof keyList[name] === "function") {
          keyList[name]();
        }
      }
    },
    keyList = {
      "96": function () {
        document.getElementById('0').click();
        animationButton("0");
      },
      "97": function () {
        document.getElementById('1').click();
        animationButton("1");
      },
      "98": function () {
        document.getElementById('2').click();
        animationButton("2");
      },
      "99": function () {
        document.getElementById('3').click();
        animationButton("3");
      },
      "100": function () {
        document.getElementById('4').click();
        animationButton("4");
      },
      "101": function () {
        document.getElementById('5').click();
        animationButton("5");
      },
      "102": function () {
        document.getElementById('6').click();
        animationButton("6");
      },
      "103": function () {
        document.getElementById('7').click();
        animationButton("7");
      },
      "104": function () {
        document.getElementById('8').click();
        animationButton("8");
      },
      "105": function () {
        document.getElementById('9').click();
        animationButton("9");
      },
      "27": function () {
        document.getElementById('c').click();
        animationButton("c");
      },
      "8": function () {
        document.getElementById('backspace').click();
        animationButton("backspace");
      },
      "111": function () {
        document.getElementById('division').click();
        animationButton("division");
      },
      "106": function () {
        document.getElementById('multiplication').click();
        animationButton("multiplication");
      },
      "109": function () {
        document.getElementById('minus').click();
        animationButton("minus");
      },
      "107": function () {
        document.getElementById('plus').click();
        animationButton("plus");
      },
      "13": function () {
        document.getElementById('equal').click();
        animationButton("equal");
      },
      "110": function () {
        document.getElementById('point').click();
        animationButton("point");
      },
    };

    function createHistoryElem() {
      var text;

      if (historyList.querySelector(".historyText")) {
        historyTextClone = historyList.querySelector(".historyText").cloneNode(false);
        historyTextClone.innerHTML = historyList.querySelector(".historyText").innerHTML;
        historyList.querySelector(".historyText").remove();
      }

      if (!delHistoryButton.style.display) {
        delHistoryButton.style.display = "block";
      }

      console.log(solveString.innerHTML)

      if (solveString.innerHTML) {
        text = solveString.innerHTML;
      } else {
        text = x + " " + document.getElementById(activeOperator).innerHTML + " " + y;
      }

      var historyElem = {
        x: x,
        y: y,
        activeOperator: activeOperator,
        solve: text,
        answer: answer.innerHTML
      }

      historyArr.push(historyElem);

      var div = document.createElement("div");
      div.setAttribute("data-id", historyArr.length - 1)
      div.classList.add("historyElem", "clearfix");
      var spanSolve = document.createElement("span");
      spanSolve.classList.add("solveString");
      spanSolve.innerHTML = historyElem.solve;
      var spanAnswer = document.createElement("span");
      spanAnswer.classList.add("answer");
      spanAnswer.innerHTML = historyElem.answer;
      div.appendChild(spanSolve);
      div.appendChild(spanAnswer);
      historyList.insertBefore(div, historyList.firstChild);
    }

    function float(answer, x, y) {
      var count = yLength = xLength = 0;

      if (x < 1 && x > -1) {
        if (x > 0) {
          while (x < 1) {
            x = x * 10;
            count++;
          }
          xLength = count;
        }

        if (x < 0) {
          while (x > -1) {
            x = x * 10;
            count++;
          }
        }
        xLength = count;
      }

      if (y < 1 && y > -1) {
        count = 0;

        if (y > 0) {
          while (y < 1) {
            y = y * 10;
            count++;
          }
          yLength = count;
        }

        if (y < 0) {
          while (y > -1) {
            y = y * 10;
            count++;
          }
          yLength = count;
        }
      }

      if (yLength == 0 && xLength == 0) {
        return answer;
      }

      if (yLength >= xLength) {
        return parseFloat(answer).toFixed(yLength);
      }

      if (xLength >= yLength) {
        return parseFloat(answer).toFixed(xLength);
      }
    }

function addSolveString(text) {
  if (answer.innerHTML == "Limit is exceeded") {
    return false;
  }

  var text = solveString.innerHTML + text;

  if (text.length > 34) {
    text = "..." + text.substring(text.length - 34);
  }

  solveString.innerHTML = text;
}

function animationButton(id) {
  document.getElementById(id).style.backgroundColor = "#B8B8B8";
  setTimeout (function () {
    document.getElementById(id).style.backgroundColor = "";
  }, 100);
}

window.onclick = function (e) {
  var target = e.target;

  if (target.hasAttribute("data-memory-operator")) {
    sortingObj.dataMemoryOperator(target.getAttribute("data-memory-operator"));
    return false;
  }

  if (target.classList.contains("historyElem")) {

    nextActivOperator = delCount = null;
    shiftOperator = false;

    var obj = historyArr[target.getAttribute("data-id")];

    x = obj.x;
    y = obj.y;
    activeOperator = obj.activeOperator;
    solveString.innerHTML = obj.solve;
    answer.innerHTML = obj.answer;

    historyOpenClose();

    return false;
  }

  if (target == delHistoryButton) {
    delHistoryButton.style.display = "";
    historyList.innerHTML = "";
    historyList.appendChild(historyTextClone);
    historyArr = [];
    return false;
  }

  if (target == delHistoryButton) {
    delMemoryButton.style.display = "";
    memoryList.innerHTML = "";
    memoryList.appendChild(memoryTextClone);
    memoryArr = [];
    return false;
  }

  if (target.getAttribute("id") == "historyButton") {
    historyOpenClose();
  }

  if (target.getAttribute("id") == "openMemory") {
    memoryOpenClose()
    memoryButtonNotActive();
  }

  if (target.className == "numbers") {

    if (shiftOperator) {
      answer.innerHTML = "";
      shiftOperator = false;
    }

    if (activeOperator && !delCount) {
      answer.innerHTML = "";
      delCount = true;
    }

    if (answer.innerHTML == "0") {
      answer.innerHTML = "";
    }

    if (answer.innerHTML.length > 15) {
      return false;
    }

    answer.innerHTML += target.innerHTML;
  }

  if (target.hasAttribute("data-operator")) {

      if (target.getAttribute("data-operator") != "equal") {

        if (isNaN(solveString.innerHTML.charAt(solveString.innerHTML.length - 1)) &&
        solveString.innerHTML.charAt(solveString.innerHTML.length - 1) != target.innerHTML) {
          solveString.innerHTML = solveString.innerHTML.substring(0, solveString.
            innerHTML.length - 1);
          addSolveString(target.innerHTML);
          activeOperator = target.getAttribute("data-operator");
          return false;
        }

        if (activeOperator && solveString.innerHTML) {
          var nextActivOperator = target.getAttribute("data-operator");
          callEqual = true;
          operatorsList.equal(activeOperator, nextActivOperator);
          addSolveString(" " + target.innerHTML);
          shiftOperator = true;
          return false;
        }

        x = parseFloat(answer.innerHTML);
        addSolveString(" " + answer.innerHTML + " " + target.innerHTML);
        activeOperator = target.getAttribute("data-operator");

      }

      shiftOperator = true;

      if (target.getAttribute("data-operator") == "equal") {
        operatorsList.equal(activeOperator);
        return false;
      }
  }

  if (target.hasAttribute("strings-operator")) {
    sortingObj.stringsOperator(target.getAttribute("strings-operator"));
  }
};

window.onkeydown = function (e) {
  sortingObj.keyPress(e.keyCode);
};

var addytionallyButtons = document.querySelector(".addytionallyButton");
addytionallyButtons.className = "addytionallyButtonNotActive";

var memoryButtons = document.getElementsByClassName("memoryButton")[0];

function memoryButtonNotActive() {
  if(memoryList.querySelector(".memoryText")) {
    memoryButtons.children[0].className = "memoryButtonNotActive";
    memoryButtons.children[1].className = "memoryButtonNotActive";
  } else {
    memoryButtons.children[0].className = "memoryButtonDIV";
    memoryButtons.children[1].className = "memoryButtonDIV";
  }

  if (memoryList.style.display == "block") {
    for (var i = 0; i < memoryButtons.children.length - 1; i++) {
      memoryButtons.children[i].className = "memoryButtonNotActive";
    }
  } else {
    for (var i = 0; i < memoryButtons.children.length - 1; i++) {
      memoryButtons.children[i].className = "memoryButtonDIV";
    }
  }
}

function historyOpenClose() {
  if (historyList.style.display) {
    historyList.style.display = "";
    delHistory.style.display = "";
  } else {
    historyList.style.display = "block";
    delHistory.style.display ="block";
  }
}

function memoryOpenClose() {
  if (memoryList.style.display) {
    memoryList.style.display = "";
    delMemory.style.display = "";
  } else {
    memoryList.style.display = "block";
    delMemory.style.display ="block";
  }
}

memoryButtonNotActive();

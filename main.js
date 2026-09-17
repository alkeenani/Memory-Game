//? DOM Elements

const splashScreen = document.querySelector(".splach-screen"),
  inputUser = document.querySelector(".splach-screen .Inputs input"),
  startBtn = document.querySelector(".splach-screen .Inputs div"),
  userName = document.querySelector(".UserName span"),
  countdownTimer = document.querySelector(".countdown-timer"),
  newGameBtn = document.querySelector(".new-game"),
  resetGameBtn = document.querySelector(".rest-game"),
  rank = document.querySelector(".rank");

let wrongTries = document.querySelector(".wrong-number span");

let Arr = [];

function addPlayerInfo(UserName, WrongTries) {
  let result = GameOver ? `Time Out${WrongTries}` : WrongTries;

  const info = {
    userName: UserName,
    wrongTries: result,
  };

  let palyer = Arr.find((e) => e.userName === UserName);

  if (palyer) {
    palyer.wrongTries = result;
  } else {
    Arr.push(info);
  }

  setInfoInlocal();
}

function setInfoInlocal() {
  window.localStorage.setItem("info", JSON.stringify(Arr));
}

function getInfoInlocal() {
  rank.innerHTML = "";

  let data = localStorage.getItem("info");

  if (data) {
    let information = JSON.parse(data);

    Arr = information;

    information.forEach((e) => {
      let divRank = document.createElement("div"),
        usreRank = document.createElement("h2"),
        wrongRank = document.createElement("span");

      rank.appendChild(divRank);

      divRank.append(usreRank, wrongRank);

      usreRank.textContent = e.userName;
      wrongRank.textContent = e.wrongTries;
    });
  }
}

//? Game State

let savedUserName = localStorage.getItem("UserName");

let countdownInterval = 0,
  matchedPairs = 0,
  GameOver = false;

//? User Setup

if (localStorage.getItem("Wrong")) {
  wrongTries.textContent = localStorage.getItem("Wrong");
}

if (savedUserName) {
  inputUser.style.display = "none";
  userName.textContent = savedUserName;
} else {
  inputUser.style.display = "block";
}

startBtn.addEventListener("click", () => {
  if (savedUserName) {
    userName.textContent = savedUserName;
  } else if (inputUser.value === "") {
    userName.textContent = "Unknown";
  } else {
    userName.textContent = inputUser.value;

    localStorage.setItem(`UserName`, userName.innerHTML);
  }

  document.getElementById("startGame").currentTime = 0;
  document.getElementById("startGame").play();

  splashScreen.style.display = "none";

  getInfoInlocal();

  showCards();

  clearInterval(countdownInterval);

  startCountdown(300);
});

addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    startBtn.click();
  }
});

//? Game Setup

const allCards = document.querySelector(".game-cards");

const blocks = Array.from(allCards.children);

const cardsCount = [...Array.from(allCards.children).keys()];

randomize(blocks);

applyCardOrder();

blocks.forEach((block) => {
  block.addEventListener("click", () => {
    flipCard(block);
  });
});

//? Card Functions

function randomize(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);

    current--;

    temp = array[current];

    array[current] = array[random];

    array[random] = temp;
  }

  return array;
}

function applyCardOrder() {
  blocks.forEach((block, index) => {
    block.style.order = cardsCount[index];
  });
}

function flipCard(targetBlock) {
  if (targetBlock.classList.contains("is-match") || GameOver) {
    return;
  }

  targetBlock.classList.add("is-flipped");

  let flippedBlocks = blocks.filter((block) =>
    block.classList.contains("is-flipped"),
  );

  if (flippedBlocks.length === 2) {
    disableCardClick();

    checkMatch(flippedBlocks[0], flippedBlocks[1]);
  }
}

//? Match Functions

function disableCardClick() {
  allCards.classList.add("noClick");

  setTimeout(() => {
    allCards.classList.remove("noClick");
  }, 1000);
}

function checkMatch(firstCard, secondCard) {
  if (firstCard.dataset.technology === secondCard.dataset.technology) {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");

    document.getElementById("success").currentTime = 0;
    document.getElementById("success").play();

    firstCard.classList.add("is-match");
    secondCard.classList.add("is-match");

    matchedPairs++;

    checkWin();

    console.log(matchedPairs);
  } else {
    setTimeout(() => {
      wrongTries.textContent = Number(wrongTries.textContent) + 1;

      localStorage.setItem("Wrong", wrongTries.textContent);

      if (!GameOver) {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");

        document.getElementById("fail").currentTime = 0;
        document.getElementById("fail").play();
      }
    }, 1000);
  }
}

//? Game Controls

function checkWin() {
  if (matchedPairs === blocks.length / 2) {
    document.getElementById("Win").currentTime = 0;
    document.getElementById("Win").play();

    rank.innerHTML = "";

    addPlayerInfo(userName.textContent, wrongTries.textContent);

    clearInterval(countdownInterval);

    getInfoInlocal();
  }
}

//? New Game

newGameBtn.addEventListener("click", () => {
  clearInterval(countdownInterval);

  blocks.forEach((block) => {
    if (
      block.classList.contains("is-match") ||
      block.classList.contains("is-flipped")
    ) {
      block.classList.remove("is-match");
      block.classList.remove("is-flipped");
    }
  });

  GameOver = false;

  allCards.classList.remove("CountdownEnd");

  matchedPairs = 0;

  inputUser.value = "";

  wrongTries.innerHTML = 0;

  localStorage.removeItem("Wrong");
  localStorage.removeItem("UserName");

  savedUserName = null;

  randomize(blocks);

  applyCardOrder();

  inputUser.style.display = "block";

  splashScreen.style.display = "block";
});

//? Show Cards

function showCards() {
  blocks.forEach((block) => {
    block.classList.add("is-flipped");
  });

  setTimeout(() => {
    blocks.forEach((block) => {
      block.classList.remove("is-flipped");
    });
  }, 800);
}

//? Reset Game

// resetGameBtn.addEventListener("click", () => {
//   localStorage.clear();
//   wrongTries.innerHTML = 0;
//   savedUserName = null;
//   inputUser.value = "";
//   rank.innerHTML = "";
//   inputUser.style.display = "block";
//   splashScreen.style.display = "block";

//   if (inputUser.value === "") {
//     userName.textContent = "Unknown";
//   } else {
//     userName.textContent = inputUser.value;
//   }
// });

//? Countdown

function startCountdown(duration) {
  let minutes, seconds;

  countdownInterval = setInterval(() => {
    if (matchedPairs < blocks.length / 2) {
      minutes = Math.floor(duration / 60);

      seconds = Math.floor(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;

      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownTimer.textContent = `${minutes} : ${seconds}`;
    }

    if (--duration < 0) {
      clearInterval(countdownInterval);

      GameOver = true;

      addPlayerInfo(userName.textContent, wrongTries.textContent);

      getInfoInlocal();

      allCards.classList.add("CountdownEnd");

      document.getElementById("GameOver").currentTime = 0;
      document.getElementById("GameOver").play();

      Array.from(allCards.children).forEach((block) => {
        block.classList.add("is-flipped");
      });
    }
  }, 1000);
}

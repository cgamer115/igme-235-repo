window.onload = ()=>{
  document.querySelector("#highscore").innerHTML = `HighScore: ${highScore}`;
  initBoard(deck);
}
const numCards = 12;
let gameEnded = false;
let gameFinished = false;
let highScore = localStorage.getItem("highScore") || 0;
highScore = parseInt(highScore);
let callCount = 1;
let levelCount = 1;
let totalClicks = 0;
 
// 6 pairs of cards in the initial deck
let deck = [
  'cardR01C01', 'cardR01C01',
  'cardR03C03', 'cardR03C03',
  'cardR04C01', 'cardR04C01',
  'cardR01C12', 'cardR01C12',
  'cardR02C11', 'cardR02C11',
  'cardR03C12', 'cardR03C12',
];

let deck2 = [
 'cardR01C02', 'cardR01C02',
 'cardR03C02', 'cardR03C02',
 'cardR04C03', 'cardR04C03',
 'cardR01C11', 'cardR01C11',
 'cardR02C01', 'cardR02C01',
 'cardR02C13', 'cardR02C13',
]

let deck3 = [
  'cardR01C03', 'cardR01C03',
  'cardR02C03', 'cardR02C03',
  'cardR04C02', 'cardR04C02',
  'cardR03C01', 'cardR03C01',
  'cardR02C02', 'cardR02C02',
  'cardR02C12', 'cardR02C12',
]

let clicks = 0;
let lives = {value: 4};
let livesLost = { value: 0 };
let score = { value: 0 };
let gameOp = new Opponent(score);
let timer;

function initBoard(gameDeck){
  // here we pass array.sort() a *compare function* that returns a random number
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  gameDeck.sort(()=>{ return 0.5 - Math.random() }); // randomize the deck

  // in this loop we clone the existing card on the page 11 times
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
  for(let i=0; i<numCards; i++){
    let newCard = document.querySelector(".cardtemplate").cloneNode(true);
    newCard.classList.remove("cardtemplate");
    newCard.classList.add("card");
    document.querySelector("#cards").appendChild(newCard);
  }

  /* Now position the cards on the table, and assign a face: */
  let cards = document.querySelectorAll("#cards > .card");
  let index = 0; // we need this for positioning
    
  // loop through all of the card elements and assign a face to each card
  for (let element of cards){
    let x = (element.offsetWidth  + 20) * (index % 4);
    let y = (element.offsetHeight + 20) * Math.floor(index / 4);
    element.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";

    // get a pattern from the shuffled deck
    let pattern = gameDeck.pop();

    // visually apply the pattern on the card's back side.
    // we do this by adding a class through the .classList property
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    element.querySelector(".back").classList.add(pattern);

    // embed the pattern data into the DOM element.
    // this is an example of HTML5 Custom Data attributes
    // http://html5doctor.com/html5-custom-data-attributes/
    element.setAttribute("data-pattern",pattern);

    // listen for the click event on each card <div> element.
    element.onclick = cardClicked;
    index ++;
  }
  //gameEnd();
}

function cardClicked() {
  // we do nothing if there are already two cards flipped.
  if (document.querySelectorAll(".card-flipped")){
  clicks++;
  document.querySelector("#clicks").innerHTML = `Clicks: ${clicks}`;
  }

  if (document.querySelectorAll(".card-flipped").length > 1) return;
     
    // inside of an event handling function, 'this' is the element that called the function
    this.classList.add("card-flipped");

    // check the pattern of both flipped card 0.7s later.    
    if (document.querySelectorAll(".card-flipped").length == 2) {
      // setTimeout() is used to schedule the execution a piece of code *once*
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
      setTimeout(checkPattern, 700);
    }
}

function checkPattern() {

  if (isSamePattern()) {
  // here we are using array.forEach(), rather than for...of, for no particular reason :-)
    document.querySelectorAll(".card-flipped").forEach((element)=>{
    element.classList.remove("card-flipped");
    element.classList.add("card-removed");
    element.addEventListener("transitionend",removeMatchedCards);
  });
  } else {
    decreaseLives();
    // I prefer array.forEach() over for...of when I can write it as a "one-liner"
    document.querySelectorAll(".card-flipped").forEach((element)=>{element.classList.remove("card-flipped")});
  }
}

function isSamePattern() {
  let cards = document.querySelectorAll(".card-flipped");
  // the dataset object holds the .data-pattern property we created for each card in initBoard()
  let pattern1 = cards[0].dataset.pattern;
  let pattern2 = cards[1].dataset.pattern;
  return pattern1 == pattern2;
}

function removeMatchedCards(){
  // another .forEach() "one-liner"
  document.querySelectorAll(".card-removed").forEach((element)=>{element.parentNode.removeChild(element);});

  if (document.querySelector("#cards").children.length == 0 && !gameEnded && !gameFinished)
  {
    gameEnded = true;
    console.log("Done here!");
    gameEnd();
  }
}


//Timer
let start = Date.now();
let duration = 120;
 
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
 
function tick() {
  let elapsed = (Date.now() - start) / 1000;
  let remaining = Math.max(0, duration - elapsed);
 
  if (remaining > 0)
  {
    if (remaining > duration * (2 / 3))
    {
      document.querySelector("#timer").innerHTML = `Time: ${formatTime(remaining)} <img src="images/super-mushroom.png">`;
    }
    else if (remaining > duration * (1/3))
    {
      document.querySelector("#timer").innerHTML = `Time: ${formatTime(remaining)} <img src="images/super-mushroom-2.png">`;
    }
    else
    {
      document.querySelector("#timer").innerHTML = `Time: ${formatTime(remaining)} <img src="images/super-mushroom-3.png">`;
    }
    timer = requestAnimationFrame(tick);
  } 
  else
  {
    document.querySelector("#cards").innerHTML = `Game Over`;
    document.querySelector("#timer").innerHTML = `Time's up! <img src="images/poison-mushroom.png">`;
    document.querySelector("#lives").innerHTML = "";
    gameOver();
  }

  if (gameFinished)
  {
    cancelAnimationFrame(timer);
    document.querySelector("#timer").innerHTML = `Final Time: ${formatTime(remaining)} <img src="images/super-mushroom.png">`;
  }
}
tick();

function decreaseLives()
{
  if (lives.value == 4)
  {
    lives.value--;
    livesLost.value++;
    document.querySelector("#lives").innerHTML = `<img src="images/heart.webp">
    <img src="images/heart.webp">
    <img src="images/heart.webp">`;
  }
  else if (lives.value == 3)
  {
    lives.value--
    livesLost.value++;
    document.querySelector("#lives").innerHTML = `<img src="images/heart.webp">
    <img src="images/heart.webp">`;
  }
  else if (lives.value == 2)
  {
    lives.value--
    livesLost.value++;
    document.querySelector("#lives").innerHTML = `<img src="images/heart.webp">`;
  }
  else if (lives.value == 1)
  {
    document.querySelector("#lives").innerHTML = "";
    duration = 0;
    document.querySelector("#cards").innerHTML = "Game over";
    /*
    document.querySelector("#clicks").innerHTML = `Total Clicks: ${totalClicks}`;
    document.querySelector("#score").innerHTML = `Final Score: ${score.value}`;
    if (score.value > highScore)
    {
      highScore = score.value
      localStorage.setItem("highScore", highScore);
      document.querySelector("#highscore").innerHTML = `HighScore: ${highScore}`;
    }
    */
    gameOver();
  }
}

function gameEnd()
{
  gameEnded = true;
  score.value += (clicks * 10) - livesLost.value * 5;
  gameOp.addScore();
  duration = 0;
  document.querySelector("#score").innerHTML = `Score: ${score.value}`;
  /*
  if (score.value > highScore)
  {
    highScore = score.value
    localStorage.setItem("highScore", highScore);
    document.querySelector("#highscore").innerHTML = `HighScore: ${highScore}`;
  }
  */
  levelCount++;
  nextLevel();
}

function nextLevel()
{
  document.querySelector("#cards").innerHTML = "";
  duration = 120;
  lives.value = 4;
  livesLost.value = 0;
  totalClicks += clicks;
  clicks = 0;
  document.querySelector("#clicks").innerHTML = `Clicks: ${clicks}`;
  document.querySelector("#lives").innerHTML = `<img src="images/heart.webp">
    <img src="images/heart.webp">
    <img src="images/heart.webp">
    <img src="images/heart.webp">`;
  gameEnded = false;
  if (levelCount == 2)
  {
    initBoard(deck2)
  }
  else if (levelCount == 3)
  {
    initBoard(deck3)
  }
  else
  {
    score.value += 1000;
    gameFinished = true;
    document.querySelector("#cards").innerHTML = "You're Winner!"
    /*
    document.querySelector("#clicks").innerHTML = `Total Clicks: ${totalClicks}`;
    document.querySelector("#score").innerHTML = `Final Score: ${score.value}`;
    */
    gameOver();
  }
}

function gameOver()
{
  if (score.value > highScore)
  {
    highScore = score.value
    localStorage.setItem("highScore", highScore);
    document.querySelector("#highscore").innerHTML = `HighScore: ${highScore}`;
  }
  document.querySelector("#clicks").innerHTML = `Total Clicks: ${totalClicks}`;
  document.querySelector("#score").innerHTML = `Final Score: ${score.value}`;
}
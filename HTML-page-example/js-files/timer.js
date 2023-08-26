const assetsPath = 'file:///Users/surajmacbook11/Documents/Dev_UI/Angular%20Training/HTML-page-example/assets/';
const dateTimeElement = document.querySelector('div');
const body = document.querySelector('body');
const startButton = [...document.getElementsByTagName('button')][1];
dateTimeElement.innerText = 'Loading....';
body.style.backgroundImage = `url('${assetsPath}sun-raise-0.jpg')`;
let identifier;

function startTimer() {
  startButton.disabled = true;
  clearInterval(identifier);
  identifier = setInterval(() => {
    const newDate = new Date();
    dateTimeElement.innerText = newDate;
    body.style.backgroundImage = `url('${assetsPath}/sun-raise.gif')`;
  }, 1000);
}

startTimer();

function clearTimer() {
  clearInterval(identifier);
  body.style.backgroundImage = `url('${assetsPath}sun-raise-0.jpg')`;
  startButton.disabled = false;
}

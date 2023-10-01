const assetsPath = 'assets/sun-raise.';
const dateTimeElement = document.querySelector('div');
const body = document.querySelector('body');
const startButton = [...document.getElementsByTagName('button')][1];
dateTimeElement.innerText = 'Loading....';
body.style.backgroundImage = `url('${assetsPath}jpg')`;
let identifier;

function startTimer() {
  startButton.disabled = true;
  clearInterval(identifier);
  body.style.backgroundImage = `url('${assetsPath}gif')`;
  identifier = setInterval(() => {
    const newDate = new Date();
    dateTimeElement.innerText = newDate;
  }, 1000);
}

startTimer();

function clearTimer() {
  clearInterval(identifier);
  body.style.backgroundImage = `url('${assetsPath}jpg')`;
  startButton.disabled = false;
}

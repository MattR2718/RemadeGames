let size = 20;
let snakex = [];
let snakey = [];
let squareSize;
let applex;
let appley;
let highscore = 0;

function grid() {
  background(0);
  noFill();
  strokeWeight(2);
  stroke(255);
  for (var x = 0; x < width; x += round(width / size)) {
    for (var y = 0; y < height; y += round(height / size)) {
      square(x, y, round(width / size));
    }
  }
}

function refreshSnake(x, y) {
  snakex.unshift(x);
  snakex.pop();

  snakey.unshift(y);
  snakey.pop();
}

function resetSnake() {
  for (var i = 0; i <= snakex.length + 1; i++) {
    snakex.pop();
    snakey.pop();
  }
  snakex.push(round(size / 2) - 1);
  snakey.push(round(size / 2) - 1);
}

function snakeMove() {
  switch (keyCode){
    case (UP_ARROW):
      if (snakey[0] - 1 < 0) {
      fail = true
      }
      refreshSnake(snakex[0], snakey[0] - 1);
      break;
    case (DOWN_ARROW):
      if (snakey[0] + 1 > size - 1) {
      fail = true
      }
      refreshSnake(snakex[0], snakey[0] + 1);
      break;
    case (LEFT_ARROW):
      if (snakex[0] - 1 < 0) {
      fail = true
      }
      refreshSnake(snakex[0] - 1, snakey[0]);
      break;
    case (RIGHT_ARROW):
      if (snakex[0] + 1 > size - 1) {
      fail = true
      }
      refreshSnake(snakex[0] + 1, snakey[0]);
      break;
  }
}

let fail = false;
function resetFail() {
  grid();
  fail = false;
  resetSnake();
  keyCode = TAB;
  rate = 7.5;
}

function apple() {
  if (appleEaten) {
    var ok = true;
    do {
      applex = round(random(size - 1));
      appley = round(random(size - 1));
      for (var a = 0; a < snakex.length; a++) {
        if ((applex == snakex[a]) && (appley == snakey[a])) {
          ok = false;
        }
      }
    } while (!ok)
    fill(255, 0, 0);
    circle((applex * squareSize) + (squareSize / 2), (appley * squareSize) + (squareSize / 2), squareSize / 2);
    fill(0, 255, 0);
    appleEaten = false;
  } else {
    fill(255, 0, 0);
    circle((applex * squareSize) + (squareSize / 2), (appley * squareSize) + (squareSize / 2), squareSize / 2);
    fill(0, 255, 0);
  }
}

function overlap() {
  for (var i = 0; i < snakex.length - 2; i++) {
    for (var j = i + 1; j < snakey.length - 1; j++) {
      if ((snakex[i] == snakex[j]) && (snakey[i] == snakey[j])) {
        fail = true;
      }
    }
  }
}

function lengthen() {
  if ((snakex[0] == applex) && (snakey[0] == appley)) {
    snakex.push(snakex[snakex.length - 1]);
    snakey.push(snakey[snakey.length - 1]);
    appleEaten = true;
    rate *= 1.01;
    frameRate(rate);
    print(rate);
  }
}

function highscoreUpdate() {
  if (snakex.length > highscore) {
    fill(0, 0, 255);
    textSize(16);
    text('Highscore: ' + snakex.length, 5, 595);
    highscore = snakex.length;
    fill(0, 255, 0);
  } else {
    fill(0, 0, 255);
    textSize(16);
    text('Highscore: ' + highscore, 5, 595);
    fill(0, 255, 0);
  }

}

function setup() {
  createCanvas(600, 600);
  snakex.push(round(size / 2) - 1);
  snakey.push(round(size / 2) - 1);
  prevx = snakex[0];
  prevy = snakey[0];
  squareSize = round(width / size);
  frameRate(7.5);
  highscoreUpdate();
}

let rate = 7.5;
let appleEaten = true;
function draw() {
  if (fail) {
    background(255, 0, 0);
    setTimeout(resetFail, 1000);
  } else {
    grid();
  }
  fill(0, 255, 0);
  for (var x = 0; x < snakex.length; x++) {
    rect(snakex[x] * squareSize, snakey[x] * squareSize, squareSize);
  }
  overlap();
  apple();
  lengthen();
  if (!fail) {
    snakeMove();
  }
  highscoreUpdate();
}
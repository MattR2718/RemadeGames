var ball = {
  x : 400,
  y : 300,
  size : 20,
  xSpeed : 10,
  ySpeed : 10,
  show : function(){
    fill(255);
    circle(this.x, this.y, this.size);
  },
  update : function(){
    if ((this.x > 800 - this.size) || (this.x <= 0)){
      this.xSpeed *= -1;
    }
    if ((this.y >= 600) || (this.y <= 0)){
      this.ySpeed *= -1;
    }
    if (this.x > 780){
      p1Score++;
      ball.reset();
    }
    if (this.x < 10){
      p2Score++;
      ball.reset();
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  },
  reset : function(){
    this.x = 400;
    this.y = 300;
    reset();
  },
  collide : function(){
    if ((ball.xSpeed == 8) && (ball.ySpeed ==0)){
      x = round(random(0, 11));
      if (x < 5){
        this.ySpeed = -1 * round(random(7, 14));
      } else {this.ySpeed = round(random(7, 14));}
    }
    else if ((ball.y < p1.y - 20) && (ball.x == 40 + 10)){
      if (this.ySpeed < 0){ this.ySpeed = -1 * round(random(7, 14));}
      else { this.ySpeed = round(random(7, 14));    this.xSpeed *= -1;}
    }
    else if ((ball.y > p1.y + 20) && (ball.x == 40 + 10)){
      if (this.ySpeed < 0){ this.ySpeed = round(random(7, 14));}
      else { this.ySpeed = round(random(7, 14));    this.xSpeed *= -1;} 
    }
    
    else if ((ball.y < p2.y - 20) && (ball.x == 760 -10)){
      if (this.ySpeed < 0){ this.ySpeed = -1 * round(random(7, 14));}
      else { this.ySpeed = round(random(7, 14));}
    }
    else if ((ball.y > p2.y + 20) && (ball.x == 760 - 10)){
      if (this.ySpeed < 0){ this.ySpeed = -1 * round(random(7, 14));}
      else { this.ySpeed = round(random(7, 14));}
    }
    
    else if (this.ySpeed <= 0){ this.ySpeed = -1 * round(random(7, 14)); }
    else { this.ySpeed = round(random(7, 14)); }
    this.xSpeed *= -1;
    rally++;
  }
  
};

class paddle{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.length = 100;
    this.width = 20;
  }
  show(){
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.length);
  }
}

function paddleMove(){
  if ((keyIsDown(65)) && (p1.y > 0 + p1.length/2)){
    p1.y -= 7.5;
  }
  if ((keyIsDown(90)) && (p1.y < 600 - p1.length/2)){
    p1.y += 7.5;
  }
  if ((keyIsDown(75)) && (p2.y > 0 + p1.length/2)){
    p2.y -= 7.5;
  }
  if ((keyIsDown(77)) && (p2.y < 600 - p2.length/2)){
    p2.y += 7.5;
  }
}

function checkPaddleCollision(paddleNum){
  if (paddleNum == 1){
    rad = - 10;
    topy = p1.y - 50;
  }
  else { rad = 10; topy = p2.y - 50;}
  
  if ((paddleNum == 1) && (ball.x == 40) && (ball.y >= topy) && (ball.y <= topy + 100)){
    ball.collide();
  }
  else if ((paddleNum == 2) && (ball.x == 760) && (ball.y >= topy) && (ball.y <= topy + 100)){
    ball.collide();
  }
  
}

function showScore(tSize){
  textSize(tSize)
  text(p1Score, 200 - (tSize/2), tSize);
  text(p2Score, 600 - (tSize/2), tSize);
  fill(0, 150, 200);
  textStyle(BOLD);
  text(rally, 5, 50);
  textStyle(NORMAL);
  fill(255);
}

function reset(){
  ball.xSpeed = 8;
  ball.ySpeed = 0;
  p1.y = 300;
  p2.y = 300;
  rally = 0;
}

function resetAll(){
  reset();
  ball.x = 400;
  ball.y = 300;
  p1Score = 0;
  p2Score = 0;
}

let p1 = new paddle(30, 300);
let p2 = new paddle(800 - 30, 300);
let p1Score = 0;
let p2Score = 0;
let rally = 0;
let button;

function setup() {
  createCanvas(800, 600);
  button = createButton('RESTART')
  button.position(0, 600);
  button.mousePressed(resetAll)
  reset();
}

function draw() {
  background(0);
  rect(400, 300, 10, 600);
  showScore(64);
  p1.show();
  p2.show();
  ball.show();
  ball.update();
  paddleMove();
  checkPaddleCollision(1);
  checkPaddleCollision(2);
}

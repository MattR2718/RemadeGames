class brick{
  constructor(x, y, width, height, colour){
    this.x = x;
    this.y = y + 100;
    this.colour = colour;
    this.width = width;
    this.height = height;
  }
  show(){
    switch (this.colour){
      case (0):
        fill(255, 0, 0);
        break;
      case (1):
        fill(255, 100, 0);
        break;
      case (2):
        fill(255, 255, 0);
        break;
      case (3):
        fill(0, 255, 0);
        break;
      case (4):
        fill(0, 255, 255);
        break;
      case (5):
        fill(0, 100, 255);
        break;
      case (6):
        fill(255, 0, 255);
        break;
      default:
        fill(255, 255, 255);
        break;
    }
    rect(this.x, this.y, this.width, this.height);
    fill(255);
  }
  collide(){
    print(ball.x, ball.y);
    //TOP
    if ((ball.y == this.y) && ((ball.x >= this.x) && (ball.x <= this.x + this.width))){
      ball.ySpeed *= -1;
      this.remove();
      return true;
    }
    //BOTTOM
    else if ((ball.y - (ball.size/2) == this.y + this.height) && ((ball.x >= this.x) && (ball.x <= this.x + this.width))){
      ball.ySpeed *= -1;
      this.remove();
      return true;
    }
    //LEFT
    else if ((ball.x == this.x) && ((ball.y >= this.y) && (ball.y <= this.y + this.height))){
      ball.xSpeed *= -1;
      this.remove();
      return true;
    }
    //RIGHT
    else if ((ball.x == this.x + this.width) && ((ball.y >= this.y) && (ball.y <= this.y + this.height))){
      ball.xSpeed *= -1;
      this.remove();
      return true;
    }
    return false;
  }
  remove(){
    colNum++;
    this.x = 1000;
    this.y = 1000;
  }
}

var paddle = {
  x : 325,
  y : 550, 
  show : function(){
    rect(this.x, this.y, 150, 20);
  },
  move : function(){
    if ((keyIsDown(RIGHT_ARROW)) && (this.x < 675)){
      this.x += 15;
    }
    if ((keyIsDown(LEFT_ARROW)) && (this.x > 0)){
      this.x -= 15;
    }
  },
  reset : function(){
    this.x = 325;
    this.y = 550;
  }
}

var ball = {
  x: 400,
  y : 530,
  xSpeed : 10,
  ySpeed : 10,
  size : 20,
  show : function(){
    circle(this.x, this.y, this.size);
  },
  update : function(){
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  },
  collideCheck : function(){    
    if (this.y > 780){
      deathNum ++;
      reset();
    }
    if ((this.y + (this.size/2) == paddle.y) && ((this.x >= paddle.x) && (this.x <= paddle.x + 150))){
      this.ySpeed *= -1;
    }
    
    if ((this.x >= 790) || (this.x <= 10)){
      //print('X');
      this.xSpeed *= -1;
    }
    if (this.y <= 10){
      //print('Y');
      this.ySpeed *= -1;
    }
    
    for (x = 0; x < brickNumX + 1; x++){
      for (y = 0; y < brickNumY + 1; y++){
        bricks[x][y].collide();
      }
    }
    
    for (x = 0; x < brickNumX + 1; x++){
      for (y = 0; y < brickNumY + 1; y++){
        if (bricks[x][y].collide()){
          return;
        }      
      }
    }
  },
  collide : function(){
    this.xSpeed *= -1;
    this.ySpeed *= -1;
  },
  reset : function(){
    this.x = 400;
    this.y = 530;
  }
}

function createArray(widthNum, heightNum){
  widthNum++;
  heightNum++;
  var arr = new Array(widthNum);
  for (i = 0; i < widthNum; i++){
    arr[i] = new Array(heightNum);
  }
  return arr;
}

function showAllBricks(){
  for (x = 0; x < brickNumX + 1; x++){
    for (y = 0; y < brickNumY + 1; y++){
      bricks[x][y].show();
    }
  }
}

function reset(){
  ball.reset();
  paddle.reset();
}

function brickCollide(){
  for (y = 6; y >-1; y--){
    for (x = 0; x < brickNumX; x++){
      if (bricks[x][y].collide()){
        return;
      }
    }
  }
}

function resetAll(){
  reset();
  colNum = 0;
  deathNum = 0;
  for (x = 0; x < brickNumX + 1; x++){
    for (y = 0; y < brickNumY + 1; y++){
      bricks[x][y] = new brick(x*brickWidth, y*brickHeight, brickWidth, brickHeight, y);
      //bricks[x][y].show();
    }
  }
}

let r;
let bricks;
let brickNumX = 10;
let brickNumY = 6;
let brickWidth = 80;
let brickHeight = 20;
let colNum = 0;
let deathNum = 0;

function setup() {
  createCanvas(800, 600);
  r = new brick(0, 0, 1);
  bricks = createArray(brickNumX, brickNumY);
  for (x = 0; x < brickNumX + 1; x++){
    for (y = 0; y < brickNumY + 1; y++){
      bricks[x][y] = new brick(x*brickWidth, y*brickHeight, brickWidth, brickHeight, y);
      //bricks[x][y].show();
    }
  }
  print(bricks);
  frameRate(500);
}

function draw() {
  if (deathNum == 3){ background(255, 0, 0); resetAll();}
  else if (colNum == 70){ background(0, 255, 0);}
  else { background(0);}
  showAllBricks();
  paddle.show();
  paddle.move();
  ball.show();
  ball.update();
  ball.collideCheck();
  //brickCollide();
}
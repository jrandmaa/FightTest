let img, mod;
let theta = 0;
let gradient;
let myShader;
let camTargetX = 0;
let camTargetZ = 100;
let AIEnemy;
let playerFighter;

let floorLevel = 125;
let levelWidth = 800;

let debugModeEnabled = true;

//ref
  //ellipse(this.posx, this.posy - this.img.height/2, 10, 10);


function preload(){

  mod = loadModel('tempBG.obj');
  myShader = loadShader('basic.vert', 'basic.frag');
}

function setup() {
  createCanvas(800, 500, WEBGL);
  // noStroke();
  AIEnemy = new AIFighter(300,floorLevel);
  playerFighter = new PlayerFighter(-300,floorLevel);

   gradient = createGraphics(400, 400, WEBGL);
   gradient.noStroke();
   gradient.push();
   gradient.translate(-200, -200, 0);
  //  gradient.image(img, 0 , 0, 400, 400);
   gradient.shader(myShader);
   gradient.rect(0,0,width, height);
   gradient.pop();
}

function draw() {
  //CAMERA: zoom to fit both characters
  //camtargetx is average of both x values

  if(debugModeEnabled){
    /*ellipse(0, 125, 10, 10);
    ellipse(-levelWidth/2, 125, 10, 10);
    ellipse(levelWidth/2, 125, 10, 10);*/
  }
  
  //move shit to different files so i dont have 800 lines again
  background(0);
  texture(gradient);
  
  camTargetX = -1 *(playerFighter.posx + AIEnemy.posx)/2;
  //camTargetZ = map(AIEnemy.posx - playerFighter.posx, 355,760,30,300);
  //console.log(AIEnemy.posx - playerFighter.posx);
  push();
  rotateX(PI);
  translate(camTargetX, -200, camTargetZ);
  rotateY(PI/2);
  // rect(0,0,width, height);
  //rect(0,0,width, height);
   scale(2.5);
  model(mod);
  pop();
  AIEnemy.display();
  playerFighter.display();
//theta+=0.01;
}

class AIFighter{
  constructor(px,py){
    this.posx = px;
    this.posy = py;
    this.sprite = createSprite();
    this.image = loadImage('Assets/Placeholder/default-character.png');
    this.sprite.addImage(this.image);
  }
  display(){
    
    this.sprite.position.x = this.posx + camTargetX;
    this.sprite.position.y = this.posy;
    
    this.sprite.display();
  }
}

class PlayerFighter{
  frameIndex = 0;
  frameLimit = 30;

  yVelocity = 0;
  dampening = 0.3;
  xAirVelocity = 0;
  airControl = 5;

  constructor(px,py){
    this.posx = px;
    this.posy = py;
    this.sprite = createSprite();
    this.idleImage = loadImage('Assets/Stick/idle.gif');
    this.standingAttackImage = loadImage('Assets/Stick/standing-attack.png');
    this.walkImage = loadImage('Assets/Stick/walk.gif');
    this.walkBackwardsImage = loadImage('Assets/Stick/walk-reverse.gif');
    this.jumpImage = loadImage('Assets/Stick/jump.png');
    //this.walkImage2 = loadImage('Assets/Placeholder/default-player-walk2.png');
    this.sprite.addImage(this.idleImage);
    
  }
  display(){
    
    //if not on ground: 

    if(this.posy < floorLevel){
      this.sprite.addImage(this.jumpImage);
      this.posy -= this.yVelocity;
      this.yVelocity -= this.dampening;
    } else {
      this.posy = floorLevel;
      this.yVelocity = 0;
    }
    
    /*if(this.posy < 100){
      console.log(this.posy);
      this.yVelocity *= -1;
    }*/
    //this.yVelocity -= this.yVelocity*this.dampening;
    //console.log(this.posy);
    if(this.frameIndex > 0){
      this.frameIndex+= 1;
      if(this.frameIndex > 30){
        this.frameIndex = 0;
        this.sprite.addImage(this.idleImage);
      }
    }
    if(this.posy >= floorLevel){
      this.xAirVelocity = 0;
      if (keyIsDown(LEFT_ARROW)){
        this.left();
      } else if (keyIsDown(RIGHT_ARROW)){
        this.right();
      } else if(this.frameIndex == 0){
        this.idle();
      }
    } else {
      this.posx += this.xAirVelocity;
    }
    
    //this.sprite.width = 200;
    this.sprite.position.x = this.posx + camTargetX;
    this.sprite.position.y = this.posy;
    
    this.sprite.display();

    //JUMP: TILT JUMP SPRITE BY DIRECTION BACK/FORWARD
    //CROUCH?
  }

  attack(){
    this.frameIndex = 1;
    this.sprite.addImage(this.standingAttackImage);
  }
  idle(){
    this.sprite.addImage(this.idleImage);
  }
  left(){
    if(this.posx > -levelWidth/2){
      this.posx -=5;
    }
    this.sprite.addImage(this.walkBackwardsImage);
  }
  right(){
    if(this.posx < AIEnemy.posx - AIEnemy.image.width){
      this.posx +=5;
    }
    //this.walkCycle();
    this.sprite.addImage(this.walkImage);
  }
  jump(){
    if(this.posy <= floorLevel){
      if(keyIsDown(LEFT_ARROW)){
        this.xAirVelocity = -this.airControl;
      } else if(keyIsDown(RIGHT_ARROW)){
        this.xAirVelocity = this.airControl;
      }
      this.yVelocity = 10;
      this.sprite.addImage(this.jumpImage);
      this.posy -= this.yVelocity;
    }
    
  }
  
}

function keyPressed(){
  if(keyCode == 88){
    playerFighter.attack();
  }
  else if(keyCode == 90){
    playerFighter.jump();
  }
}


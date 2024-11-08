var ballSizeRatio = 0.05;
var velocityFactor = 30;
var minimumVelocity = 10;
var racketWidthRatio = 0.5;
var racketHeightRatio = 2;
var racketVerticalAcceleration = 5;
var racketFriction = 0.8;

var canvas;
var ball = {x: 0, y: 0, diameter: 5, xVelocity: 0, yVelocity: 0};
var leftRacket = {x: 0, y: 0, width: 98, height: 130, yAcceleration: 0}
var rightRacket = {x: 0, y: 0, width: 98, height: 108, yAcceleration: 0}
var framesSinceLastBallBounce = 0;
var framesSinceLastLeftRacketBounce = 0;
var framesSinceLastRightRacketBounce = 0;
var leftPlayerInput = 0;
var rightPlayerInput = 0;
var debounce = 3;
var ballImg;
var rightRactImg;
var leftRactImg;
var bgImg;
let gameStart = false;
var imgHeight = 40;
var imgWidth = 40;
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var gameOver = false;
var winner = '';
var startButtonImg;
var buttonX, buttonY, buttonWidth, buttonHeight;
let myMusic;
let bonusSound; 
let gifSound; 
let selectedCharacters = ['', ''];
let characterOptions = ['Character 1', 'Character 2', 'Character 3', 'Character 4'];
let characterX, characterY, characterWidth, characterHeight;
let currentSelector = 0;
var showBonusText = false;
var bonusTextTimer = 0;
var countdown = 30;
var startTime;
var pixelFont; 
var ballColor = [255, 241, 115]; 


var bonusZone = {
    x: 0,
    y: 0,
    diameter: 0,
    color: [255, 245, 255, 80] 
};

let gif; 
let showGif = true; 

function preload() {
    bgImg = loadImage('../asset/bg5.gif');
    rightRactImg = loadImage('../asset/right.gif');
    leftRactImg = loadImage('../asset/left.gif');
    startButtonImg = loadImage('../asset/start.png');
    myMusic = loadSound('../asset/music.mp3');
    bonusSound = loadSound('../asset/bonus sound.wav'); 
    gifSound = loadSound('../asset/startsound.wav'); 
    pixelFont = loadFont('../asset/ARCADE.TTF');
    gif = loadImage('../asset/bg4.gif'); 
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight); 
    background(255);
    fill(255,241,115);
    noStroke();
    throwBall();
    buttonWidth = 200;
    buttonHeight = 100;
    buttonX = width / 2 - buttonWidth / 2;
    buttonY = height / 2 + 200;
    backgroundMusic();
    bonusZone.x = width / 2;
    bonusZone.y = 100;
    bonusZone.diameter = ball.diameter;
    startTime = millis();
    textFont(pixelFont); 
    textStyle(BOLD);

    gifSound.play(); 
    setTimeout(() => {
        showGif = false;
        gifSound.stop(); 
    }, 5000); 
}

function backgroundMusic(){
    myMusic.play();
    myMusic.loop();
    myMusic.setVolume(0.5);
    userStartAudio();
}

function draw() {
    clear();
    if (showGif) {
        background(255); 
        image(gif, 0, 0, width, height); 
        return; 
    }
    image(bgImg, width, height);
    if(!gameStart){
      fill(118, 255, 235);
      textSize(45);
      textAlign(CENTER);
      text(`Please press any key to start the game`, width / 2, height / 2);
      textSize(35);
      text(`Put the moon back in its place with Kirby!`, width / 2, height / 2 + 50);
      if(keyIsPressed){
        gameStart = true;
        startTime = millis(); 
      }
      return;
    }
    fill(255, 215, 115);

    var elapsedTime = (millis() - startTime) / 1000;
    countdown = 30 - floor(elapsedTime);
    if (countdown <= 0) {
        gameOver = true;
        winner = leftPlayerScore > rightPlayerScore ? 'Left Player' : 'Right Player';
    }

    if (gameOver) {
        textSize(50);
        fill(118,255,235);
        textAlign(CENTER,CENTER);
        text(`${winner} Wins!`, width / 2, height / 2 - 50);
        if (winner === 'Left Player') {
            image(leftRactImg, width / 2 - imgWidth / 2, height / 2 );
        } else {
            image(rightRactImg, width / 2 - imgWidth / 2, height / 2 );
        }
        image(startButtonImg, buttonX, buttonY, buttonWidth, buttonHeight);
        return;
    }
    
    leftRacket.yVelocity = leftPlayerInput * racketVerticalAcceleration;
    rightRacket.yVelocity = rightPlayerInput * racketVerticalAcceleration;

    leftRacket.y += leftRacket.yVelocity;
    rightRacket.y += rightRacket.yVelocity;

    // Apply friction to the rackets' velocities
    leftRacket.yVelocity *= racketFriction;
    rightRacket.yVelocity *= racketFriction;

    // Ensure the rackets stay within the bounds of the canvas
    leftRacket.y = constrain(leftRacket.y, 0, height - leftRacket.height);
    rightRacket.y = constrain(rightRacket.y, 0, height - rightRacket.height);

    // move rackets
    if(keyIsDown(65) === true) { //A
        leftRacket.yVelocity -= racketVerticalAcceleration;
    } else if(keyIsDown(90) === true){ //Z
        leftRacket.yVelocity += racketVerticalAcceleration;
    } else{
        leftRacket.yVelocity += racketFriction;
    }

    if(keyIsDown(38) === true) { 
        rightRacket.yVelocity -= racketVerticalAcceleration
    } else if(keyIsDown(40) === true){ 
        rightRacket.yVelocity += racketVerticalAcceleration
    }

    //move the ball
    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;

    //check if ball touches border
    if(ball.x < 0){
        rightPlayerScore++;
        throwBall();
    } else if (ball.x > width) {
        leftPlayerScore++;
        throwBall();
    }

    if (framesSinceLastBallBounce > debounce){
        if (ball.y + ball.diameter > leftRacket.y && 
            ball.y - ball.diameter < leftRacket.y + leftRacket.height &&
            ball.x - ball.diameter / 2 < leftRacket.x + leftRacket.width) {
                // theres contact 
                ball.xVelocity = Math.abs(ball.xVelocity) * 5; 
            ball.x = leftRacket.x + leftRacket.width + ball.diameter / 2; 
            framesSinceLastBallBounce = 0;
        } else if (ball.y + ball.diameter / 2 > rightRacket.y &&
            ball.y - ball.diameter / 2 < rightRacket.y + rightRacket.height &&
            ball.x + ball.diameter / 2 > rightRacket.x) {
            ball.xVelocity = -Math.abs(ball.xVelocity) * 1.1; 
            ball.x = rightRacket.x - ball.diameter / 2; 
            framesSinceLastBallBounce = 0;
        }
    }

    // Check for collisions with the rackets
    if (ball.x - ball.diameter / 2 < leftRacket.x + leftRacket.width &&
        ball.x + ball.diameter / 2 > leftRacket.x &&
        ball.y - ball.diameter / 2 < leftRacket.y + leftRacket.height &&
        ball.y + ball.diameter / 2 > leftRacket.y) {
        ball.xVelocity = Math.abs(ball.xVelocity); // Ensure the ball moves right
        ball.yVelocity += leftRacket.yVelocity * 0.2; // Add racket velocity influence
        ball.x = leftRacket.x + leftRacket.width + ball.diameter / 2; // Correct position
    }

    if (ball.x - ball.diameter / 2 < rightRacket.x + rightRacket.width &&
        ball.x + ball.diameter / 2 > rightRacket.x &&
        ball.y - ball.diameter / 2 < rightRacket.y + rightRacket.height &&
        ball.y + ball.diameter / 2 > rightRacket.y) {
        ball.xVelocity = -Math.abs(ball.xVelocity); // Ensure the ball moves left
        ball.yVelocity += rightRacket.yVelocity * 0.2; // Add racket velocity influence
        ball.x = rightRacket.x - ball.diameter / 2; // Correct position
    }

    // Check if the ball hits the top or bottom of the canvas
    if (ball.y - ball.diameter / 2 < 0 || ball.y + ball.diameter / 2 > height) {
        ball.yVelocity *= -1;
    }

   
    noFill();
    stroke(217, 229, 0);
    strokeWeight(6);
    drawingContext.setLineDash([5, 12]);
    ellipse(bonusZone.x, bonusZone.y, bonusZone.diameter);
    noStroke();
    drawingContext.setLineDash([]); // Reset the dash setting

    if (dist(ball.x, ball.y, bonusZone.x, bonusZone.y) < ball.diameter / 2) {
        if (ball.xVelocity > 0) { 
            rightPlayerScore += 2;
        } else { 
            leftPlayerScore += 2;
        }
       bonusSound.play();
       throwBall();
        showBonusText = true;
        bonusTextTimer = frameCount;
        ballColor = [217, 229, 0]; 
    }

    //draw the ball
    fill(217, 229, 0); 
    circle(ball.x, ball.y, ball.diameter);

    // draw racket
    image(leftRactImg, leftRacket.x, leftRacket.y);
    image(rightRactImg, rightRacket.x, rightRacket.y);
    
    // display the score
    textSize(80);
    fill(224, 221, 1);
    textAlign(CENTER, CENTER);
    text(leftPlayerScore, width * 0.25, 50);
    text(rightPlayerScore, width * 0.75, 50);

    // Clock
    textSize(60);
    textAlign(CENTER, CENTER);
    if (countdown <= 5) {
        fill(255, 54, 113);
        var shake = random(-5, 5); 
        text(`Time: ${countdown}`, width / 2 + shake, 50 + shake);
    } else {
        fill(225, 225, 200);
        text(`Time: ${countdown}`, width -1550, 50);
    }

    // extra point
    if (showBonusText) {
        textSize(40);
        fill(255, 255, 0);
        textAlign(CENTER, CENTER);
        text("Extra 2 points!", width / 2, height / 2);
        if (frameCount - bonusTextTimer > 60) {
            showBonusText = false;
        }
    }
}

function keyPressed(event) {
    switch(event.keyCode) {
        case 65: 
            leftPlayerInput = -1;
            break;
        case 90: 
            leftPlayerInput = 1;
            break;
        case 38:
            rightPlayerInput = -1;
            break;
        case 40:
            rightPlayerInput = 1;
            break;
    }
}

function keyReleased(event) {
    switch(event.keyCode)
    {
        case 65: 
        case 90: 
            leftPlayerInput = 0;
            break;
        case 38:
        case 40:
            rightPlayerInput = 0;
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    throwBall();
}

function throwBall() {
    ball.x = width / 2;
    ball.y = height / 2;
    ball.diameter = width * ballSizeRatio;

    var randomXVelocity = Math.random() > 0.5 ? -1 : 1; 
    var randomYVelocity = Math.random() > 0.5 ? -1 : 1;

    ball.xVelocity = randomXVelocity * Math.max(Math.random() * width / (velocityFactor * 2), minimumVelocity);
    ball.yVelocity = randomYVelocity * Math.max(Math.random() * ball.xVelocity * (canvas.height / canvas.width * 0.9), minimumVelocity * canvas.height / canvas.width * 0.1);

    leftRacket.width = rightRacket.width = canvas.width / 20;
    leftRacket.height = rightRacket.height = canvas.height / 4;

    leftRacket.y = rightRacket.y = canvas.height / 2 - leftRacket.height / 2;
    leftRacket.x = 0;
    rightRacket.x = canvas.width - rightRacket.width;

    // 更新额外得分区域的直径
    bonusZone.diameter = ball.diameter;

    // 重置球的颜色为默认颜色
    ballColor = [255, 241, 115]; 
}

function checkGameOver() {
    if (leftPlayerScore >= 10) {
        gameOver = true;
        winner = 'Left Player';
    } else if (rightPlayerScore >= 10) {
        gameOver = true;
        winner = 'Right Player';
    }
}

function mousePressed() {
    if (gameOver && mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        // Reset the game
        leftPlayerScore = 0;
        rightPlayerScore = 0;
        gameOver = false;
        gameStart = false;
        throwBall();
    }
}

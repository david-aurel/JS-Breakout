// canvas
const canvas = document.getElementById("myCanvas"),
      ctx    = canvas.getContext("2d");

// variables for all sorts of stuff
let x                = canvas.width / 2,
    y                = canvas.height - 30,
    dx               = 5,
    dy               = -5,
    ballRadius       = 10,
    paddleHeight     = 10,
    paddleWidth      = 75,
    paddleX          = (canvas.width - paddleWidth) / 2,
    rightPressed     = false,
    leftPressed      = false,
    brickRowCount    = 3,
    brickColumnCount = 5,
    brickWidth       = 63,
    brickHeight      = 10,
    brickPadding     = 25,
    brickOffsetTop   = 50,
    brickOffsetLeft  = 30,
    score            = 0,
    lives            = 3

    var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// key pressing
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > brickOffsetLeft && relativeX < canvas.width-brickOffsetLeft) {
        paddleX = relativeX - paddleWidth/2;
    }
}

// collision detection for the bricks
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score ++
                    if (score === brickColumnCount*brickRowCount) {
                        alert('You won!')
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// draw the score text box
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

// draw the lives textbox
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

// draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// draw the bricks
function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = "#0095DD"
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

//draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBall()
    drawPaddle()
    drawBricks()
    collisionDetection()
    drawScore()
    drawLives()
    //animate it
    x += dx;
    y += dy;
    //collision detection with the sides of the canvas and the paddle
    if (y + dy < ballRadius) {
        dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 5;
                dy = -5;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    } else if ((x + dx < ballRadius) || (x + dx > canvas.width - ballRadius)) {
        dx = -dx
    }
    //moving the paddle
    if(rightPressed) {
        paddleX += 10;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    } else if(leftPressed) {
        paddleX -= 10;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}

// set interval to rerun draw every 10ms
draw()
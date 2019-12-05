
var score;
var holeCollided;
var lastHoleId;

function resetScore() {
    score = 0;
    holeCollided = false;
    lastHoleId = 0;
    document.querySelector('#score').textContent = score;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function MyRectangle(rect) {
    this.left = rect.left;
    this.right = rect.right;
    this.top = rect.top;
    this.bottom = rect.bottom;

    this.NE_corner = new Point(rect.right, rect.top);
    this.SE_corner = new Point(rect.right, rect.bottom);
    this.SW_corner = new Point(rect.left, rect.bottom);
    this.NW_corner = new Point(rect.left, rect.top);

    this.N_middlepoint = new Point((rect.left + rect.right)/2, rect.top)
    this.E_middlepoint = new Point(rect.right, (rect.top + rect.bottom)/2);
    this.S_middlepoint = new Point((rect.left + rect.right)/2, rect.bottom);
    this.W_middlepoint = new Point(rect.left, (rect.top + rect.bottom)/2);
}

function InscribedCircle(square) {
    this.center = new Point((square.left + square.right) / 2, (square.top + square.bottom) / 2)
    this.radius = (square.right - square.left) / 2
}

function distance(point1, point2) {
    dx = point2.x - point1.x;
    dy = point2.y - point1.y;
    return Math.sqrt(dx**2 + dy**2)
}

function detectCollision() {
    var birdBox = bird.getBoundingClientRect();
    var birdCircle = new InscribedCircle(birdBox);
    var pipes = document.querySelectorAll('.moving');

    for (i = 0; i < pipes.length; i++) {
        var top = pipes[i].firstElementChild;
        var bottom = pipes[i].lastElementChild;
        var hole = pipes[i].children[1];

        var top_head = top.lastElementChild;
        var top_body = top.firstElementChild;

        var bottom_head = bottom.firstElementChild;
        var bottom_body = bottom.lastElementChild;

        var topPipeHeadBox = new MyRectangle(
            top_head.getBoundingClientRect()
        );
        var bottomPipeHeadBox = new MyRectangle(
            bottom_head.getBoundingClientRect()
        );
        var topPipeBodyBox = top_body.getBoundingClientRect();
        var bottomPipeBodyBox = bottom_body.getBoundingClientRect();
        var holeBox = hole.getBoundingClientRect();
        
        var topHeadCollision = circleRectangleCollision(birdCircle, topPipeHeadBox);
        var topBodyCollision = rectangleRectangleCollision(birdBox, topPipeBodyBox);

        var bottomHeadCollision = circleRectangleCollision(birdCircle, bottomPipeHeadBox);
        var bottomBodyCollision = rectangleRectangleCollision(birdBox, bottomPipeBodyBox);

        var holeCollision = rectangleRectangleCollision(birdBox, holeBox);

        if (topHeadCollision || topBodyCollision || bottomHeadCollision || bottomBodyCollision || birdOutOfScreen()) {
            playCrashSound();
            endGame();
            break;
        }
        else if (holeCollision) {
            holeCollided = true;
            lastHoleId = hole.id;
        }
        else if (holeCollided && hole.id == lastHoleId) {
            holeCollided = false;
            score++;
            playScoreSound();
            document.querySelector('#score').textContent = score;
        }
    }

}

function circleRectangleCollision(circle, rectangle) {
    
    cornerCollision = (distance(circle.center, rectangle.NE_corner) <= circle.radius ||
                       distance(circle.center, rectangle.SE_corner) <= circle.radius ||
                       distance(circle.center, rectangle.SW_corner) <= circle.radius ||
                       distance(circle.center, rectangle.NW_corner) <= circle.radius);

    middlepointCollision = (distance(circle.center, rectangle.N_middlepoint) <= circle.radius || 
                            distance(circle.center, rectangle.E_middlepoint) <= circle.radius ||
                            distance(circle.center, rectangle.S_middlepoint) <= circle.radius ||
                            distance(circle.center, rectangle.W_middlepoint) <= circle.radius);
    
    return cornerCollision || middlepointCollision;
}

function rectangleRectangleCollision(rectangle1, rectangle2) {
    return !(rectangle1.right <= rectangle2.left ||
             rectangle1.left >= rectangle2.right ||
             rectangle1.bottom <= rectangle2.top ||
             rectangle1.top >= rectangle2.bottom);
}

function birdOutOfScreen() {
    return (bird.offsetTop + moveBirdBy.currentDy > window.innerHeight)
        || (bird.offsetTop + moveBirdBy.currentDy < 0);
}
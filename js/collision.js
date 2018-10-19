
var score;
var holeCollided;
var lastHoleId;

function resetScore() {
    score = 0;
    holeCollided = false;
    lastHoleId = 0;
    document.querySelector('#score').textContent = score;
}

function detectCollision() {
    var birdBox = bird.getBoundingClientRect();
    var pipes = document.querySelectorAll('.moving');

    for (i = 0; i < pipes.length; i++) {
        var top = pipes[i].firstElementChild;
        var bottom = pipes[i].lastElementChild;
        var hole = pipes[i].children[1];

        var topPipeBox = top.getBoundingClientRect();
        var bottomPipeBox = bottom.getBoundingClientRect();
        var holeBox = hole.getBoundingClientRect();

        var topCollision = collidesWith(birdBox, topPipeBox);

        var bottomCollision = collidesWith(birdBox, bottomPipeBox);

        var holeCollision = collidesWith(birdBox, holeBox);

        if (topCollision || bottomCollision || birdOutOfScreen()) {
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

function collidesWith(first, second) {
    return !(first.right <= second.left ||
             first.left >= second.right ||
             first.bottom <= second.top ||
             first.top >= second.bottom);
}

function birdOutOfScreen() {
    return (bird.offsetTop + moveBirdBy.currentDy > window.innerHeight)
        || (bird.offsetTop + moveBirdBy.currentDy < 0);
}
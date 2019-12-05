
// Per un'introduzione a modello vuoto, vedere la seguente documentazione:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";
    
    var app = WinJS.Application;
    //var activation = Windows.ApplicationModel.Activation;

    /**
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: questa applicazione è stata appena avviata. Inizializzare
                // l'applicazione qui.
            } else {
                // TODO: questa applicazione è stata riattivata dalla sospensione.
                // Ripristinare lo stato dell'applicazione qui.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };
    **/
    
    app.onactivated = function (args) {
        args.setPromise(WinJS.UI.processAll());
    };

    app.oncheckpoint = function (args) {
        // TODO: questa applicazione sta per essere sospesa. Salvare qui eventuali stati
        // che devono persistere attraverso le sospensioni. È possibile utilizzare l'oggetto
        // WinJS.Application.sessionState, che viene automaticamente
        // salvato e ripristinato in seguito a sospensioni. Se è necessario eseguire
        // un'operazione asincrona prima che l'applicazione venga sospesa, chiamare
        // args.setPromise().
    };

    app.start();

})();

var progressiveHoleId = 0;
function addPipe() {

    var mov = newDiv(['moving']);
    var top = newDiv(['pipe', 'topPipe']);
    var hole = newDiv(['hole']);
    var bot = newDiv(['pipe', 'bottomPipe']);

    hole.id = progressiveHoleId;
    progressiveHoleId = (progressiveHoleId + 1) % 50;

    var bodyDown = newDiv(['pipeBodyDown', 'subPipe']);
    var headDown = newDiv(['pipeHeadDown', 'subPipe']);
    var headUp = newDiv(['pipeHeadUp', 'subPipe']);
    var bodyUp = newDiv(['pipeBodyUp', 'subPipe']);

    var rnd = Math.floor((Math.random() * 40) + 15);
    mov.style.gridTemplateRows = (rnd + '% ') + ('20% ') + ((80 - rnd) + '%');

    // Aggiungo i nuovi elementi al DOM
    top.appendChild(bodyDown);
    top.appendChild(headDown);
    bot.appendChild(headUp);
    bot.appendChild(bodyUp);

    mov.appendChild(top);
    mov.appendChild(hole);
    mov.appendChild(bot);

    gameArea.appendChild(mov);

    // Tutto quello che serve per farlo muovere
    aWidth = gameArea.clientWidth;
    mWidth = mov.clientWidth;

    translX = -(aWidth + mWidth); // Per traslare giusto fino alla fine dello schermo
    mov.style.transition = 'transform 8s linear';
    mov.style.transform = 'translate3d(' + translX + 'px, 0px, 0px)';
}

function removeOldestPipe() {

    var oldest = document.querySelector('.moving');
    if (gameArea.contains(oldest))
        gameArea.removeChild(oldest);
}

function updateBird() {

    var now = Date.now();
    var elapsedTimeMs = now - updateBird.lastTick;
    var elapsedTime = elapsedTimeMs / 200;
    updateBird.lastSpeed += 40 * elapsedTime;
    updateBird.lastTick = now;

    var dy = elapsedTime * updateBird.lastSpeed;
    moveBirdBy(dy);
}

function moveBirdBy(amount) {

    moveBirdBy.currentDy += amount;
    bird.style.transform = 'translate3d(0px,' + moveBirdBy.currentDy + 'px, 0px)';
}

function prepareGame() {

    // Nascondo il dialog del gameover
    gameOverDialog.style.visibility = 'collapse';

    // Mostro le istruzioni di gioco
    instructions.style.visibility = 'visible';
   
    resetBird();    
    resetScore();

    // Rimuovo tutti i vecchi tubi
    var pipes = document.querySelectorAll('.moving');
    for (i = 0; i < pipes.length; i++) {
        var pipe = pipes[i];
        gameArea.removeChild(pipe);
    }

    // Gestore del click per il movimento del personaggio
    gameArea.addEventListener('click', clickListener);
    // document.addEventListener('keyup', (event) => {
    //     if (event.code === 'Space') {
    //         clickListener();
    //     }
    // });
}

function resetBird() {

    window.clearInterval(birdInterval);
    bird.src = 'images/robinAlive_resized.png';
    moveBirdBy.currentDy = 0;
    updateBird.lastSpeed = 0;
    bird.style.transform = '';
}

var birdInterval = 0;
var collisionInterval = 0;
var addPipeInterval = 0;
var removePipeTimeout = 0;
var removePipeInterval = 0;
function startGame() { 

    // Faccio partire i timer per le funzioni che aggiornano l'area di gioco
    birdInterval = setInterval(updateBird, 10);
    collisionInterval = setInterval(detectCollision, 10);
    addPipeInterval = setInterval(addPipe, 1700);
    removePipeTimeout = setTimeout(function () {
        removePipeInterval = setInterval(removeOldestPipe, 1700);
    }, 10000);
}

function clickListener() {

    // Verificato solo una volta, prima dell'inizio del gioco
    if (instructions.style.visibility === 'visible') {
        instructions.style.visibility = 'collapse';
        updateBird.lastTick = Date.now();
        startGame();
    }

    updateBird.lastSpeed = -70;
    updateBird();
    playChirpSound();
}

function endGame() {

    bird.src = 'images/robinDead_resized.png';
    updateBestScore();

    // Mostro il gameover (con un po' di ritardo)
    setTimeout(function () {
        bestScoreSpan.innerText = bestScore;
        gameOverDialog.style.visibility = 'visible';
        gameOverDialog.style.animation = null;
        gameOverDialog.offsetWidth = gameOverDialog.offsetWidth; // Forza il reflow dell'elemento (trucco necessario)
        gameOverDialog.style.animation = 'scaleAnimation 0.5s cubic-bezier(.05,.91,.02,1.67) forwards';
    }, 500);

    // Rimuovo timer e event listener
    window.clearInterval(collisionInterval);
    window.clearInterval(addPipeInterval);
    window.clearTimeout(removePipeTimeout);
    window.clearInterval(removePipeInterval);
    gameArea.removeEventListener('click', clickListener);

    retry.addEventListener('click', function (e) {
        e.cancelBubble = true; // Necessario!
        prepareGame();
    });
}

var bestScore;
function updateBestScore() {

    storedScore = localStorage.getItem("best");
    bestScore = storedScore == null ? 0 : storedScore;
    if (score > bestScore)
    {
        bestScore = score;
        localStorage.setItem("best", bestScore);
    }
}

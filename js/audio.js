
function playChirpSound() {
    var rnd = Math.floor((Math.random() * 3) + 1);
    switch (rnd) {
        case 1:
            playAudio(cip1, 0.4);
            break;
        case 2:
            playAudio(cip2, 0.4);
            break;
        case 3:
            playAudio(cip3, 0.4);
            break;
    }
}

function playScoreSound() {
    playAudio(progress, 0.5);
}

function playCrashSound() {
    playAudio(crash, 0.8);
}

function playAudio(audio, volume) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
}
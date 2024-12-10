window.ondragstart = () => { return false; };
window.ondrag = () => { return false; };

const elementFss = document.querySelector(".fss");
const elementFssWatchin = document.querySelector(".fss-watchin");
const elementRoep = document.querySelector(".roep");
const elementRoepStop = document.querySelector(".roep-stop");
const elementScore = document.querySelector(".score");
const elementSanity = document.querySelector(".sanity");
const elementJumpscare = document.querySelector(".jumpscare");
const elementSleeped = document.querySelector(".sleeped");

const audioHuh = new Audio("sound/huh.mp3");
const audioShutUp = new Audio("sound/shutup.mp3");
audioShutUp.volume = 0.15;
const audioMonkeyMagic = new Audio("sound/monkeymagic.mp3");
audioMonkeyMagic.volume = 0.1;
const audioSnore = new Audio("sound/snore.mp3");
audioSnore.volume = 0.05;

elementFss.draggable = false;
elementRoep.draggable = false;
elementRoepStop.draggable = false;

var dt;
var previousTime = performance.now();
var dancing = false;
var score = 0;
var sanity = 50;
var fssIsSleeping = true;
var fssAwakening = 0;
var fssRandomAwaken = 3000 + ~~(Math.random() * 3000);
var fssSleeping = 0;
var fssRandomSleep = 1000 + ~~(Math.random() * 3000);
var fssCoyote = 0;
var gameOvered = false;
var huhPlayed = false;

document.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        dancing = true;
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        dancing = false;
    }
});

function changeDancing() {
    elementRoepStop.style.opacity = dancing ? 0 : 1;
}

function updateScore(dt) {
    if (dancing) {
        score += dt / 50;
        elementScore.innerText = ~~score;
    }
}

function updateSanity(dt) {
    if (dancing) {
        audioMonkeyMagic.play();
        sanity += dt / 130;
    } else {
        audioMonkeyMagic.pause();
        sanity -= dt / 140;
    }
    if (sanity > 100)
        sanity = 100;
    if (sanity < 0)
        sanityOver();
    elementSanity.value = ~~sanity;
}

function updateFss(dt) {
    if (fssIsSleeping) {
        audioSnore.play();
        huhPlayed = false;
        elementFssWatchin.style.opacity = 0;
        fssAwakening += dt;
        if (fssAwakening > fssRandomAwaken) {
            fssIsSleeping = false;
            fssAwakening = 0;
            fssRandomAwaken = 500 + ~~(Math.random() * 7000);
        }
    } else {
        audioSnore.pause();
        if (!huhPlayed) {
            audioHuh.play();
            huhPlayed = true;
        }
        elementFssWatchin.style.opacity = 1;
        fssSleeping += dt;
        fssCoyote += dt;
        if (fssCoyote > 500 && dancing) {
            gameOver();
        }
        if (fssSleeping > fssRandomSleep) {
            fssIsSleeping = true;
            fssSleeping = 0;
            fssCoyote = 0;
            fssRandomAwaken = 1500 + ~~(Math.random() * 3500);
        }
    }
}

function gameOver() {
    gameOvered = true;
    elementJumpscare.style.opacity = 1;
    audioMonkeyMagic.pause();
    audioShutUp.play();
}

function sanityOver() {
    gameOvered = true;
    elementSleeped.style.opacity = 1;
    audioMonkeyMagic.pause();
}

function animate(currentTime) {
    window.requestAnimationFrame(animate);
    if (gameOvered)
        return;
    if (!currentTime)
        currentTime = 0;
    dt = (currentTime - previousTime);
    previousTime = currentTime;
    changeDancing();
    updateScore(dt);
    updateSanity(dt);
    updateFss(dt);
}

animate()
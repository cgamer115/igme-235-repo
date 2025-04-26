/*
const timerElement = document.getElementById("timer");
let start = Date.now();
let duration = 120;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function tick() {
    let elapsed = (Date.now() - start) / 1000;
    let remaining = Math.max(0, duration - elapsed);

    timerElement.innerHTML = formatTime(remaining);

    if (remaining > 0)
    {
        requestAnimationFrame(tick);
    } 
    else
    {
        timerElement.innerHTML = "Time's up!";
    }
}
tick();
*/
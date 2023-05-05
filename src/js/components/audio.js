
export const init = () => {
    const audioPlayer = document.querySelector(".audio-player");
    if (!audioPlayer) {
        return;
    }
    const audioUrl = audioPlayer.dataset.targetUrl;
    const audio = new Audio(audioUrl);

    console.dir(audio);

    audio.addEventListener(
    "loadeddata",
    () => {
        audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
        audio.duration
        );
        audio.volume = .75;
    },
    false
    );

    //click on timeline to skip around
    const timeline = audioPlayer.querySelector(".timeline");
    timeline.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
    }, false);

//click volume slider to change volume
    const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
    volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
    }, false)

//check audio percentage and update time accordingly
    setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
        audio.currentTime
    );
    }, 500);

//toggle between playing and pausing on button click
    const playBtn = audioPlayer.querySelector(".controls .toggle-play");
    const playBars = audioPlayer.querySelectorAll(".playing__bar");
    playBtn.addEventListener(
    "click",
    () => {
        if (audio.paused) {
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
        playBars.forEach((item) =>{
            item.classList.add("active");
        })
        audio.play();
        } else {
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
        playBars.forEach((item) =>{
            item.classList.remove("active");
        })
        audio.pause();
        }
    },
    false
    );

    audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
        const volumeEl = audioPlayer.querySelector(".volume-container .volume");
        const svgWrap = volumeEl.querySelector(".icon-svg");
        const svg = svgWrap.querySelector("svg");
        const use = svg.querySelector("use");
        const href = use.getAttribute("xlink:href");
        console.log(href);
        audio.muted = !audio.muted;
            if (audio.muted) {
                svgWrap.classList.remove("icon-svg--volume");
                svgWrap.classList.add("icon-svg--volume-mute");
                use.setAttribute("xlink:href", "../img/bg/icons-svg.svg#icon-volume-mute")
            } else {
                svgWrap.classList.remove("icon-svg--volume-mute");
                svgWrap.classList.add("icon-svg--volume");
                use.setAttribute("xlink:href", "../img/bg/icons-svg.svg#icon-volume")
            }
    });

    //Timer counter
    function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
    }
};

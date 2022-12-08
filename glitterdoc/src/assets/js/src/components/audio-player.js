/**
 * Mouse move parallax effect
 * @requires https://github.com/wagerfield/parallax
*/

const audioPlayer = (() => {

  let player = document.querySelectorAll('.audio-player');

  if (player.length === 0) return;

  for (let i = 0; i < player.length; i++) {
    const playerContainer = player[i],
          audio = playerContainer.querySelector('audio'),
          playButton = playerContainer.querySelector('.ap-play-button'),
          seekSlider = playerContainer.querySelector('.ap-seek-slider'),
          volumeSlider = playerContainer.querySelector('.ap-volume-slider'),
          durationTimeLabel = playerContainer.querySelector('.ap-duration'),
          currentTimeLabel = playerContainer.querySelector('.ap-current-time');

    let playState = 'play',
        raf = null;

    // Start / stop audio
    playButton.addEventListener('click', (e) => {
      if(playState === 'play') {
        e.currentTarget.classList.add('ap-pause');
        audio.play();
        requestAnimationFrame(whilePlaying);
        playState = 'pause';
      } else {
        e.currentTarget.classList.remove('ap-pause');
        audio.pause();
        cancelAnimationFrame(raf);
        playState = 'play';
      }
    });

    // Instantiate sliders: Seek slider + Volume slider
    const showRangeProgress = (rangeInput) => {
      if(rangeInput === seekSlider) playerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
      else playerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    }

    seekSlider.addEventListener('input', (e) => {
      showRangeProgress(e.target);
    });
    volumeSlider.addEventListener('input', (e) => {
      showRangeProgress(e.target);
    });

    const calculateTime = (secs) => {
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${minutes}:${returnedSeconds}`;
    }

    const displayDuration = () => {
      durationTimeLabel.textContent = calculateTime(audio.duration);
    }

    const setSliderMax = () => {
      seekSlider.max = Math.floor(audio.duration);
    }

    const displayBufferedAmount = () => {
      const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
      playerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
    }

    const whilePlaying = () => {
      seekSlider.value = Math.floor(audio.currentTime);
      currentTimeLabel.textContent = calculateTime(seekSlider.value);
      playerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
      raf = requestAnimationFrame(whilePlaying);
    }

    if (audio.readyState > 0) {
      displayDuration();
      setSliderMax();
      displayBufferedAmount();
    } else {
      audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
      });
    }

    audio.addEventListener('progress', displayBufferedAmount);

    seekSlider.addEventListener('input', () => {
      currentTimeLabel.textContent = calculateTime(seekSlider.value);
      if(!audio.paused) {
          cancelAnimationFrame(raf);
      }
    });

    seekSlider.addEventListener('change', () => {
      audio.currentTime = seekSlider.value;
      if(!audio.paused) {
          requestAnimationFrame(whilePlaying);
      }
    });

    volumeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      audio.volume = value / 100;
    });
  }

})();

export default audioPlayer;

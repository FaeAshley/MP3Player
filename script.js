const playlist = [
    {
        id: 0,
        title: "From the Ground Up",
        artist: "Artist One",
        duration: "3:12",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",  
        cover: "images/cover1.jpg"
    },
    {
        id: 1,
        title: "The Surest Way Out is Through",
        artist: "Artist Two",
        duration: "3:10",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
        cover: "images/cover2.jpg"
    },
    {
        id: 2,
        title: "Chasing That Feeling",
        artist: "Artist Three",
        duration: "2:43",
        src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
        cover: "images/cover3.jpg"
    }
];

const audio = new Audio();
const playlistContainer = document.querySelector(".playlist");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const songDuration = document.getElementById("total-duration");
const coverArt = document.getElementById("cover-art");

const currentTimeDisplay = document.getElementById("current-time");
const totalDuration = document.getElementById("total-duration");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");

const prevBtn = document.getElementById("prev-btn");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");

let currentSong = null;
let songCurrentTime = 0;

const playSong = (id) => {
    const song = playlist.find((song) => song.id === id)
    const songButton = document.getElementById(`song-button-${song.id}`);
    
    if (currentSong === null || currentSong.id !== song.id) {
        audio.src = song.src;
        audio.currentTime = 0;
    } else {
        audio.currentTime = songCurrentTime;
    }

    songButton.onclick = pauseSong;
    audio.play();
    currentSong = song;
    setPlayerDisplay();
    highlightSong();

    audio.onloadedmetadata = () => {
        totalDuration.innerText = formatTime(audio.duration);
    };
}

const pauseSong = () => {
    const songButton = document.getElementById(`song-button-${currentSong.id}`);
    songButton.onclick = ( () => playSong(currentSong.id));
    songCurrentTime = audio.currentTime;
    audio.pause();
    playBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");

}

const playNextSong = () => {
    const currentSongIndex = getSongIndex();
    const nextSongId = playlist[currentSongIndex + 1].id;
    playSong(nextSongId);
}
const playPrevSong = () => {
    const currentSongIndex = getSongIndex();
    const nextSongId = playlist[currentSongIndex - 1].id;
    playSong(nextSongId);
}

const shuffleSongs = () => {
  playlist.sort(() => Math.random() - 0.5);
  currentSong = null;
  songCurrentTime = 0;

  loadPlaylist(playlist);
  pauseSong();
  setPlayerDisplay();
}

const getSongIndex = () => playlist.indexOf(currentSong);


const setPlayerDisplay = () => {
    songTitle.innerText = currentSong.title;
    songArtist.innerText = currentSong.artist;
    songDuration.innerText = currentSong.duration;
    coverArt.src = currentSong.cover;

    playBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
}

const highlightSong = () => {
    const song = currentSong;
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(`song-${song.id}`);

    playlistSongElements.forEach((songEl) => {
        songEl.classList.remove("active");
    });
    songToHighlight.classList.add("active");
}

const loadPlaylist = (array) => {
    playlistContainer.innerHTML = "";

    const songsHTML = array.map((song) => {
        return `
      <li id="song-${song.id}" class="playlist-song">
      <button id="song-button-${song.id}" class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

    playlistContainer.innerHTML = songsHTML;
}

loadPlaylist(playlist);

audio.addEventListener("timeupdate", () => {
    currentTimeDisplay.innerText = formatTime(audio.currentTime);
});

audio.addEventListener("timeupdate", () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

progressBar.addEventListener("click", (event) => {
    const barWidth = progressBar.clientWidth; // Total width of the progress bar
    const clickX = event.offsetX; // Where the user clicked
    const newTime = (clickX / barWidth) * audio.duration; // Convert to time

    audio.currentTime = newTime; // Set the new time
});

playBtn.addEventListener("click", () => {
    if (currentSong === null) {
    playSong(playlist[0].id);
  } else {
    playSong(currentSong.id);
  }
});

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
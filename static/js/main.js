
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const songGrid = document.getElementById('songGrid');
    const playButton = document.getElementById('playButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const currentSongDisplay = document.getElementById('currentSong');
    
    let isPlaying = false;
    let currentSongIndex = -1;
    let songs = [];
    let audio = new Audio();

    // Search functionality
    searchInput.addEventListener('input', debounce(function(e) {
        const query = e.target.value;
        if (query.length > 2) {
            fetch(`/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    songs = data;
                    updateSongGrid(data);
                });
        }
    }, 300));

    // Playback controls
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    prevButton.addEventListener('click', function() {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playSong(songs[currentSongIndex]);
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playSong(songs[currentSongIndex]);
        }
    });

    function playSong(song) {
        currentSongDisplay.textContent = `${song.title} - ${song.artist}`;
        audio.src = song.file_path;
        audio.play();
        isPlaying = true;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function updateSongGrid(songs) {
        songGrid.innerHTML = songs.map(song => `
            <div class="song-card" data-id="${song.id}">
                <img src="/static/images/album-placeholder.jpg" alt="${song.album}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `).join('');
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});

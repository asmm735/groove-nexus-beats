
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const songGrid = document.getElementById('songGrid');
    const playButton = document.getElementById('playButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const currentSongDisplay = document.getElementById('currentSong');
    const currentArtistDisplay = document.getElementById('currentArtist');
    const currentAlbumArt = document.getElementById('currentAlbumArt');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const createPlaylistBtn = document.getElementById('createPlaylist');
    const modal = document.getElementById('playlistModal');
    
    let isPlaying = false;
    let currentSongIndex = -1;
    let songs = [];
    let audio = new Audio();

    // Audio event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        playNext();
    });

    progressBar.addEventListener('click', (e) => {
        const progressWidth = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / progressWidth) * duration;
    });

    function updateProgress() {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percentage + '%';
    }

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

    prevButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);

    // Album view
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('album-name')) {
            const albumName = e.target.dataset.album;
            fetch(`/album/${encodeURIComponent(albumName)}`)
                .then(response => response.json())
                .then(data => {
                    songs = data;
                    updateSongGrid(data);
                });
        }
    });

    // Playlist management
    createPlaylistBtn.addEventListener('click', function() {
        const playlistName = prompt('Enter playlist name:');
        if (playlistName) {
            fetch('/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: playlistName })
            })
            .then(response => response.json())
            .then(data => {
                const playlistList = document.getElementById('playlistList');
                const li = document.createElement('li');
                li.textContent = data.name;
                li.dataset.id = data.id;
                playlistList.appendChild(li);
            });
        }
    });

    // Add to playlist functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-playlist-btn') || e.target.parentElement.classList.contains('add-to-playlist-btn')) {
            const songCard = e.target.closest('.song-card');
            const songId = songCard.dataset.id;
            showPlaylistModal(songId);
        }
    });

    function showPlaylistModal(songId) {
        const playlistOptions = document.getElementById('playlistOptions');
        playlistOptions.innerHTML = '';
        
        document.querySelectorAll('#playlistList li').forEach(playlist => {
            const li = document.createElement('li');
            li.textContent = playlist.textContent;
            li.addEventListener('click', () => addToPlaylist(playlist.dataset.id, songId));
            playlistOptions.appendChild(li);
        });
        
        modal.style.display = 'block';
    }

    function addToPlaylist(playlistId, songId) {
        fetch(`/playlist/${playlistId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ song_id: songId })
        })
        .then(() => {
            modal.style.display = 'none';
        });
    }

    function playSong(song) {
        currentSongDisplay.textContent = song.title;
        currentArtistDisplay.textContent = song.artist;
        currentAlbumArt.src = song.album_art || '/static/images/album-placeholder.jpg';
        audio.src = song.file_path;
        audio.play();
        isPlaying = true;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function playNext() {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playSong(songs[currentSongIndex]);
        }
    }

    function playPrevious() {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playSong(songs[currentSongIndex]);
        }
    }

    function updateSongGrid(songs) {
        songGrid.innerHTML = songs.map(song => `
            <div class="song-card" data-id="${song.id}" data-file="${song.file_path}">
                <img src="${song.album_art || '/static/images/album-placeholder.jpg'}" alt="${song.album}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <p class="album-name" data-album="${song.album}">${song.album}</p>
                <div class="song-controls">
                    <button class="play-btn"><i class="fas fa-play"></i></button>
                    <button class="add-to-playlist-btn"><i class="fas fa-plus"></i></button>
                </div>
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

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const playlists = [];
    const musicLibrary = [
        { id: 1, title: 'Tu Hai Kahaan', artist: 'AUR', album: 'Album 1', src: 'assets/Tu_Hai_Kahaan.mp3', cover: 'assets/Tu_Hai_Kahaan.png' },
        { id: 2, title: 'Soulmate', artist: 'Arijit Singh', album: 'Album 2', src: 'assets/Soulmate.mp3', cover: 'assets/Soulmate.png' },
        { id: 3, title: 'Raam Aaenge', artist: 'Swati Sachdeva', album: 'Album 2', src: 'assets/Raam_Aayenge.mp3', cover: 'assets/Raam_Aayenge.png' },
        { id: 4, title: 'Shiv Sama Rahe', artist: 'Hansraj Raghuvanshi', album: 'Album 2', src: 'assets/Shiv_Sama_Rahe.mp3', cover: 'assets/Shiv_Sama_Rahe.png' },
        { id: 5, title: 'Dekha Tenu', artist: 'Arijit Singh', album: 'Album 2', src: 'assets/Dekha_Tenu_Pehli_Pehli_Baar_Ve.mp3', cover: 'assets/Dekha_Tenu_Pehli_Pehli_Baar_Ve.png' },
    ];

    let currentTrackIndex = null;
    let currentPlaylist = null;
    let isPlaying = false;
    let shuffle = false;
    let repeat = false;

    const audio = new Audio();
    const playlistsElement = document.getElementById('playlists');
    const musicLibraryElement = document.getElementById('musicLibrary');
    const playPauseButton = document.getElementById('playPause');
    const playPauseIcon = document.getElementById('playPauseIcon');

    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const progressElement = document.getElementById('progress');
    const volumeElement = document.getElementById('volume');
    const shuffleButton = document.getElementById('shuffle');
    const repeatButton = document.getElementById('repeat');
    const playlistSelect = document.getElementById('playlistSelect');
    const addToPlaylistButton = document.getElementById('addToPlaylist');
    const addToPlaylistFooterButton = document.getElementById('addToPlaylistFooter');
    const playlistContentsElement = document.getElementById('playlistContents');
    const playPlaylistButton = document.getElementById('playPlaylist');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const coverImg = document.getElementById('coverImg');

    // Default placeholders
    const defaultCoverImg = 'assets/default_cover.png'; // Path to a default placeholder image
    const defaultTrackTitle = 'No track playing';
    const defaultTrackArtist = '-';

    // Function to render playlists
    const renderPlaylists = () => {
        playlistsElement.innerHTML = playlists.map((playlist, index) => 
            `<li onclick="viewPlaylist(${index})" class="cursor-pointer hover:text-blue-400 transition-colors">${playlist.name}</li>`
        ).join('');
        playlistSelect.innerHTML = `<option value="">Select a Playlist</option>` + 
            playlists.map((playlist, index) => 
                `<option value="${index}">${playlist.name}</option>`
            ).join('');
    };

    // Function to render music library
    const renderMusicLibrary = () => {
        musicLibraryElement.innerHTML = musicLibrary.map(track => `
            <div class="p-2 bg-gray-800 rounded transition-transform transform hover:scale-105">
                <img src="${track.cover}" alt="${track.title}" class="w-full h-32 object-cover mb-2 transition-transform transform hover:scale-105">
                <h3 class="text-lg">${track.title}</h3>
                <p class="text-sm">${track.artist}</p>
                <button class="mt-2 p-2 bg-blue-500 button-transition rounded" onclick="playTrack(${track.id})" aria-label="Play ${track.title}">Play</button>
            </div>
        `).join('');
    };

    // Function to render playlist contents
    const renderPlaylistContents = (playlist) => {
        playlistContentsElement.innerHTML = playlist.tracks.map(track => 
            `<li>${track.title} - ${track.artist}</li>`
        ).join('');
    };

    // Global function to play a track
    window.playTrack = (id) => {
        const trackIndex = musicLibrary.findIndex(t => t.id === id);
        if (trackIndex !== -1) {
            currentTrackIndex = trackIndex;
            audio.src = musicLibrary[currentTrackIndex].src;
            audio.play();
            isPlaying = true;
            updatePlayPauseButton();
            updateCurrentTrackInfo();
        }
    };

    const playPlaylist = (playlistIndex) => {
        currentPlaylist = playlists[playlistIndex];
        if (currentPlaylist && currentPlaylist.tracks.length > 0) {
            playTrack(currentPlaylist.tracks[0].id);
        }
    };

    const updateCurrentTrackInfo = () => {
        if (currentTrackIndex !== null) {
            const track = musicLibrary[currentTrackIndex];
            currentTrackTitle.textContent = track.title;
            currentTrackArtist.textContent = track.artist;
            coverImg.src = track.cover; // Update cover image
        } else {
            currentTrackTitle.textContent = defaultTrackTitle;
            currentTrackArtist.textContent = defaultTrackArtist;
            coverImg.src = defaultCoverImg; // Set default cover image
        }
    };

    const updatePlayPauseButton = () => {
        if (isPlaying) {
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } else {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    };

    prevButton.addEventListener('click', () => {
        if (currentTrackIndex !== null && currentTrackIndex > 0) {
            playTrack(musicLibrary[currentTrackIndex - 1].id);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentTrackIndex !== null && currentTrackIndex < musicLibrary.length - 1) {
            playTrack(musicLibrary[currentTrackIndex + 1].id);
        }
    });

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    });

    progressElement.addEventListener('input', (e) => {
        if (audio.duration) {
            audio.currentTime = (e.target.value / 100) * audio.duration;
        }
    });

    volumeElement.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    shuffleButton.addEventListener('click', () => {
        shuffle = !shuffle;
        shuffleButton.classList.toggle('bg-green-500', shuffle);
    });

    repeatButton.addEventListener('click', () => {
        repeat = !repeat;
        repeatButton.classList.toggle('bg-green-500', repeat);
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progressElement.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    audio.addEventListener('ended', () => {
        if (repeat) {
            audio.currentTime = 0;
            audio.play();
        } else if (shuffle) {
            const randomIndex = Math.floor(Math.random() * musicLibrary.length);
            playTrack(musicLibrary[randomIndex].id);
        } else if (currentPlaylist && currentPlaylist.tracks.includes(musicLibrary[currentTrackIndex])) {
            const currentIndexInPlaylist = currentPlaylist.tracks.findIndex(t => t.id === musicLibrary[currentTrackIndex].id);
            if (currentIndexInPlaylist < currentPlaylist.tracks.length - 1) {
                playTrack(currentPlaylist.tracks[currentIndexInPlaylist + 1].id);
            } else {
                // Playlist finished
                currentPlaylist = null;
            }
        } else if (currentTrackIndex !== null && currentTrackIndex < musicLibrary.length - 1) {
            playTrack(musicLibrary[currentTrackIndex + 1].id);
        }
    });

    document.getElementById('addPlaylist').addEventListener('click', () => {
        const playlistName = prompt('Enter playlist name:');
        if (playlistName) {
            playlists.push({ name: playlistName, tracks: [] });
            renderPlaylists();
        }
    });

    addToPlaylistButton.addEventListener('click', () => {
        const selectedPlaylistIndex = playlistSelect.value;
        if (selectedPlaylistIndex !== "" && currentTrackIndex !== null) {
            const selectedPlaylist = playlists[selectedPlaylistIndex];
            const currentTrack = musicLibrary[currentTrackIndex];
            if (!selectedPlaylist.tracks.includes(currentTrack)) {
                selectedPlaylist.tracks.push(currentTrack);
                alert(`Added ${currentTrack.title} to ${selectedPlaylist.name}`);
                renderPlaylistContents(selectedPlaylist);
            } else {
                alert(`${currentTrack.title} is already in ${selectedPlaylist.name}`);
            }
        } else {
            alert('Please select a playlist and play a track first.');
        }
    });

    addToPlaylistFooterButton.addEventListener('click', () => {
        const selectedPlaylistIndex = playlistSelect.value;
        if (selectedPlaylistIndex !== "" && currentTrackIndex !== null) {
            const selectedPlaylist = playlists[selectedPlaylistIndex];
            const currentTrack = musicLibrary[currentTrackIndex];
            if (!selectedPlaylist.tracks.includes(currentTrack)) {
                selectedPlaylist.tracks.push(currentTrack);
                alert(`Added ${currentTrack.title} to ${selectedPlaylist.name}`);
                renderPlaylistContents(selectedPlaylist);
            } else {
                alert(`${currentTrack.title} is already in ${selectedPlaylist.name}`);
            }
        } else {
            alert('Please select a playlist to add the track.');
        }
    });

    playPlaylistButton.addEventListener('click', () => {
        const selectedPlaylistIndex = playlistSelect.value;
        if (selectedPlaylistIndex !== "") {
            playPlaylist(selectedPlaylistIndex);
        } else {
            alert('Please select a playlist to play.');
        }
    });

    renderMusicLibrary();
    renderPlaylists();
});

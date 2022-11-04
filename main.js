// build function to get token

const getAuth = async () => {
    const clientID = '940ca0e54fbb43de8f24d3d57388c089';
    const clientSecret = '87de30c714ca41a9a305b4e41a1a78fb';
    const response = await fetch('https://accounts.spotify.com/api/token', 
    {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(clientID + ':' + clientSecret)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const token = await response.json();
    console.log(token);
    return token.access_token
}

// function to make api call-
const getSong = async (songname, artist, token) => {
    let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=track:${songname}+artist:${artist}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            
        }
    });
    let data = await response.json();
    return data.tracks.items[0]
}

// set up a data structure for all of the songs were going to use

let music = [{id: 0, track: 'Electric Worry', artist: 'Clutch' },
{id: 1, track: 'Pardon Me', artist: 'Incubus' },
{id: 2, track: 'TNT', artist: 'AC-DC' },
{id: 3, track: 'Burden in my hand', artist: 'Soundgarden' },
{id: 4, track: 'Rats', artist: 'Pearl Jam' },
{id: 5, track: 'Black', artist: 'Sevendust' },
{id: 6, track: 'Bother', artist: 'Stone Sour' },
{id: 7, track: 'The Devil Wears a Suit and Tie', artist: 'Colter Wall' },
{id: 8, track: 'American Boy', artist: 'Estelle' }];

// Declared globally so we can keep track of what's playing!

let playing;
let stopbtn = document.getElementById('stopbtn');
let headertitle = document.getElementById('headertitle');

const setupTrackList = async () => {
    const token = await getAuth();
    // We have our token, our api call is working, let's set the page up!
    for (let i = 0; i < music.length; i++) {
        let data = await getSong(music[i].track, music[i].artist, token);
        music[i]['preview_url'] = new Audio(data.preview_url);
        music[i]['album_cover'] = data.album.images[0].url;
        console.log(data)
        let img = document.getElementById(`${i}`);
        img.src = music[i].album_cover;
        img.hidden = false;
    }
    console.log(music);
}
setupTrackList();


// Click event to play the songs!

let clickEvent = (id) => {
    console.log(id);
    let track = music[id.slice(-1)];
    console.log(track);

    if (playing && !playing.preview_url.paused) { // if there's a song playing and it isn't paused. . . 
        // is it the same as the id/track/album of the currently playing song?
        if (playing == track) {
            //pause and don't do anything else in this function
            pauseTrack();
            return
        }
        // different track/id/album?
        else {
            // pause that and start the new one
            playing.preview_url.pause();
            let playingbtn = document.getElementById(`playbtn${playing.id}`);
            playingbtn.innerHTML = 'Play';
        }
    }
    console.log(`Playing ${track.track} by ${track.artist} . . .`);
    track.preview_url.play();
    // update  what it is that's playing
    playing = track;
    let playingbtn = document.getElementById(`playbtn${playing.id}`);
    playingbtn.innerHTML = 'Pause';
    headertitle.innerHTML = `${track.track} | ${track.artist}`;
}

let pauseTrack = () => {
    console.log('Paused. . . ');
    playing.preview_url.pause();
    let playingbtn = document.getElementById(`playbtn${playing.id}`);
    playingbtn.innerHTML = 'Play';
    headertitle.innerHTML = 'Padawans | SpottyAPI Music'
}

const API_KEY = '904454ec28ead721ba9bc5aeb8aabb93';
const LASTFM_USERNAME = 'brendanlast';

const songTitleElement = document.getElementById('song-title');
const songArtistElement = document.getElementById('song-artist');
const songCoverElement = document.getElementById('song-cover');
const songTextElement = document.getElementById('song-text');

// Fetch track info
async function fetchTrackInfo(trackName, artistName) {
  const trackUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&format=json`;

  try {
    const response = await fetch(trackUrl);
    const data = await response.json();
    return data.track.url;
  } catch (error) {
    console.error('Error fetching track info:', error);
  }
}

// Fetch now playing
async function fetchNowPlaying() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${API_KEY}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const track = data.recenttracks.track[0];
    const nowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

    if (nowPlaying) {
      const trackUrl = await fetchTrackInfo(track.name, track.artist['#text']);
      songTextElement.innerHTML = `Currently listening to <a href="${trackUrl}" target="_blank" id="song-title">${track.name}</a> by <span id="song-artist">${track.artist['#text']}</span>`;
      songCoverElement.src = track.image[3]['#text']; // Update the cover image
    } else {
      songTextElement.innerHTML = 'Not listening to any music at the moment! <br> Here is a picture of my dog in the meantime.';
      songCoverElement.src = './images/luna.jpeg'; // Set the default cover image
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 5000);

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
dayjs.extend(dayjs_plugin_advancedFormat);

// Update greeting and time
function updateGreetingAndTime() {
  const greetingTextElement = document.getElementById('greeting-text');
  const currentTimeElement = document.getElementById('current-time');
  const now = dayjs().tz('America/New_York');
  const currentDate = now.format('Do [of] MMMM');
  const currentTime = now.format('h:mm:ss A');

  let greeting;
  let imageSrc;

  const currentHour = now.hour();
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good morning';
    imageSrc = './images/sunrise.svg';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon';
    imageSrc = './images/afternoon.png';
  } else {
    greeting = 'Good evening';
    imageSrc = './images/sunset.svg';
  }

  greetingTextElement.innerHTML = `${greeting}, it is the ${currentDate}. <br>`;
  currentTimeElement.textContent = `The current time in New York City is ${currentTime}.`;

  const dayNightImageElement = document.getElementById('day-night-image');
  dayNightImageElement.src = imageSrc;
}

window.addEventListener('load', () => {
  updateGreetingAndTime();
  setInterval(updateGreetingAndTime, 1000);
});
// add to dropdown and get data

const getAllTunes = async () => {
  //The URL to which we will send the request
  const url = "http://localhost:3000/api/v1/tunes";

  //Perform a GET request to the url
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    //When unsuccessful, print the error.
    console.log(error);
    return null;
  }
  // This code is always executed, independent of whether the request succeeds or fails.
};

const appendNewSong = (songName) => {
  const dropDown = document.getElementById("tunesDrop");
  const newOption = document.createElement("option");
  newOption.innerText = songName;
  newOption.setAttribute("value", songName);
  //  newOption.setAttribute("value", songName.toLowerCase().split(" ").pop());
  dropDown.appendChild(newOption);
};

const addSongsToDropDown = async () => {
  const tunes = await getAllTunes();
  if (tunes) {
    tunes.forEach((item) => {
      appendNewSong(item.name);
    });
  }
};

addSongsToDropDown();
// play keys on keyboard with mouse and keyboard

const synth = new Tone.Synth().toDestination();

const playKey = (key) => {
  const now = Tone.now();

  synth.triggerAttackRelease(key, "8n", now);
};

const keyboard = document.getElementById("keyboardDiv");

// Mouse eventListener
keyboard.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const key = event.target.id;
    playKey(key);
  }
  if (event.target.tagName === "SPAN") {
    const key = event.target.parentNode.id;
    playKey(key);
  }
});

// Keyboard eventListener
document.addEventListener("keydown", (event) => {
  const key = event.key;
  const button = document.querySelector(`button[data-key="${key}"]`);
  if (button) {
    const note = button.id;
    playKey(note);
  }
});

// play songs from backend
const playButton = document.getElementById("tunebtn");

const playTune = (song) => {
  const songObject = song[0];
  songObject.tune.forEach((item) => {
    const now = Tone.now();
    synth.triggerAttackRelease(item.note, item.duration, item.timing + now);
  });
};

playButton.addEventListener("click", async () => {
  const tunes = await getAllTunes();
  const songElement = document.getElementById("tunesDrop");
  const songName = songElement.value;
  const song = tunes.filter(
    (song) => song.name.toLowerCase() === songName.toLowerCase()
  );
  playTune(song);
});

// record songs and add to backend

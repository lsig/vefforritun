// record songs and add to backend
let startTime = 0;
let elapsedTime = 0;
let tuneArr = [];
let unamedTunes = 0;

let isRecording = false;

const recordButton = document.getElementById("recordbtn");
const stopButton = document.getElementById("stopbtn");

const postTunes = async (load) => {
  const url = "http://localhost:3000/api/v1/tunes";
  try {
    const response = await axios.post(url, load);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

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

recordButton.addEventListener("click", () => {
  const now = Tone.now();
  startTime = now;
  recordButton.disabled = true;
  stopButton.disabled = false;
  isRecording = true;
});

stopButton.addEventListener("click", () => {
  unamedTunes += 1;
  const name = prompt("Please enter song name", `No-name tune ${unamedTunes}`);
  if (name) {
    const load = {
      name: name,
      tune: tuneArr,
    };
    console.log(load);
    const response = postTunes(load);
    console.log(response);
    if (response) {
      appendNewSong(name);
    }
  }
  recordButton.disabled = false;
  stopButton.disabled = true;
  isRecording = false;
  tuneArr = [];
});

const checkElapsedTime = () => {
  const now = Tone.now();
  elapsedTime = now - startTime;
  return elapsedTime;
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
  if (isRecording) {
    const keyInfo = {
      note: key.toUpperCase(),
      duration: "8n",
      timing: checkElapsedTime(),
    };
    tuneArr.push(keyInfo);
    console.log(tuneArr);
  }
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

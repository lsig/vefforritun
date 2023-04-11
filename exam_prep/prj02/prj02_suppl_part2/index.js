const notes = {
  a: "c4",
  w: "c#4",
  s: "d4",
  e: "d#4",
  d: "e4",
  f: "f4",
  t: "f#4",
  g: "g4",
  y: "g#4",
  h: "a4",
  u: "bb4",
  j: "b4",
  k: "c5",
  o: "c#5",
  l: "d5",
  p: "d#5",
  ";": "e5",
};

const url = "http://localhost:3000/api/v1/tunes";
const synth = new Tone.Synth().toDestination();
let isRecording = false;
let time = new Date();
let tune = [];

const playKey = (key, note, dur = "8n", timing = 0) => {
  if (key) {
    key.classList.add("active");
    setTimeout(() => {
      key.classList.remove("active");
    }, 100 + timing * 1000);
  }
  const now = Tone.now();
  synth.triggerAttackRelease(note, dur, now + timing);
  if (isRecording) {
    const endTime = new Date();
    const songNote = {
      note: note,
      duration: dur,
      timing: (endTime.getTime() - time.getTime()) / 1000,
    };
    tune.push(songNote);
  }
};

(() => {
  const piano = document.getElementById("keyboardDiv");
  const keys = piano.querySelectorAll("button");
  keys.forEach((key) => {
    const note = key.id;
    key.addEventListener("click", () => playKey(key, note));
  });
})();

(() => {
  document.addEventListener("keyup", (event) => {
    if (notes.hasOwnProperty(event.key)) {
      const keyboardKey = document.getElementById(notes[event.key]);
      return playKey(keyboardKey, notes[event.key]);
    }
  });
})();

const getAllSongsDropdown = async () => {
  try {
    const response = await axios.get(url);
    const dropDown = document.getElementById("tunesDrop");
    dropDown.innerHTML = "";
    response.data.forEach((item) => {
      const song = document.createElement("option");
      song.value = item.id;
      song.innerHTML = item.name;
      dropDown.appendChild(song);
    });
  } catch (error) {
    console.log(error);
  }
};
getAllSongsDropdown();

const playSong = async () => {
  const response = await axios.get(url);
  const songId = document.getElementById("tunesDrop").value;
  const songObject = response.data.find((tune) => tune.id === songId);
  const song = songObject.tune;
  song.forEach((e) => {
    const note = e.note.toLowerCase();
    const keyboardKey = document.getElementById(note);
    playKey(keyboardKey, note, e.duration, e.timing);
  });
};

const playButton = document.getElementById("tunebtn");
const stopButton = document.getElementById("stopbtn");
const recButton = document.getElementById("recordbtn");

playButton.addEventListener("click", () => playSong());
stopButton.addEventListener("click", async () => {
  isRecording = false;
  recButton.disabled = false;
  stopButton.disabled = true;
  const songName = prompt("Please enter a song name", "No-name Tune");
  if (tune !== []) {
    tuneObject = {
      name: songName,
      tune: tune,
    };
    try {
      const response = await axios.post(url, tuneObject);
      console.log("Success: ", response.data);
    } catch (e) {
      console.log(e);
    }
    getAllSongsDropdown();
    tune = [];
  }
});

recButton.addEventListener("click", () => {
  isRecording = true;
  recButton.disabled = true;
  stopButton.disabled = false;
  time = new Date();
});

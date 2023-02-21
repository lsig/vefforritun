const synth = new Tone.Synth().toDestination();

const playKey = (key) => {
  const now = Tone.now();

  synth.triggerAttackRelease(key, "8n", now);
};

const keyboard = document.getElementById("keyboardDiv");

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

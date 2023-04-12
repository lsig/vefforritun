function getAllTodos() {
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  const url = "http://localhost:3000/api/vEx0/notes";

  axios
    .get(url)
    .then(function (response) {
      if (response.data !== null) {
        response.data.forEach((noteData) => {
          const note = createNote(noteData);
          const deleteButton = createDeleteButton(note, noteData.id, url);
          note.appendChild(deleteButton);
          noteList.appendChild(note);
        });
      }
    })
    .catch(function (error) {
      //When unsuccessful, print the error.
      console.log(error);
    });
}

const createNote = (noteData) => {
  const note = document.createElement("div");
  note.setAttribute("class", "note");
  note.setAttribute("id", `${noteData.id}`);
  const noteName = createNoteParagraph(`Name: ${noteData.name},`);
  const noteContent = createNoteParagraph(`Content: ${noteData.content},`);
  const notePrior = createNoteParagraph(`Prio: ${noteData.priority}`);
  note.appendChild(noteName);
  note.appendChild(noteContent);
  note.appendChild(notePrior);
  return note;
};

const createNoteParagraph = (text) => {
  const noteParagraph = document.createElement("p");
  const noteText = document.createTextNode(text);
  noteParagraph.appendChild(noteText);
  return noteParagraph;
};

const createDeleteButton = (note, noteId, url) => {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete Button";
  note.appendChild(deleteButton);

  deleteButton.addEventListener("click", () => {
    axios.delete(url + `/${noteId}`).then(() => getAllTodos());
  });
  return deleteButton;
};

getAllTodos();

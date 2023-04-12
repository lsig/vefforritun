function getAllTodos() {
    var noteList = document.getElementById("noteList");
    noteList.innerHTML='';

    var url = 'http://localhost:3000/api/vEx0/notes';

    axios.get(url)
        .then(function (response) {
            if (response.data !== null) {
                for (var i = 0; i < response.data.length; i++) {
                    var noteItem = document.createElement("p");
                    var noteText = document.createTextNode("Name: " + response.data[i].name + ", Content: " + response.data[i].content + " " + ", Prio: " + response.data[i].priority + "\n");
                    noteItem.appendChild(noteText);
                    noteList.appendChild(noteItem);
                }
            }
        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log(error);
        });

}

getAllTodos();
const checkAndGetURL = () => {
  const inputField = document.getElementById("fname");
  const filename = inputField.value;

  if (checkURL(filename) === true) {
    loadFileAsync(filename, (response) => {
      const display = document.getElementById("displayDiv");
      if (response === null) {
        display.textContent = "File could not be found!";
      } else {
        display.textContent = response;
      }
    });
  } else {
    markAndResetInput(inputField);
  }
};

const calculateC = () => {
  const a = Number(document.getElementById("varA").value);
  const b = Number(document.getElementById("varB").value);

  const c = doPythagoras(a, b);

  document.getElementById("displayC").textContent = c;
};

const doPythagoras = (a, b) => {
  const cSquare = a * a + b * b;
  return Math.sqrt(cSquare);
};

const loadFileAsync = (url, callback) => {
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = (e) => {
    const res = e.target;
    if (res.readyState == 4 && res.status == 200) {
      callback(res.responseText);
    } else if (res.readyState == 4) {
      callback(null);
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
};

const checkURL = (filename) => {
  if (typeof filename !== "string" || filename === "") {
    return false;
  } else {
    return true;
  }
};

const markAndResetInput = (inputField) => {
  inputField.setAttribute("style", "background-color:red;");
};

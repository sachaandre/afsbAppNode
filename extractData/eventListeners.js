var fileUploadInput = document.getElementById("my_file_input");
fileUploadInput.addEventListener('change', filePicked, false);

var resultatJSONBlock = document.getElementById("resultatJSON");

var fileUploadMessageBlock = document.getElementById("upload_message");

// Create a new FileReader in HTML 5
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
var reader = new FileReader();
var fileArrayBuffer;

// Create variables to complete Osuny blocs
var nameContrib,
    locContrib,
    dateContrib,
    titleContrib,
    contentContrib;

//create an object of all data
var globalData = {};
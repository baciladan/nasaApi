// baseUrl is a constat that holds the API Key
const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=VWx0R4uxE49DbUC896GFakKewtVFiafkULALYXTw";

// Function that displays the loader
function showLoader() {
    var loader = document.getElementById("appLoader");
    loader.style.display = "block";
}

//Function that hides the loader
function hideLoader() {
    var loader = document.getElementById("appLoader");
    loader.style.display = "none";
}


//Function to display the picture card
function displayPicture(picture) {
    // First we want to reset the pictureCard
    var reset = document.getElementById("pictureCard");
    reset.innerHTML = "";


    //Then we create the elements needed for displaying the new picture
    let pictureCard = document.createElement("div");
    pictureCard.classList.add("picture-card");

    //Checking for date || We get toda's date in the wanted format using toISOString and slice methods
    let today = new Date().toISOString().slice(0, 10)
    //In this IF ELSE Structure we simply check if today's date is equal to the date the user entered
    //In case it is we concatenate "Toda's Picture: " before the title of the image
    //If the date is different we concatenate "Picture from: " and the date before the image title
    if (today === picture.date) {
        let pictureTitle = document.createElement("h4");
        pictureTitle.classList.add("picture-title");
        pictureTitle.innerText = "Today's Picture: " + picture.title;
        let imageOfTheDay = document.createElement("img");
        imageOfTheDay.classList.add("image-of-the-day");
        imageOfTheDay.src = picture.url;

        pictureCard.append(pictureTitle, imageOfTheDay);

        document.getElementById("pictureCard").appendChild(pictureCard);
    }
    else {
        let pictureTitle = document.createElement("h4");
        pictureTitle.classList.add("picture-title");
        pictureTitle.innerText = "Picture from: " + picture.date + " " + picture.title;
        let imageOfTheDay = document.createElement("img");
        imageOfTheDay.classList.add("image-of-the-day");
        imageOfTheDay.src = picture.url;

        pictureCard.append(pictureTitle, imageOfTheDay);

        document.getElementById("pictureCard").appendChild(pictureCard);
    }
}

//Function to display error
function displayError(message) {
    hideLoader();
    let errorContainer = document.getElementById("errorContainer");
    errorContainer.innerText = message;
}
// Function to hide error
function hideError() {
    let errorContainer = document.getElementById("errorContainer");
    errorContainer.innerHTML = "";
}

//Function to handle the response from the server
//I added some new error codes I found online. These are the most common response status codes
function handleResponse(response) {
    if (response.status === 400) {
        // Here we throw an error that informs the user that the selected date needs to be between Jun 16, 1995 and Today's Date
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var today = new Date();
        var monthname = monthNames[today.getMonth()];
        var monthname = monthname.slice(0, 3);
        var date = monthname + ' ' + today.getDate() + ', ' + today.getFullYear();
        throw Error("Date must be between Jun 16, 1995 and " + date);
    } else if (response.status === 401) {
        throw Error("Not Authorized!");
    } else if (response.status === 403) {
        throw Error("Forbidden");
    } else if (response.status === 404) {
        throw Error("404! Picture not found!");
    } else if (response.status === 415) {
        throw Error("Unsupported Media Type!");
    } else if (response.status === 500) {
        throw Error("Internal server Error! Sorry!");
    } else if (response.status === 200) {
        return response.json();
    }
}

//Getting the date from the form
function getFormData() {
    var inputData = document.getElementById("dateInput");
    return inputData.value;
}
// Function to get the picture and title from the server using date parameter
function getPicture() {
    hideError();
    var reset = document.getElementById("pictureCard");
    reset.innerHTML = "";
    //We need the date as we are going to concatenate it to the API key before sending the request
    //We use "&date= " as this API uses query params
    var date = getFormData();

    showLoader();
    fetch(baseUrl + "&date=" + date, { method: 'GET' })
        .then(handleResponse)
        .then(function (parsedResponse) {
            var image = new Image();
            image.src = parsedResponse.url;
            image.addEventListener("load", function () {
                displayPicture(parsedResponse);
                hideLoader();
            });
            //If there are no other errors we know that the media Type of the date selected is not supported
            image.onerror = function () { displayError("Media Type Not Supported"); }
        })
        .catch(displayError);
}


window.addEventListener("load", function () {
    getPicture();//Display Today's Picture When Page Loads
    //Get the search button so we can add an event listener to it
    var searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", getPicture);//Searches for a New picture when the button is pressed using the date entered
});
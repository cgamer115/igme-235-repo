window.onload = init;

let recentSearches = [];
let recent = "";

function init() {
    // Get the search term from localStorage and set it in the search bar
    let lastSearchTerm = localStorage.getItem("lastSearchTerm");
    if (lastSearchTerm) {
        document.querySelector("#searchterm").value = lastSearchTerm; // Populate the search term in the search box
    }

    //Parse recent searches 
    let storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
        recentSearches = JSON.parse(storedSearches);
    }

    document.querySelector("#search").onclick = searchButtonClicked;
    document.querySelector("#history").onclick = recentSearchesClicked;
}

//Displays the user's most recent searches when the recent searches button is clicked
function recentSearchesClicked(){
    recent = `Recent Searches (Oldest to Newest):<br>`;
    for (let i = 0; i < recentSearches.length; i++)
    {
        recent += `${recentSearches[i]}<br>`
    }
    littleString = "";
    document.querySelector("#results").innerHTML = littleString;
    document.querySelector("#content").innerHTML = recent;

}

//Displays amiibo when the search button is clicked
function searchButtonClicked() {
    // 1 - main entry point to web service
    const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?name=";
    
    // 2 - build up our URL string
    let url = SERVICE_URL;
    
    // 3 - parse the user entered term we wish to search
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // 5
    term = term.trim();
    term = encodeURIComponent(term);
    url += term;

    //Store the term into recentSearches
    if (term != "")
    {
        recentSearches.push(term + " (Limit: " + limit.value + ")");
    }

    //Limit the amount of searches in the array by 10
    //Start deleting oldest searches if the array's length is 10
    if (recentSearches.length > 10)
    {
        recentSearches.shift();
    }

    //Store the recent searches through localStorage
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

    localStorage.setItem("lastSearchTerm", term);

    // 4 - Save the search term in localStorage
    localStorage.setItem("lastSearchTerm", term); // Save the current search term
    
    //Displays message while searching for amiibo
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    getData(url);
}

function getData(url){
    // 5 - create a new XHR object
    let xhr = new XMLHttpRequest();
    
    // 6 - set the onload handler
    xhr.onload = dataLoaded;
    
    // 7 - set the onerror handler
    xhr.onerror = dataError;
    
    // 8 - open connection and send the request
    xhr.open("GET",url);
    xhr.send();
}

function dataError(e){
    console.log("An error occurred");
}

function dataLoaded(e){
    // 1 - e.target is the xhr object
    let xhr = e.target;
    
    // 2 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);
    
    // 3 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    //----- THIS IS IMPORTANT -----
    // This code was working before and now it won't work. Ask about this
    

    if(!obj.amiibo || obj.amiibo.length == 0)
    {
        document.querySelector("#status").innerHTML = "<b>Cannot find any Amiibo under that term</b>";
        return; //Bail out
    }
    else
    {
        document.querySelector("#status").innerHTML = "<b>Success</b>";
    }

    // 4 - Check if the 'amiibo' array exists and has results
    let results = obj.amiibo;
    let littleString = "";
    let bigString = "";
    let limit = document.querySelector("#limit").value;
    
    //Displays all amiibo when the search has a number of results less than the limit
    //or when "All" is selected
    if (results.length <= limit || limit == "all")
    {
        for (let i = 0; i < results.length; i++)
        {
            let result = results[i];
            bigString += `<div class="amiibo-result"><img src="${result.image}" title="${result.character}" /><p><b>${result.character} - ${result.type}</b></p></div>`;
        }
    }
    //Displays amiibo at the selected limit
    else
    { 
        for (let i = 0; i < limit; i++)
        {
            let result = results[i];
            bigString += `<div class="amiibo-result"><img src="${result.image}" title="${result.character}" /><p><b>${result.character} - ${result.type}</b></p></div>`;
        }
    }

    //Displays the amount of amiibo found if the searchbar isn't empty
    if (displayTerm != "")
    {
        littleString += `<p><i>There are ${results.length} results for '${displayTerm}'</i></p>`;
    }
    //Displays a "here you go" type message when nothing is in the searchbar
    else
    {
        littleString += `<p><i>Here are some Amiibo</i></p>`;
    }
    //}


    // 5 - display final results to user
    document.querySelector("#results").innerHTML = littleString;
    document.querySelector("#content").innerHTML = bigString;
}
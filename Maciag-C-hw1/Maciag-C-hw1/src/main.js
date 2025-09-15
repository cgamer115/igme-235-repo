import {randomElement} from './utils.js';

let words1 = "";
let words2 = "";
let words3 = "";

const loadBabble = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/babble-data.json");
    xhr.onload = () => babbleLoaded(xhr);
    xhr.onerror = () => {
        console.error("Failed to load babble-data.json");
        document.querySelector("#output").innerHTML = "Failed to load data.";
    };
    xhr.send();
}

loadBabble();

const babbleLoaded = (xhr) => {
    try {
        const data = JSON.parse(xhr.responseText);
        words1 = data.words1;
        words2 = data.words2;
        words3 = data.words3;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        document.querySelector("#output").innerHTML = "Error parsing data.";
    }
    init();
}

const init = () =>{
    generateTechno(1);
    document.querySelector("#btn-gen-1").addEventListener("click", () => generateTechno(1));
    document.querySelector("#btn-gen-5").addEventListener("click", () => generateTechno(5));
}

const generateTechno = (num) =>{
    let str = "";
    for (let i = 0; i < num; i++){
        str += `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)} <br>`;
    }
    document.querySelector("#output").innerHTML = str;
}
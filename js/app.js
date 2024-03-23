// now i WANT THE USER TO ADD A TITLE 
console.log("HELLO , WELCOME TO NOTES-APP , U CAN TRY IT ");

// if i refresh , then also i should be able to see all the same nodes , so call the function in beginning 
showNotes(); // so that when reload , all notes should still remain , untill we externally delete 

// by default add focus on title 
document.addEventListener('DOMContentLoaded', function() {
    // Select the title input element
    let addTitle = document.getElementById('addTitle');

    // Focus on the title input
    addTitle.focus();
});

// Check if dark mode preference is stored in localStorage
let isDarkMode = localStorage.getItem('darkMode') === 'enabled';

// Function to set light mode styles
function setLightModeStyles() {
  document.body.style.backgroundColor = '#ffffff';
  document.body.style.color = '#000000';
}

// Function to set dark mode styles
function setDarkModeStyles() {
  document.body.style.backgroundColor = '#333333';
  document.body.style.color = '#ffffff';
}

// Set initial styles based on the stored preference
if (isDarkMode) {
  setDarkModeStyles();
}


// Toggle dark mode styles and update localStorage on button click
let toggleDarkModeBtn = document.getElementById('toggleDarkModeBtn'); // Add the ID to your button in HTML
toggleDarkModeBtn.addEventListener('click', function() {
  if (isDarkMode) {
    setLightModeStyles();
  } else {
    setDarkModeStyles();
  }

  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// add REDO and UNDO facility 
// Add these variables at the top of your app.js file
let undoStack = [];
let redoStack = [];
let addTxt = document.getElementById("addTxt");
let addTitle = document.getElementById("addTitle");

// Add an event listener to track input changes and update undo stack
addTxt.addEventListener('input', function () {
    addToUndoStack();
});

addTitle.addEventListener('input', function () {
    addToUndoStack();
});

// Function to add the current state to the undo stack
function addToUndoStack() {
    let currentState = {
        title: addTitle.value,
        text: addTxt.value
    };

    undoStack.push(currentState);

    // Clear redo stack when a new change is made
    redoStack = [];

    // Limit the size of the undo stack to avoid memory issues
    if (undoStack.length > 20) {
        undoStack.shift();
    }
}

// Function to undo the last change
function undo() {
    if (undoStack.length > 1) {
        let currentState = undoStack.pop();
        redoStack.push(currentState);

        let prevState = undoStack[undoStack.length - 1];

        addTitle.value = prevState.title;
        addTxt.value = prevState.text;
    }
}

// Function to redo the last undone change
function redo() {
    if (redoStack.length > 0) {
        let nextState = redoStack.pop();
        undoStack.push(nextState);

        addTitle.value = nextState.title;
        addTxt.value = nextState.text;
    }
}

// Add event listeners to your undo and redo buttons
let undoBtn = document.getElementById('undoBtn'); // Add this ID to your undo button in HTML
let redoBtn = document.getElementById('redoBtn'); // Add this ID to your redo button in HTML

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// add the note to local storage 
let addBtn = document.getElementById('addBtn');

// we want response , when we click the button , use addEventListener
addBtn.addEventListener("click" , function (e) {
    let addTxt = document.getElementById("addTxt");
    let addTitle = document.getElementById("addTitle");
    let clearNotesBtn = document.getElementById('clearNotesBtn'); // Added this line
    let timestamp = new Date().toLocaleString();

    // make title and text to store in dictionary in local-storage -> make it global
    let myObj= {
        title: addTitle.value,
        text:addTxt.value, 
        timestamp: timestamp
    }

     // Validate the title and description fields
     if (!validateTitle(addTitle.value) || !validateDescription(addTxt.value) ) {
        alert("Please enter a valid title for your note (at least 1 capital letter, length > 2, no integers or special characters) \n  Please enter a valid description for your note (at least 2 words, no integers or special characters).");
        addTitle.value = ''
        addTxt.value = ''
        return; // Stop execution if the title is not valid
    }
    
    // Get the current timestamp

    // if something-inititally is present in localStorage , then we want that also 
    let notes = localStorage.getItem("notes");
    
    if(notes == null) {
        notesObj = new Array()
        // notesObj=[]; // create a empty array , u can dynamically add elements 
    } 
    else{ 
        // if something already exists in notes , just add it in the array  , so parse the elements as strings , then u can easily get it in array  
        
        notesObj = JSON.parse(notes); // here notesObj => array of Objects 
    }


    // Check if the new note has the same title or description as existing notes
    let isDuplicate = notesObj.some(function (note) {
        return note.title.toLowerCase() === addTitle.value.toLowerCase() || 
        note.text.toLowerCase() === addTxt.value.toLowerCase();
    });

    if (isDuplicate) {
        alert("Error: Note with the same title or description already exists. Please use a different title or description.");
        // make that text and title as blank for new input (use .value attribute )
        addTxt.value = ""; 
        addTitle.value = ""; 
    }

    // not a duplicate note 
    else {
    
        // just push both the title , and text values
        notesObj.push(myObj); 
        localStorage.setItem("notes", JSON.stringify(notesObj)); // conversion of strings , then addition is easy in localStorage
    
        // make that text and title as blank for new input (use .value attribute )
        addTxt.value = ""; 
        addTitle.value = "";  
    
        //console.log(notesObj);
        showNotes();
        // After adding a note, update the state of the "Clear All Notes" button
        updateClearNotesButton();
    }

});

// Function to validate the title
function validateTitle(title) {
    // At least 1 capital letter, length > 2, no integers or special characters
    return /[A-Z]/.test(title) && title.length > 2 && !/\d/.test(title) && /^[a-zA-Z0-9 ]*$/.test(title);
}

// Function to validate the description
function validateDescription(description) {
    // At least 2 words, no integers or special characters
    let words = description.split(/\s+/).filter(word => word.length > 0);
    return words.length >= 2 && !/\d/.test(description) && /^[a-zA-Z0-9 ]*$/.test(description);
}

// i need to show these notes-now in the cards , for that i ll create a new function 

// function to show elements from localStorage
function showNotes() {
    let notes = localStorage.getItem("notes");
    
    if(notes == null) {
        notesObj = new Array()
    } 
    else{
         // if something already exists in notes , just add it in the array  , so parse the elements as strings , then u can easily get it in array  
        notesObj = JSON.parse(notes);
    }

    let html="";

    notesObj.forEach(function( element , index ) {
        // add that things(user input ) in to card ==> user's list of your-notes  
        html += `
        <div class="noteCard my-2 mx-2 card " style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title text-uppercase font-weight-bold">${element.title} - ${index + 1}</h5>
                <p class="card-text">${element.text}</p>
                <p class="card-text"><strong><span class="badge bg-success w-70 h-70"> ${element.timestamp}</span></strong></p>
                <button id="${index}" onclick="deleteNote(this.id)" class="btn btn-info">Delete Note</button>
            </div>
        </div> 
        `
    });

    let notesElm=document.getElementById("notes");
    if(notesObj.length != 0 ) { 
        // if already there is something inside notes , add those to the list , add that html into the list to display
        notesElm.innerHTML = html;     
    }
    // EACH-TIME U CAN CLEAR ==> USING localStorage.clear()  in console , then RELOAD THE PAGE , AND ADD AGAIN    
    else {
         // if i delete nothing should be there in the list  
        notesElm.innerHTML=`Nothing to show ! use "Add a Note" Section above to add notes. `
        // delete notesObj; // direct delete dynamically 
    }
}


// Select the clear notes button to delete all 
let clearNotesBtn = document.getElementById('clearNotesBtn');

// Add a click event listener
clearNotesBtn.addEventListener('click', clearAllNotes);

// Function to clear all notes
function clearAllNotes() {
    // Use a confirmation dialog to ensure the user wants to clear all notes
    let isConfirmed = confirm("Are you sure you want to clear all notes?");
    
    if (isConfirmed) {
        // Clear the localStorage
        localStorage.clear();
        
        // Call showNotes to update the UI
        showNotes();

        // Disable the "Clear All Notes" button after clearing
        updateClearNotesButton();
    }
}

// Call updateClearNotesButton when the page loads
window.addEventListener('load', function() {
    updateClearNotesButton();
});

// Function to update the state of the "Clear All Notes" button
function updateClearNotesButton() {
    let notes = localStorage.getItem("notes");
    let clearNotesBtn = document.getElementById('clearNotesBtn');

    if (notes == null || JSON.parse(notes).length === 0) {
        // Disable the button if there are no notes
        clearNotesBtn.setAttribute('disabled', 'true');
    } else {
        // Enable the button if there are notes
        clearNotesBtn.removeAttribute('disabled');
    }
}

// function to delete a note , when clicked on delete button , ==> CHECK BY RELOADING ALSO 
//modify that href to onclick="deleteNote(this.id)" in html from function above  => id is index 

// Modify the deleteNote function in app.js

// Function to delete a note
function deleteNote(index) {
    // Use a confirmation dialog to ensure the user wants to delete the note
    let isConfirmed = confirm("Are you sure you want to delete this note?");
    
    if (isConfirmed) {
        let notes = localStorage.getItem("notes");

        if (notes == null) {
            notesObj = new Array();
        } else {
            notesObj = JSON.parse(notes);
        }

        // Delete the note and update localStorage
        notesObj.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notesObj));

        // Show the updated notes
        showNotes();
    }
}

// now IF I SEARCH IN-THAT , I WANT TO SORT MY NOTES-LIST , AND SEARCH FOR PARTICULAR ONES
let search=document.getElementById('searchTxt')
search.addEventListener("input" , function() {
    // if bydefault -> user presses in CAPSLOCK , THEN also he wants result
    let inputVal=search.value.trim().toLowerCase(); 
    // console.log('input event fired' , inputVal); // it is printed , each time u search something in searchBar

    // i need to show only if searchBar matches its strings with my-notes-list(i need to check all the cards in my list )
    let noteCards=document.getElementsByClassName('noteCard');

    Array.from(noteCards).forEach (function(element) {
        // i need to get the content of each card first 
        let cardTitle = element.getElementsByTagName("h5")[0].innerText.toLowerCase();
        let cardTxt=element.getElementsByTagName("p")[0].innerText;  // p => paragraph  , to search for each card , cuz cardTxt is a element , i need to make it just a text / STING
        let cardTimestamp = element.getElementsByTagName("small")[0].innerText.toLowerCase(); // Added this line for timestamp

        // console.log(cardTxt); // when i search in my searchBar , for eachLetter , i get info about class  

        if(cardTxt.includes(inputVal) || cardTitle.includes(inputVal) || cardTimestamp.includes(inputVal)) { 
            // if strings of user-search are matching the strings of users-list , then display it 
            element.style.display="block";
            
        }
        else { 
            // if users-search , doesn't match the list ==> dont display it   
            element.style.display="none";
        }
    });
});
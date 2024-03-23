key Features of this project 

Enable/Disable dark-Mode => using Javascript 
undo/redo => for a title of note 

how to use js libraries -> typed.js (Welcome message) , three.js => to rotate image(avatar) 1-> clockwise 360 , 
2->anticlockwise , again 3->clock , 4->anticlockwise 

how to use BOOTSTRAP => card , classes (responsiveness), box-shadows(title-description-div , notes-full-part) , 
overflow-auto => to get a auto scroll bar for more text , tooltips(undo, redo, add a note), badges(time and date)

how to embedd HTML in JAVASCRIPT
how to search wrt => title , description, date and time (10:43 , etc ) 
Validate title and description 
dynamically disabling the button clearAllNotes
use of forEach() => loop 
Duplicate notes cannot be added (either with same title or same description)

DOM (document Object Model)
document.getElementById('clearNotesBtn')
document.getElementsByTagName("h5") => heading
document.getElementsByClassName('noteCard');
innerText => 
innerHtml => 
document.addEventListener('DOMContentLoaded') => when the page loads u are direcly focused to title

built-in js methods 

if we have a normal eventListener =>  eventListener.fn (function e) { ... }
some(function note) => to check any duplicate occurence of a note in fn  

localStorage.getItem("notes");
Date().toLocaleString(); => to indian standard time 
Array() => to create a new array 
push(object); 
includes() => to search for substring in a string , returns True or False

JSON.stringify() => When sending data to a web server, the data has to be a string, Convert a JavaScript object into a 
string with JSON.stringify().

JSON.parse() => A common use of JSON is to exchange data to/from a web server.
When receiving data from a web server, the data is always a string , Parse the data with JSON.parse(), and the data 
becomes a JavaScript object.

object.addEventListener('click' ); => to handle event on click 
confirm("Are you Sure") => gives a notification on top of application 

to use window object with eventListener , execute the specified function when the entire page has finished loading 
(including all assests like images, styles , scripts) , and update the state of "clear all notes button " refer below
window.addEventListener('load', function() {
    updateClearNotesButton();
});

clearNotesBtn.setAttribute('disabled', 'true'); =>  Disable the button if there are no notes
clearNotesBtn.removeAttribute('disabled'); => Enable the button if there are notes
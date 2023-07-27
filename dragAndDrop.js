let currentDrag;
let dragging = false;

function drag_start(event) {
    dragging = true
    currentDrag = event.target
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 
function drag_over(event) { 
    event.preventDefault(); 
} 
function drop(event) { 
    dragging = false
    var offset = event.dataTransfer.getData("text/plain").split(',');
    currentDrag.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    currentDrag.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
} 
var dms = document.getElementsByClassName("draggable")

function reposition(event){
    //called when dragged, continuosly
}

for(let i = 0;i < dms.length; i++){
    dms[i].addEventListener('dragstart',drag_start); 
    dms[i].addEventListener('drag',reposition); 
}

document.body.addEventListener('dragover',drag_over); 
document.body.addEventListener('drop',drop); 

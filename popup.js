let mousePos = { x: undefined, y: undefined };

let hovering = false
let hoverTime = 750 //time to wait before showing node info in milliseconds
let popupShowing = false
let popup;

function showPopup(){
    if(hovering === false){return}
    if(dragging){return}

    popup = document.createElement("div");
    popup.classList.add("hoverPopup");
    popup.style.left = (mousePos.x + 10) + "px"
    popup.style.top = (mousePos.y - 165) + "px"

    popup.innerHTML = `
        <div class="popupTitle">
            <h3 class="popupIcon">෫</h3>
            <h3>Key Results</h3>
        </div>

        <div class="popupBrow">
            <div></div>
            <h3>Lorem Ipsum</h3>
            <h3>Lorem Ipsum</h3>
            <h3>Lorem Ipsum</h3>
            <h3>Lorem Ipsum</h3>
        </div>
        `

    //popup.addEventListener("mouseleave", registerMouseLeave);
    document.body.appendChild(popup);
    popupShowing = true
}

function registerMouseEnter(){
    hovering = true
    if(popupShowing === false){
        //setTimeout(showPopup, hoverTime)
    }
}

function registerMouseLeave(){
    hovering = false
    if(popupShowing){
        popup.remove()
        popupShowing = false
    }
}

window.addEventListener('mousemove', (event) => {

    mousePos = { x: event.clientX, y: event.clientY };

});
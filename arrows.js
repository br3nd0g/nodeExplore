let connections = [
    {from: 1, to: 2, arrow: null},
    {from: 1, to: 3, arrow: null},
    {from: 3, to: 4, arrow: null},
    {from: 5, to: 3, arrow: null},
]

let nodes = []

//just for hardcoding example
nodePositions = [
    {x:746 , y:192},
    {x:488 , y:558},
    {x:977 , y:562},
    {x:1626, y:862},
    {x:680 , y:936},
]

let mousePos = { x: undefined, y: undefined };

let hovering = false
let hoverTime = 1000 //time to wait before showing node info in milliseconds
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
        setTimeout(showPopup, hoverTime)
    }
}

function registerMouseLeave(){
    hovering = false
    if(popupShowing){
        popup.remove()
        popupShowing = false
    }
}

function addNodes(){
    for(let i = 1; i <= 5; i++){

        const newNode = document.createElement("div");

        newNode.id = `node${i}`
        newNode.classList.add('node')
        newNode.classList.add('draggable')
        newNode.draggable = true;

        newNode.innerHTML = `
                <div class="title">
                    <h3 class="titleIcon" >ጰ</h3>
                    <h3>Product OKRs ${i}</h3>
                </div>
            
                <div class="bottomRow">
                    <div class="trackerContainer">
                        <div class="tracker"><h4>₪${4+i}</h4></div>
                        <div class="tracker"><h4>φ${9+i}</h4></div>
                    </div>
                    <div class="pictures" ></div>
                </div>`

        newNode.addEventListener("mouseenter", registerMouseEnter);
        newNode.addEventListener("mouseleave", registerMouseLeave);

        document.body.appendChild(newNode);

        nodes.push(newNode);
    }
}

function makeConnections(){
    for(let i = 0; i < connections.length; i++){

        const newArrow = arrowLine({
            source: '#node' + connections[i].from, 
            destination: '#node' + connections[i].to,
            color: "#6353D6",
            thickness: 10, 
            endpoint: { size: 0.75 } ,
            //if the parent from node is 1 it comes from the bottom for a heirarchal view, this can be changed later when plugged in to data
            sourcePosition: ((connections[i].from == 1) ? 'bottomCenter' : '')
        });

        connections[i].arrow = newArrow;
    }
}

function updateArrows(){
    for(let i = 0;i < connections.length;i++){
        connections[i].arrow.update({source: '#node' + connections[i].from, destination: '#node' + connections[i].to});
    }
}

//hardcoding positions for demo
function positionNodes(){
    for(let i = 0;i < nodes.length;i++){
        nodes[i].style.left = nodePositions[i].x + "px"
        nodes[i].style.top = nodePositions[i].y + "px"
    }
}

function setup(){
    addNodes()
    makeConnections()
    positionNodes()
    setInterval(updateArrows, 10);
}

window.addEventListener('mousemove', (event) => {

    mousePos = { x: event.clientX, y: event.clientY };

});

setup()
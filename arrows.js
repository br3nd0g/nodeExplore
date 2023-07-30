let nodes = []

function addNodes(){

    const rows = getPositions()

    for (const key in rows){

        for(const rowIndex in rows[key]){

            const offset = rows[key][rowIndex].offset;

            const setNodes = rows[key][rowIndex].nodes;

            for(const index in setNodes){

                const newNode = document.createElement("div");

                console.log(setNodes[index].id)
                newNode.id = `node${setNodes[index].id}`
                newNode.classList.add('node')
                newNode.classList.add('draggable')
                newNode.draggable = true;

                newNode.innerHTML = `
                        <div class="title">
                            <h3 class="titleIcon" >ጰ</h3>
                            <h3>${setNodes[index].name}</h3>
                        </div>
                    
                        <div class="bottomRow">
                            <div class="trackerContainer">
                                <div class="tracker"><h4>₪${4}</h4></div>
                                <div class="tracker"><h4>φ${9}</h4></div>
                            </div>
                            <div class="pictures" ></div>
                        </div>`

                //newNode.addEventListener("mouseenter", registerMouseEnter);
                //newNode.addEventListener("mouseleave", registerMouseLeave);

                document.body.appendChild(newNode);

                newNode.style.left = (setNodes[index].x + offset) + "px"
                newNode.style.top = (setNodes[index].y) + "px"

                nodes.push(newNode);
            }
        }
    }
}

function makeConnections(){
    for(let i = 0; i < connections.length; i++){

        const newArrow = arrowLine({
            source: '#node' + connections[i].from, 
            destination: '#node' + connections[i].to,
            color: "#6353D6",
            thickness: 10, 
            endpoint: { size: 0.5 } ,
            sourcePosition: '',
            destinationPosition: 'topCenter'
        });

        connections[i].arrow = newArrow;
    }
}

function updateArrows(){
    for(let i = 0;i < connections.length;i++){
        connections[i].arrow.update({source: '#node' + connections[i].from, destination: '#node' + connections[i].to});
    }
}


function setup(){
    addNodes()
    makeConnections()
    setInterval(updateArrows, 10);
}

setup()
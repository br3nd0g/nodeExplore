const nodeWidth = 460 //actual width 425 but 35 added for margin
const halfNodeWidth = nodeWidth / 2
const heirarchyStep = 600

let rowWidths = {}
let rowAlong = {}
let connections = []

function getMaxWidth(){

    let maxWidth = 0;
    let depth;

    getRowWidths(data, 1)

    for (const key in rowWidths){
        if(rowWidths[key] > maxWidth){
            maxWidth = rowWidths[key]
            depth = key
        }
    }

    return { maxWidth, depth }
}

function getRowWidths(objectives, depth){

    if(!rowWidths[depth]){rowWidths[depth] = 0}

    for(let i = 0; i < objectives.length; i++){

        rowWidths[depth] += 1

        if(objectives[i].subObjectives.length > 0){
            getRowWidths(objectives[i].subObjectives, depth + 1)
        }
    }
}

function findMinMaxX(objectsArray) {

  
    let lowestX = objectsArray[0].x;
    let highestX = objectsArray[0].x;
  
    for (const obj of objectsArray) {
      if (obj.x < lowestX) {
        lowestX = obj.x;
      }
      if (obj.x > highestX) {
        highestX = obj.x;
      }
    }
  
    return [ lowestX, highestX ];
}

function calculatePositions(mWidth){

    const pixelWidth = nodeWidth * mWidth
    let nodeRows = {}

    nodeRows = clumsyTree(data, 1, nodeRows, pixelWidth, 0, '')
    
    for (const key in nodeRows){
        console.log(nodeRows[key].sort((a, b) => a.leftPosX - b.leftPosX))
        nodeRows[key] = adjustRows(0, pixelWidth, nodeRows[key]);
        console.log(nodeRows[key])
    }

    return nodeRows
}

function clumsyTree(data, depth, rowData, maxPWidth, parentXPos, parentID){

    if(!rowData[depth]){ rowData[depth] = [] }
    if(!rowAlong[depth]){ rowAlong[depth] = 0 }

    const depthY = depth * heirarchyStep
    const rootXIncrements = maxPWidth / (data.length + 1)

    let distanceTracker = parentXPos
    let childSet = []
    let nodeId;
    
    const evenNodesInData = data.length % 2 === 0;

    if(evenNodesInData){
        distanceTracker += nodeWidth / 2;
        distanceTracker -= (data.length / 2) * nodeWidth
    }
    else{
        distanceTracker -= ((data.length - 1) / 2) * nodeWidth
    }

    for(let i = 0; i < data.length; i++){

        rowAlong[depth] += 1

        nodeId = `${depth}-${rowAlong[depth]}`

        let newXPos;

        if(depth === 1){
            newXPos = ( rootXIncrements*(i+1) ) - ( nodeWidth / 2 )
        }
        else{

            connections.push({ from: parentID, to: nodeId })

            newXPos = distanceTracker
            distanceTracker += nodeWidth
        }

        childSet.push({ x: Math.floor(newXPos), y: depthY, id: nodeId, name: data[i].name, description: data[i].description })

        if(data[i].subObjectives.length > 0){
            rowData = clumsyTree(data[i].subObjectives, depth + 1, rowData, maxPWidth, newXPos, nodeId)
        }
    } 

    let [ childSetLeft, childSetRight ] = findMinMaxX(childSet);

    rowData[depth].push({
        leftPosX: childSetLeft,
        rightPosX: childSetRight + nodeWidth,
        nodes: childSet,
        offset: 0,
        parentAlong: rowAlong[depth]
    })

    return rowData

}

function adjustRows(boundsLeft, boundsRight, objectsArray) {
  
    // checks if two objects overlap
    function doOverlapRightToLeft(obj1, obj2) {
        return obj1.rightPosX > obj2.leftPosX;
    }

    function doOverlapLeftToRight(obj1, obj2) {
        return obj1.leftPosX < obj2.rightPosX;
    }

    function topsAndTails(objArray, overlapFound){
        
        // Check if the first object is out of bounds on the left side
        if (objArray[0].leftPosX < boundsLeft) {

            overlapFound = true
            const diff = boundsLeft - objArray[0].leftPosX;
            objArray[0].leftPosX += diff;
            objArray[0].rightPosX += diff;
            objArray[0].offset += diff;
        }
        
        // Check if the last object is out of bounds on the right side
        const lastIndex = objArray.length - 1;
        if (objArray[lastIndex].rightPosX > boundsRight) {

            overlapFound = true
            const diff = objArray[lastIndex].rightPosX - boundsRight;
            objArray[lastIndex].rightPosX -= diff;
            objArray[lastIndex].leftPosX -= diff;
            objArray[lastIndex].offset -= diff;
        }

        return objArray
            
    }

    function boundaryCheck(curObj, overlapFound){ 

        // Check if the adjusted object is out of bounds on the left side
        if (curObj.leftPosX < boundsLeft) {

            overlapFound = true

            const diff = boundsLeft - curObj.leftPosX;
            curObj.rightPosX += diff;
            curObj.leftPosX += diff;
            curObj.offset += diff;
        }

        // Check if the object is out of bounds on the right side
        if (curObj.rightPosX > boundsRight) {

            overlapFound = true

            const diff = curObj.rightPosX - boundsRight;
            curObj.rightPosX -= diff;
            curObj.leftPosX -= diff;
            curObj.offset -= diff
        }

        return curObj
    }

    let offset;
    let overlapsExist = true;

    // sort based on leftPosX in ascending order 
    objectsArray.sort((a, b) => a.parentAlong - b.parentAlong);  

    while(overlapsExist === true){

        let overlapDetected = false 

        for (let i = 0; i < objectsArray.length - 1; i++) {

            let currentObj = objectsArray[i]
            let nextObj = objectsArray[i + 1];
        
            // Check if there is an overlap with the next object
            if (doOverlapRightToLeft(currentObj, nextObj)) {

                overlapDetected = true

                // Calculate the required offset to avoid overlap
                offset = currentObj.rightPosX - nextObj.leftPosX ;

                // Adjust the current object's position
                nextObj.leftPosX += offset;
                nextObj.rightPosX += offset;
                nextObj.offset += offset

            } 
        }

        for(let i = 0; i < objectsArray.length; i++){
            objectsArray[i] = boundaryCheck(objectsArray[i])
        }
    
        objectsArray = topsAndTails(objectsArray, overlapDetected)


        // sort based on leftPosX in ascending order

        for (let i = objectsArray.length - 1; i > 0; i--){
        
            let currentObj = objectsArray[i]
            let prevObj = objectsArray[i - 1];
    
            // Check if there is an overlap with the next object
            if (doOverlapLeftToRight(currentObj, prevObj)) {

                overlapDetected = true;

                // Calculate the required offset to avoid overlap
                offset = prevObj.rightPosX - currentObj.leftPosX;

                // Adjust the current object's position
                prevObj.leftPosX -= offset;
                prevObj.rightPosX -= offset;
                prevObj.offset -= offset
            } 
        }

        for(let i = 0; i < objectsArray.length; i++){
            objectsArray[i] = boundaryCheck(objectsArray[i])
        }

        objectsArray = topsAndTails(objectsArray, overlapDetected)

        if(overlapDetected === false){ overlapsExist = false }
    }

  
    return objectsArray;
}
  
function getPositions(){
    const { maxWidth, biggestRow } = getMaxWidth()
    const rowPositions = calculatePositions(maxWidth)
    return rowPositions
}
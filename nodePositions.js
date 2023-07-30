const nodeWidth = 460
const halfNodeWidth = nodeWidth / 2
const heirarchyStep = 450

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
    
    for(let i = 0; i < 10; i++){
        for (const key in nodeRows){
            nodeRows[key] = adjustRows(0, pixelWidth, nodeRows[key]);
        }
    }
    for (const key in nodeRows){
        nodeRows[key] = adjustRows(0, pixelWidth, nodeRows[key]);
    }

    return nodeRows
}

function clumsyTree(data, depth, rowData, maxPWidth, parentXPos, parentID){

    if(!rowData[depth]){ rowData[depth] = [] }
    if(!rowAlong[depth]){ rowAlong[depth] = 0 }

    const depthY = depth * heirarchyStep
    console.log(depthY)
    const rootXIncrements = maxPWidth / (data.length + 1)

    let distanceTracker = { left:parentXPos, right:parentXPos }
    let childSet = []
    let nodeId;
    
    const evenNodesInData = data.length % 2 === 0;
    let middlePlaced = false;
    let placeOnRight = true


    if(evenNodesInData){
        distanceTracker.left += nodeWidth / 2;
        distanceTracker.right -= nodeWidth / 2;
    }

    for(let i = 0; i < data.length; i++){

        rowAlong[depth] += 1

        nodeId = `${depth}-${rowAlong[depth]}`

        let newXPos;

        if(depth === 1){
            newXPos = rootXIncrements*(i+1)
        }
        else{

            connections.push({ from: parentID, to: nodeId })

            if(evenNodesInData){
                //even num. nodes
                if(placeOnRight){
                    distanceTracker.right += nodeWidth;
                    newXPos = distanceTracker.right
                    placeOnRight = false;
                }
                else{
                    distanceTracker.left -= nodeWidth;
                    newXPos = distanceTracker.left
                    placeOnRight = false;
                }
            }
            else{
                //odd num. nodes
                if(middlePlaced){
                    if(placeOnRight){
                        distanceTracker.right += nodeWidth;
                        newXPos = distanceTracker.right
                        placeOnRight = false;
                    }
                    else{
                        distanceTracker.left -= nodeWidth;
                        newXPos = distanceTracker.left
                        placeOnRight = false;
                    }
                }
                else{
                    newXPos = parentXPos;
                    middlePlaced = true;
                }
            }
        }


        childSet.push({ x: newXPos, y: depthY, id: nodeId, name: data[i].name, description: data[i].description })

        if(data[i].subObjectives.length > 0){
            rowData = clumsyTree(data[i].subObjectives, depth + 1, rowData, maxPWidth, newXPos, nodeId)
        }
    } 

    let [ childSetLeft, childSetRight ] = findMinMaxX(childSet);

    rowData[depth].push({
        leftPosX: childSetLeft,
        rightPosX: childSetRight,
        nodes: childSet,
        offset: 0
    })

    return rowData

}

function adjustRows(boundsLeft, boundsRight, objectsArray) {

    // sort based on leftPosX in ascending order
    objectsArray.sort((a, b) => a.leftPosX - b.leftPosX);
  
    // checks if two objects overlap
    function doOverlap(obj1, obj2) {
      return obj1.rightPosX >= obj2.leftPosX;
    }
  
    let offset = 0;
  
    for (let i = 1; i < objectsArray.length; i++) {

      const currentObj = objectsArray[i];
      const previousObj = objectsArray[i - 1];
  
      // calc the minimum rightPosX for the current object
      const minRightPosX = previousObj.rightPosX + offset;
  
      // Check if there is an overlap with the previous object
      if (doOverlap(currentObj, previousObj)) {
        // Calculate the required offset to avoid overlap
        offset = Math.max(offset, minRightPosX - currentObj.leftPosX + 1);
  
        // Adjust the current object's position
        currentObj.leftPosX += offset;
        currentObj.rightPosX += offset;
        currentObj.offset += offset
  
        // Check if the adjusted object is out of bounds on the right side
        if (currentObj.rightPosX > boundsRight) {
          const diff = currentObj.rightPosX - boundsRight;
          currentObj.rightPosX -= diff;
          currentObj.leftPosX -= diff;
          currentObj.offset -= diff
        }
      } else {
        // If there is no overlap, reset the offset
        offset = 0;
  
        // Check if the object is out of bounds on the right side
        if (currentObj.rightPosX > boundsRight) {
          const diff = currentObj.rightPosX - boundsRight;
          currentObj.rightPosX -= diff;
          currentObj.leftPosX -= diff;
          currentObj.offset -= diff
        }
      }
    }
  
    // Check if the first object is out of bounds on the left side
    if (objectsArray[0].leftPosX < boundsLeft) {
      const diff = boundsLeft - objectsArray[0].leftPosX;
      objectsArray[0].leftPosX += diff;
      objectsArray[0].rightPosX += diff;
      objectsArray[0].offset += diff;
    }
  
    // Check if the last object is out of bounds on the right side
    const lastIndex = objectsArray.length - 1;
    if (objectsArray[lastIndex].rightPosX > boundsRight) {
      const diff = objectsArray[lastIndex].rightPosX - boundsRight;
      objectsArray[lastIndex].rightPosX -= diff;
      objectsArray[lastIndex].leftPosX -= diff;
      objectsArray[lastIndex].offset -= diff;
    }
  
    return objectsArray;
}
  
function getPositions(){
    const { maxWidth, biggestRow } = getMaxWidth()
    const rowPositions = calculatePositions(maxWidth)
    return rowPositions
}
function keyResultPopup() {
    const container = document.createElement("div");
    container.innerHTML = `
            <div style="font-size:25px;color: black;padding: 10px; height: calc(165px - 20px); width: calc(500px - 20px); border-radius: 12px; background-color: rgb(221, 221, 221);">

                <div style="height: 25%;width: 100%;display: flex;align-items: center;justify-content: flex-start;">
                    <h3 style="margin: 0 15px;">෫</h3>
                    <h3>Key Results</h3>
                </div>

                <div style="height: 74%;width: 100%;display: flex;align-items: center;justify-content: space-evenly;">
                    <div style="background-color: rgba(255, 255, 255, 0); border-radius: 100%; aspect-ratio: 1; height: 70px; border: 10px solid rgb(33, 107, 49);"></div>
                    <h3 style="width: 65px; font-size: 20px;">Lorem Ipsum</h3>
                    <h3 style="width: 65px; font-size: 20px;">Lorem Ipsum</h3>
                    <h3 style="width: 65px; font-size: 20px;">Lorem Ipsum</h3>
                    <h3 style="width: 65px; font-size: 20px;">Lorem Ipsum</h3>
                </div>
            </div>
    `;
    return container;   
}

var svg =   '<svg xmlns="http://www.w3.org/2000/svg" width="425" height="165">' +
            '<rect rx="30" ry="30" x="0" y="0" width="100%" height="100%" fill="#ffffff" stroke-width="5" stroke="#000000"></rect>' +
            '<foreignObject x="15" y="10" width="100%" height="100%">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:30px;color: black; height: 165px; width: 425px;">' +
            
            `<div style="height: calc(50% - 2px);border-bottom: 2px solid rgb(129, 129, 129);display:flex;align-items:center;justify-content: flex-start;">
                <h3 style="margin: 0 15px;">ጰ</h3>
                <h3>Product OKRs</h3>
            </div>
          
            <div style="height: 49%;display:flex;align-items: center;justify-content: space-between;">
                <div style="height: 100%; display: flex; align-items: center; justify-content: space-evenly; width: 40%;">
                    <div style="background-color: gray; border-radius: 30%; width: 50px; height: 35px;"></div>
                    <div style="background-color: gray; border-radius: 30%; width: 50px; height: 35px;"></div>
                </div>

                <div style="height: 100%; display: flex; align-items: center; justify-content: space-evenly; width: 40%; margin-right: 25px;">
                    <div style="background-color: rgb(255, 255, 255); border-radius: 100%; aspect-ratio: 1; height: 35px; border: 1px solid black;"></div>
                    <div style="background-color: rgb(255, 255, 255); border-radius: 100%; aspect-ratio: 1; height: 35px; border: 1px solid black;"></div>
                    <div style="background-color: rgb(255, 255, 255); border-radius: 100%; aspect-ratio: 1; height: 35px; border: 1px solid black;"></div>
                </div>
            </div>` +

            '</div>' +
            "</foreignObject>" +
            "</svg>";

var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

var nodes = new vis.DataSet([
    { id: 1, image: url, shape: "image", title: keyResultPopup(), },
    { id: 2, image: url, shape: "image", },
    { id: 3, image: url, shape: "image", },
    { id: 4, image: url, shape: "image", },
]);

// create an array with edges
var edges = new vis.DataSet([
{ from: 1, to: 3, arrows: "to, from" },
{ from: 1, to: 2, arrows: "to" },
{ from: 2, to: 4 },
{ from: 2, to: 5 },
]);

// create a network
var container = document.getElementById("mynetwork");
var data = {
    nodes: nodes,
    edges: edges,
};
var options = {
    edges: {
        color: "#0543BE",
        background: {
            enabled: false,
            color: "#0543BE",
        },
        smooth: {
            enabled: true,
            type: "cubicBezier",
            forceDirection: "vertical",
            roundness: 0.8
        },
        physics: {
            enabled: false,
        },
        width: 5,
        endPointOffset: {
            from: -6,
            to: -6,
        },
        arrowStrikethrough: false,
    },
};
var network = new vis.Network(container, data, options);
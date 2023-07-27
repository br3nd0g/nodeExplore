for(let i = 1; i <= 4; i++){
    document.body.insertAdjacentHTML('afterbegin', `
        <div id="node${i}"class="node draggable" draggable="true">

            <div class="title">
                <h3 class="titleIcon" >ጰ</h3>
                <h3>Product OKRs</h3>
            </div>
        
            <div class="bottomRow">
                <div class="trackerContainer">
                    <div class="tracker"><h4>₪4</h4></div>
                    <div class="tracker"><h4>φ9</h4></div>
                </div>
                <div class="pictures" ></div>
            </div>
        </div>
    `)
}
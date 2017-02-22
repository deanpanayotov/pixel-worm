var table = document.getElementById('table');
var wrapper = document.getElementById('wrapper');

var GRID_MIN_LENGTH = 16;
var GRID_PADDING = 0.1;

var COLOR_BLACK = "#000000";
var COLOR_WHITE = "#FFFFFF";

window.addEventListener('resize', init, false);

function init(){

    while(table.rows.length > 0) {
        table.deleteRow(0);
    }

    var gridHeight, gridWidth, cellLength;
    if(window.innerWidth < window.innerHeight){
        cellLength = Math.floor((window.innerWidth * (1 - GRID_PADDING)) / GRID_MIN_LENGTH);
        gridHeight = GRID_MIN_LENGTH;
        gridWidth = Math.floor((window.innerHeight * (1 - GRID_PADDING)) / cellLength);
    }else{
        cellLength = Math.floor((window.innerHeight * (1 - GRID_PADDING)) / GRID_MIN_LENGTH);
        gridWidth = GRID_MIN_LENGTH;
        gridHeight = Math.floor((window.innerWidth * (1 - GRID_PADDING)) / cellLength);
    }

    for(var i=0; i<gridWidth; i++) {
        var row = table.insertRow(i);
        row.height = cellLength;
        for(var j=0; j<gridHeight; j++) {
            var cell = row.insertCell(j);
            cell.width = cellLength;
            cell.height = cellLength;
            cell.style.background = (j+(i%2)) % 2 === 0 ? COLOR_BLACK : COLOR_WHITE;
            cell.style.color = (j+(i%2)) % 2 === 1 ? COLOR_BLACK : COLOR_WHITE;
        }
    }
    wrapper.style.marginTop = Math.floor(window.innerHeight * (GRID_PADDING / 2)) + "px";
}

init();


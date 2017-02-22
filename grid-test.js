var table = document.getElementById('table');
var wrapper = document.getElementById('wrapper');

window.addEventListener('dblclick', dblclick, false);
window.addEventListener('resize', init, false);

var GRID_MIN_LENGTH = 16;
var GRID_PADDING = 0.1;

var COLOR_BLACK = "#000000";
var COLOR_WHITE = "#FFFFFF";

/** total time for a full cell color transition */
var interval = 1000;
/** number of iterations for a full cell color transition */
var iterations = 20;
/** 0-255; ~90 and below keeps the adjacent colors relative*/
var colorRange = 80;
var maxWorms = 3;

var gridHeight, gridWidth, cellLength;

var index = [];
index[0] = iterations;
/** cell color at beginning of coloring */
var pixel = [];
var pixelStep = [];
/** coordinates of current cell */
var x = [];
var y = [];

var wormTimers = [];

function init(){

    while(table.rows.length > 0) {
        table.deleteRow(0);
    }

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
            (function(){
                const temp_i = i;
                const temp_j = j;
                cell.addEventListener("click",function(){
                    click({x: temp_j, y: temp_i});
                });
            })();
        }
    }
    wrapper.style.marginTop = Math.floor(window.innerHeight * (GRID_PADDING / 2)) + "px";
}

init();

/** pick a new cell and pick a new color */
function colorize(id) {

    updateCell(id);
    var oldPixel = [];

    //TODO why is data obtained this way? Unnecessary calculations.
    oldPixel[0] = pixel[id][0] + pixelStep[id][0] * (iterations - 1);
    oldPixel[1] = pixel[id][1] + pixelStep[id][1] * (iterations - 1);
    oldPixel[2] = pixel[id][2] + pixelStep[id][2] * (iterations - 1);

    //TODO guarantee that the sampled pixel is within the new cell
    pixel[id] = rgbToArray(table.rows[x[id]].cells[y[id]].style.background);
    //c.getImageData(x[id] * cellSize, y[id] * cellSize, 1, 1).data;

    //TODO Use hsv/hsl color generation
    pixelStep[id][0] = (nextColor255(oldPixel[0], colorRange) - pixel[id][0]) / iterations;
    pixelStep[id][1] = (nextColor255(oldPixel[1], colorRange) - pixel[id][1]) / iterations;
    pixelStep[id][2] = (nextColor255(oldPixel[2], colorRange) - pixel[id][2]) / iterations;

    index[id] = 0;
}

/** randomly select an adjacent cell (with border checks) */
function updateCell(id) {
    //TODO use mod to wrap around the array
    if (Math.round(Math.random()) == 1) {
        if (x[id] === 0) {
            x[id] = 1;
            return;
        }
        if (x[id] == gridWidth - 1) {
            x[id] = gridWidth - 2;
            return;
        }
        if (Math.round(Math.random()) == 1) x[id]++;
        else x[id]--;

    } else {
        if (y[id] === 0) {
            y[id] = 1;
            return;
        }
        if (y[id] == gridHeight - 1) {
            y[id] = gridHeight - 2;
            return;
        }
        if (Math.round(Math.random()) == 1) y[id]++;
        else y[id]--;
    }
}

/** paint next iteration of color to the current cell */
function draw(id) {
    if (index[id] == iterations) {
        colorize(id);
        index[id] = 0;
    }

    table.rows[x[id]].cells[y[id]].style.background = rgbToHex(Math.round(pixel[id][0] + pixelStep[id][0] * index[id]), Math.round(pixel[id][1] + pixelStep[id][1] * index[id]), Math.round(pixel[id][2] + pixelStep[id][2] * index[id]));
    index[id]++;
}

/** start another worm */
function createWorm(mousePosition){

    if(!mousePosition){
        mousePosition = {x: rndInt(gridWidth), y: rndInt(gridHeight)};
    }

    //TODO fix this: If max worm count is reached --> clear
    //TODO this check should be moved in the click event
    var id;
    for(var i = 1;i < maxWorms; i++){
        if(typeof(wormTimers[i]) === 'undefined' || wormTimers[i] === null){
            id = i;
        }
    }
    if(typeof(id) === 'undefined'){
        id = maxWorms-1;
        clearInterval(wormTimers[id]);
    }

    x[id] = mousePosition.x;
    y[id] = mousePosition.y;
    index[id] = iterations - 1;
    pixel[id] = rgbToArray(table.rows[x[id]].cells[y[id]].style.background);
    pixelStep[id] = [0, 0, 0];
    wormTimers[id] = setInterval(function() { draw(id); }, interval / iterations);
}

/** set the current cell to the one @ mouse pointer and clear screen with random color */
function clear(position) {
    clearWormTimers();
    changeBackground();
    createWorm(position);
}

function changeBackground(){
    //TODO use hsv/hsl generation. Use only tones that are soft
    document.body.style.background = "rgb(" + rndInt(255) + ", " + rndInt(255) + ", " + rndInt(255) + ")";
}

function clearWormTimers(){
    for(var i=0;i<wormTimers.length;i++){
        clearInterval(wormTimers[i]);
    }
    wormTimers = [];
}

/** returns a random integer range [max(oldColor - range, 0): min(oldColor + range, 255)] */
function nextColor255(oldColor, range) {
    var newColor = oldColor + rndInt(range * 2) - range;
    if (newColor < 0) return 0;
    if (newColor > 255) return 255;
    return newColor;
}

/** returns a random integer in the range [0;max] */
function rndInt(max) {
    return Math.round(Math.random() * max);
}

function click(pos){
    createWorm(pos);
}

function dblclick(){
    clear();
}

function resize(){
    init();
    clear();
}

clear();



////

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbToArray(rgb){
    return rgb.replace(/[^\d,]/g, '').split(',').map(function(item) {
        return parseInt(item, 10);
    });
}